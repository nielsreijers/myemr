import librosa.display
import bokeh.plotting
import bokeh.models
import bokeh.io
import matplotlib.pyplot as plt
import pandas as pd
import math
import datetime
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pandas as pd
import numpy as np

import mywav_adjust
import myfunctions
import mylearn

datetimeTickFormatter = bokeh.models.DatetimeTickFormatter(
    microseconds = ['%d-%m    %H:%M:%S.%3N'],
    milliseconds = ['%d-%m    %H:%M:%S.%3N'],
    seconds = ['%d-%m    %H:%M:%S.%3N'],
    minsec = ['%d-%m    %H:%M:%S.%3N'],
    minutes = ['%d-%m    %H:%M:%S.%3N'],
    hourmin = ['%d-%m    %H:%M:%S.%3N'],
    hours = ['%d-%m    %H:%M:%S.%3N'],
    days = ['%d-%m    %H:%M:%S.%3N'],
    months = ['%d-%m    %H:%M:%S.%3N'],
    years = ['%d-%m    %H:%M:%S.%3N'])

def plotLostSamples(data):
    _ = mywav_adjust.getDroppedSamplesTimeAndLength(data, showGraph=True)
    
def plotMatplotlib(data):
    wav=data['wav']
    sr=data['sr']
    starttime_file=data['starttime_file']
    up_events=data['up_events']
    down_events=data['down_events']
    
    plt.figure(figsize=(12, 4))
    plt.ylim((0,0.02))
    librosa.display.waveplot(wav, sr=sr, alpha=0.1)
    plt.scatter([(x[1]-starttime_file)/1000 for x in down_events], [0 for _ in down_events])
    plt.scatter([(x[1]-starttime_file)/1000 for x in up_events], [0.01 for _ in up_events])

def plotWaveAndKeys(data, adjust_ms=0, whichWav='wav'):
    wav=data[whichWav]
    sr=data['sr']
    starttime_file=data['starttime_file']
    up_events=data['up_events']
    down_events=data['down_events']
    
    s_sound = pd.Series(data=wav, index=range(len(wav)))
    df_sound = pd.DataFrame(s_sound)
    df_sound.reset_index(inplace=True)
    df_sound.columns = ['Index', 'wav']
    df_sound['unixtime'] = df_sound['Index'].apply(lambda x: starttime_file + x * 1000 / sr)
    df_sound['time'] = df_sound['Index'].apply(lambda x: datetime.datetime.utcfromtimestamp(int(x / 1000)))

    bokeh.io.output_notebook()
    p = bokeh.plotting.figure()
    p.xaxis.formatter = datetimeTickFormatter
    p.xaxis.major_label_orientation = math.pi/2
    p.line(x='unixtime', y='wav', source=df_sound)
    
    def plotEvents(events, colour="black", y_offset=0):
        df = pd.DataFrame()
        df['x'] = [e[1]+adjust_ms for e  in events]
        df['y'] = [0.015]*len(events)
        df['text'] = [e[3][3:] if e[3].startswith('Key') else e[3] for e in events]
        source = bokeh.models.ColumnDataSource(df)

        p.scatter(x='x', y='y', source=source, size=10, color=colour, alpha=0.5)
        p.add_layout(bokeh.models.LabelSet(x='x', y='y', text='text', source=source, x_offset=5, y_offset=y_offset, render_mode='canvas', angle=math.pi/2, text_color=colour))
    
    plotEvents(down_events, "green", 20)
    plotEvents(up_events, "red", -120)
       
    bokeh.plotting.show(p)

def plotKeystroke(data, i):
    (key, wav) = data['keystrokes'][i]
    sr=data['sr']
    _plotKeystroke(f'{i}: {key}', wav, sr)

def _plotKeystroke(title, wav, sr):
    plt.figure(figsize=(6, 4))
    plt.ylim((-1,1))
    librosa.display.waveplot(wav, sr=sr)
    plt.title(title)

def plotKeystrokeContext(data, i=0, adjust_ms=0):
    firstKeystrokeAt = data['down_events'][i][1]
    startAt = data['starttime']
    plotFrom = max(firstKeystrokeAt-startAt-1000, 0)
    subset = myfunctions.getSubset(data, plotFrom, 2000)
    plotWaveAndKeys(subset, adjust_ms = adjust_ms)

    keystroke_duration = data['keystroke_duration']
    keystroke_min_peak_level = data['keystroke_min_peak_level']
    adjusted_keystrokes = myfunctions.getKeystrokes(data, adjust_ms, keystroke_duration, keystroke_min_peak_level)
    key = adjusted_keystrokes[i][0]
    wav = adjusted_keystrokes[i][1]
    _plotKeystroke(key, wav, data['sr'])

def _getKeystrokes(data, sync_adjustment, sample_duration, min_peak_value):
    starttime = data['starttime_recorder_start_event']
    down_event_times = [(e[1]-starttime+sync_adjustment, e[3]) for e in data['down_events']]
    firstKeydown = down_event_times[0][0]
    sr = data['sr']
    srms = sr/1000
    wav = data['wav']

def plotPCA(data, featurenames):
    features, _ = mylearn.getConcatenatedFeatures(data, featurenames)
    scaled_features = StandardScaler().fit_transform(features)
    pca = PCA(n_components=2)
    principalComponents = pca.fit_transform(scaled_features)
    principalDf = pd.DataFrame(data = principalComponents, columns = ['principal component 1', 'principal component 2'])
    labelsDf = pd.DataFrame(data = [x[0] for x in data['keystrokes']], columns=['key'])
    finalDf = pd.concat([principalDf, labelsDf], axis = 1)
    
    fig = plt.figure(figsize = (8,8))
    ax = fig.add_subplot(1,1,1) 
#     ax.set_xlabel('Principal Component 1', fontsize = 15)
#     ax.set_ylabel('Principal Component 2', fontsize = 15)
    ax.set_title('2 component PCA', fontsize = 20)
    keys = set(labelsDf['key'])
#     colors = ['r', 'g', 'b']
    for key in keys: #target, color in zip(targets,colors):
        indicesToKeep = finalDf['key'] == key
        ax.scatter(finalDf.loc[indicesToKeep, ['principal component 1']]
                   , finalDf.loc[indicesToKeep, ['principal component 2']]
#                    , c = color
                   , s = 50)
    ax.legend(keys)
    ax.grid()
    
    print (f'Explained variance in 2D plot: {sum(pca.explained_variance_ratio_)}')
    
    
