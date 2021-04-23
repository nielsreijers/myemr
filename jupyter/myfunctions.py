import mywav
import mywav_adjust
import mydb

def getData(directory,
            sync_adjustment=0,
            adjust_missing_samples=False,
            keystroke_duration=50,
            keystroke_min_peak_level=0.01,
            use_directory_starttime=True):
    original_wav, sr, starttime_file = mywav.getCombinedWavs(directory, use_directory_starttime)
    audio_length_ms = int(len(original_wav) / sr * 1000)

    print (f'Recording starts at unix time {starttime_file} and lasts until {starttime_file + audio_length_ms}')

    events = mydb.getAllTraceEvents(directory)

    up_events = [x for x in events if x[2]=='keyup']
    down_events = [x for x in events if x[2]=='keydown']
    recorder_mark_events = [x for x in events if x[2]=='recorder-mark']

    first_mark_at = recorder_mark_events[0][1]
    first_mark_samples = recorder_mark_events[0][3]
    starttime_recorder_mark_event = int(first_mark_at-(first_mark_samples*1000/sr))
    starttime_recorder_start_event = [x for x in events if x[2]=='recorder-start'][0][1]
    
    print(f'Read {len(up_events)} keyup events, {len(down_events)} keydown events, and {len(recorder_mark_events)} recorder-mark events.')
    
    data = {
        'directory': directory,
        'original_wav': original_wav,
        'sr': sr,
        'starttime': starttime_file,
        'starttime_file': starttime_file,
        'starttime_recorder_mark_event': starttime_recorder_mark_event,
        'starttime_recorder_start_event': starttime_recorder_start_event,
        'up_events': up_events,
        'down_events': down_events,
        'recorder_mark_events': recorder_mark_events,
        'events': events
    }
    
    if adjust_missing_samples:
        data['wav'] = mywav_adjust.getAdjustedWav(data)
    else:
        data['wav'] = original_wav
    
    
    data['sync_adjustment'] = sync_adjustment
    data['keystroke_duration'] = keystroke_duration
    data['keystroke_min_peak_level'] = keystroke_min_peak_level
    addKeystrokes(data)
    
    return data

def addKeystrokes(data):
    sync_adjustment = data['sync_adjustment']
    keystroke_duration = data['keystroke_duration']
    keystroke_min_peak_level = data['keystroke_min_peak_level']
    keystrokes = getKeystrokes(data, sync_adjustment, keystroke_duration, keystroke_min_peak_level)
    data['keystrokes'] = keystrokes
    labels, wavs = map(list, zip(*keystrokes))
    data['keystroke_labels'] = labels
    data['keystroke_wavs'] = wavs

def getKeystrokes(data, sync_adjustment, sample_duration, min_peak_value):
    starttime = data['starttime_recorder_start_event']
    down_event_times = [(e[1]-starttime+sync_adjustment, e[3]) for e in data['down_events']]
    firstKeydown = down_event_times[0][0]
    sr = data['sr']
    srms = sr/1000
    wav = data['wav']

    print(f'First keydown event after {firstKeydown} ms')
    
    samples = [(key, wav[int(time*srms):int((time+sample_duration)*srms)]) for (time, key) in down_event_times]
    filtered_samples = [(key, wav) for (key, wav) in samples if max(wav) >= min_peak_value]
    print (f'Using {len(filtered_samples)} out of {len(samples)} keystrokes')
    
    return filtered_samples

def getSubset(data, offset_ms, length_ms=2000):
    sr = data['sr']
    starttime  = data['starttime_file'] + offset_ms
    
    subset_original_wav = data['original_wav'][int(offset_ms*sr/1000):int((offset_ms+length_ms)*sr/1000)]
    subset_wav = data['wav'][int(offset_ms*sr/1000):int((offset_ms+length_ms)*sr/1000)]
    subset_up_events   = [e for e in data['up_events']   if starttime < e[1] and e[1] < (starttime+length_ms)]
    subset_down_events = [e for e in data['down_events'] if starttime < e[1] and e[1] < (starttime+length_ms)]
    
    return {
        'wav': subset_wav,
        'original_wav': subset_original_wav,
        'sr': sr,
        'starttime_file': starttime,
        'up_events': subset_up_events,
        'down_events': subset_down_events
    }