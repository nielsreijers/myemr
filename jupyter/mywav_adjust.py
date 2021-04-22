import numpy as np
import pandas as pd
import math
import statistics
from scipy.signal import find_peaks
import bokeh.io

import myplot

def getSteps(s):
    s = list(s)
    return [cur-prev for (cur, prev) in zip(s, [s[0]]+s)]

def moving_ranges(data, context):
    data2 = list(data)
    data3 = [data2[0]]*(context) + data2
    return [data3[i:i+1+context] for i in range(len(data2))]
def moving_ranges_f(data, context, f):
    ranges = moving_ranges(data, context)
    return [f(x) for x in ranges]
def moving_average(x, context):
    return moving_ranges_f(x, context, statistics.mean)
def moving_var(x, context):
    return moving_ranges_f(x, context, lambda r: max(r)-min(r))

## Calculate where to add dummy values to compensate for occassionally dropped samples and keep the audio in sync with database

# The difference between the number of samples in the data, and the expected number based on sampling rate and during
# varies over time. Samples don't get delivered exactly on time, but usually the difference stays within a clear bound.
#
# Two things may occur that break this pattern:
#  1) occassionally some samples get queued up and delivered late, so we see a temporary increase in the difference which quickly gets corrected when the samples do arrive
#  2) on other occassions samples really get dropped and we see the difference increase permanently
#
# To keep keystrokes in sync, the first case doesn't matter since later we will only use the samples and don't care when they were received,
# but for the second case we want to insert some dummy samples to make sure the samples after that stay in sync.



def getDroppedSamplesTimeAndLength(data, showGraph=False):
    CONTEXT=4
       
    # Transform the list of mark events into a dataframe with a column, samplesDiff,
    # indicating the difference between the actual number of samples and the expected
    # number based on sampling rate and time since the start of the recording.
    timeAndBufferSize = [(x[1], x[3]) for x in data['recorder_mark_events']]
    starttime=timeAndBufferSize[0][0]
    startsize=timeAndBufferSize[0][1]
    times = [t for (t, s) in timeAndBufferSize]
    samplesDiff = [(s-startsize)-((t-starttime)*data['sr']/1000) for (t, s) in timeAndBufferSize]
    msSinceLastSample=getSteps(times)
    df = pd.DataFrame()
    df['time']=times
    df['samplesDiff']=samplesDiff
    df['msSinceLastSample']=msSinceLastSample    
    
    # First find the peaks and dips in the oscilating sample difference
    peaks = find_peaks(df['samplesDiff'])[0]
    dips = find_peaks([-x for x in df['samplesDiff']])[0]
    dips_and_peaks = np.concatenate((dips, peaks))
    dips_and_peaks.sort()
    df_dips_peaks = df.iloc[dips_and_peaks].copy()
    df_dips_peaks['dippeak'] = ['dip' if x in dips else 'peak' for x in df_dips_peaks.index]
    df_dips_peaks['samplesDiffMV'] = moving_var(df_dips_peaks['samplesDiff'], CONTEXT)

    # Filter out these outliers based on the max difference in the samplesDiff column over a trailing window of CONTEXT samples
    median_moving_var = statistics.median(moving_var(df_dips_peaks['samplesDiff'], CONTEXT))    
    not_outliers = [i for i in range(len(dips_and_peaks)-1)
                    if df_dips_peaks['samplesDiff'].iloc[i+1] - df_dips_peaks['samplesDiff'].iloc[i] < 1.5*median_moving_var]
    df_dips_peaks_clean = df_dips_peaks.iloc[not_outliers].copy()
    # recalculate this since it will have changed after removing the outliers
    df_dips_peaks_clean['samplesDiffMV'] = moving_var(df_dips_peaks_clean['samplesDiff'], CONTEXT)     

    # We now want to find the segments of stable data, and calculate the number samples lost by comparing the average value for peaks and dips in two blocks
    # The variation in sample difference is quite stable within a block, so we mark points where this variation exceed 110% of the median variance
    samples_lost_at = [i for i in range(1, len(df_dips_peaks_clean))
                if ((df_dips_peaks_clean['samplesDiffMV'].iloc[i-1] < median_moving_var*1.1)
                and (df_dips_peaks_clean['samplesDiffMV'].iloc[i]   >= median_moving_var*1.1))]
    df_samples_lost_at = df_dips_peaks_clean.iloc[samples_lost_at].copy()
    
    # Determine a list of intervals where the dips and peaks are stable based on the points where samples are lost,
    # adding the first and last samples as endpoints
    firstTime = df['time'].iloc[0]
    lastTime = df['time'].iloc[-1]
    segments = pd.DataFrame(zip([firstTime] + list(df_samples_lost_at['time']),
                                 list(df_samples_lost_at['time'])+[max(df_dips_peaks_clean['time'])]))
    segments.columns = ['from', 'to']

    # Calculate the Mean value for dips and peaks over each interval
    def getMeanDipsPeaksForInterval(row, dippeak):
        samples =  df_dips_peaks_clean[df_dips_peaks_clean.time.between(row['from'], row['to']) 
                                        & (df_dips_peaks_clean.samplesDiffMV < median_moving_var*1.1)
                                        & (df_dips_peaks_clean.dippeak==dippeak)]['samplesDiff']
        return statistics.mean(samples) if len(samples) > 0 else np.NaN
    segments['avg_peak'] = segments.apply(lambda row: getMeanDipsPeaksForInterval(row, 'peak'), axis=1)
    segments['avg_dip'] = segments.apply(lambda row: getMeanDipsPeaksForInterval(row, 'dip'), axis=1)

    # Calculate the required adjustment based on the difference in mean peaks and dips for all but the first interval
    segments.insert(0, 'adjustment', 0)
    segments.insert(0, 'cumulative_adjustment', 0)
    adjustmentSoFar = 0
    for index, _ in segments.iterrows():
        diffs = [segments['avg_peak'].iloc[0] - segments['avg_peak'][index] - adjustmentSoFar,
                segments['avg_dip'].iloc[0] - segments['avg_dip'][index] - adjustmentSoFar]
        diffs = [i for i in diffs if not math.isnan(i)]
        if len(diffs) > 0:
            adjustment = int(statistics.mean(diffs))
            if adjustment > 0:
                segments.at[index, 'adjustment'] = adjustment
                adjustmentSoFar += adjustment
            segments.at[index, 'cumulative_adjustment'] = adjustmentSoFar


    if showGraph:
        print(f'sr: {data["sr"]}')
        print(f'median moving var: {median_moving_var}')
        bokeh.io.output_notebook()
        p = bokeh.plotting.figure()
        p.xaxis.formatter = myplot.datetimeTickFormatter
        p.xaxis.major_label_orientation = math.pi/2

        # Plot these points, which will contain some outlier for case 1) above
        p.scatter(x='time', y='samplesDiff', source=df_dips_peaks, color="yellow")
        p.line(x='time', y='samplesDiffMV', source=df_dips_peaks, color="yellow")
        
        # Then plot the dips and peaks again for the cleaned data
        p.scatter(x='time', y='samplesDiff', source=df_dips_peaks_clean, color="blue")
        p.line(x='time', y='samplesDiffMV', source=df_dips_peaks_clean, color="blue")
        
        # Plot the points where data is lost in red
        p.scatter(x='time', y='samplesDiffMV', source=df_samples_lost_at, color="red")
    
        # Create new dataframe for visualisation only to show the dips and peaks after adjustment
        df_adjusted = df_dips_peaks_clean.copy()
        df_adjusted['adjusted'] = df_dips_peaks_clean['samplesDiff'].copy()
        segment_index = 0
        for index, _ in df_adjusted.iterrows():
            if segment_index + 1 < len(segments) and segments['from'].iloc[segment_index+1] == df_adjusted['time'].loc[index]:
                segment_index += 1
            df_adjusted.at[index, 'adjusted'] += segments['cumulative_adjustment'].iloc[segment_index]
        p.scatter(x='time', y='adjusted', source=df_adjusted, color="green")

        bokeh.plotting.show(p)
#         print(segments)

    return segments

def getAdjustedWav(data, showGraph=False):
    segments = getDroppedSamplesTimeAndLength(data, showGraph)
    def getSampleIndex(time):
        starttime = segments.iloc[0]['from']
        return int((time - starttime) * data['sr'] / 1000)
    original_wav = data['original_wav']

    new_wav = original_wav[0:getSampleIndex(segments.iloc[0]['to'])]
    for i in range(1,len(segments)):
        new_wav = np.append(new_wav, [0] * int(segments.iloc[i]['adjustment']))
        new_wav = np.append(new_wav, original_wav[getSampleIndex(segments.iloc[i]['from']):getSampleIndex(segments.iloc[i]['to'])])
    new_wav = np.append(new_wav, original_wav[getSampleIndex(segments.iloc[-1]['to']):len(original_wav)])
    return new_wav