import os
import re
import librosa
import numpy as np

AUDIO_FILES_DIR='../web/data/videos'

def getCombinedWavs(directory, use_directory_starttime=True, verbose=False):
    nr = 0
    sr = None
    y = None
    files = os.listdir(f'{AUDIO_FILES_DIR}/{directory}')
    files.sort()
    last_endtime = None
    total_gap = 0
    for filename in files:
        fullfilename = f'{AUDIO_FILES_DIR}/{directory}/{filename}'
        y_part, sr_part = librosa.load(fullfilename, sr=None)
        
        file_end = int(re.search("^\d*-(\d*)\.wav", filename).group(1))
        file_start = file_end - int(len(y_part) * 1000 / sr_part)
        if sr == None:
            sr = sr_part
            y = y_part
            end = int(re.search("^\d*-(\d*)\.wav", files[0]).group(1))
            unixtime_start_directory = int(re.search(".*-(\d*)", directory).group(1))
            unixtime_start_first_file = file_start            
        else:
            if sr != sr_part:
                raise Exception("Sampling rate mismatch")
            y = np.concatenate([y, y_part])
        nr += 1
        if verbose:
            if last_endtime == None:
                print (f'part {"%3d" % nr}, {"%7d" % len(y_part)} samples from unixtime {file_start} to {file_end}.')
            else:
                gap = file_start - last_endtime
                total_gap += gap
                print (f'part {"%3d" % nr}, {"%7d" % len(y_part)} samples from unixtime {file_start} to {file_end}. Gap: {gap}. Total gap: {total_gap}')
            last_endtime = file_end
    
    if use_directory_starttime:
        unixtime_start = unixtime_start_directory
    else:
        unixtime_start = unixtime_start_first_file           
    unixtime_end = int(unixtime_start + len(y) * 1000 / sr)
    if verbose:
        print (f'total:    {"%7d" % len(y)} samples from unixtime {unixtime_start} to {unixtime_end}')
    print (f'Read {nr} parts from {directory}. {y.shape[0]} samples: {"%.1f" % (y.shape[0]/sr)} seconds at {sr} samples/sec.')
    print (f'Start time according to first file is {unixtime_start_first_file - unixtime_start_directory} ms behind the start time according to the directory.')
    return y, sr, unixtime_start