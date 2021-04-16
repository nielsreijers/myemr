var al_state = {
    turnedon: false,
    recording: false,
    location: '',
    buffer: null,
    seq_nr: 0,
    bufferlen: 0,
    totaldatalen: 0
}

let AL_NODE_BUFFERLEN = 1024*16;
let AL_FLUSHSECONDS = 5;

// public interface: al_turnoff, al_stopRecording, al_startNewRecording
function al_turnoff() {
    console.log("al_turnoff() called.");

    if (al_state.turnedon) {
        al_stopRecording();
        myrec_turnoff();
        al_state.turnedon = false;        
    }
}

async function al_startNewRecording(location) {
    console.log(`al_startNewRecording('${location}') called.`);

    if (!al_state.turnedon) {
        console.log('turning on recorder...');

        let constraints = {
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
            }
        }
    
        let myrec_stream = await navigator.mediaDevices.getUserMedia(constraints);
        let myrec_context = new AudioContext();
        let myrec_source = myrec_context.createMediaStreamSource(myrec_stream);
        let myrec_node = myrec_context.createScriptProcessor(AL_NODE_BUFFERLEN, 1, 1);
        myrec_node.onaudioprocess = function(e) {
            if (al_state.recording) {
                // see also: http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
                let time = Date.now();
                let buf  = e.inputBuffer.getChannelData(0);
                al_onaudioprocess(buf, time);
            }
		};
        
        myrec_source.connect(myrec_node);
        myrec_node.connect(myrec_context.destination);
        al_state.samplerate = myrec_context.sampleRate;

        al_state.turnedon = true;
        console.log('turned on recorder.');
    }

    if (al_state.recording) {
        console.log("al_startNewRecording: stoping current recording...");
        al_stopRecording();
    }
    
    al_startRecording(location);
}

function al_startRecording(location) {
    console.log(`al_startRecording('${location}') called.`);
    al_state.starttime = Date.now();
    al_state.recording = true;
    al_state.location = location;
    al_state.seq_nr = 0;
    al_state.buffer = null;
    // al_state.worker.postMessage({ cmd: 'new',
    //                               location: al_state.location,
    //                               starttime: al_state.starttime,
    //                               samplerate: al_state.samplerate,
    //                               baseurl:  });

    kl_logEvent("startaudio", `${location}-${al_state.starttime}`);
    kl_logEvent("recorder-start", `${al_state.starttime}`);
}

function al_stopRecording() {
    console.log("al_stopRecording() called.");
    if (al_state.recording) {
        al_state.worker.postMessage({ cmd: 'flush'});
        kl_logEvent("recorder-stop", `${Date.now()}`);
        kl_logEvent("stopaudio", `${location}-${Date.now()}`);
        al_state.recording = false;        
    }
}

function al_flushlooper() {
    if (al_state.recording) {
        al_flush();
    }
    setTimeout(al_flushlooper, AL_FLUSHSECONDS*1000);
}
al_flushlooper();


function al_onaudioprocess(data, time) {
    if (al_state.buffer == null) {
        // For the first callback to onaudioprocess, part of the buffer will contain sound from before the call to myrec_record().
        // We only want the slice that starts close to the call to record, so the timing of keyboard events matches the sound.

		al_state.buffer = [];
        al_state.totaldatalen = 0;

        let msSinceStart = time - al_state.starttime;
        let numberOfSamplesToUse = Math.floor(msSinceStart * al_state.samplerate / 1000);
		if (numberOfSamplesToUse > data.length) {
			numberOfSamplesToUse = data.length;
		}

        console.log(`al_onaudioprocess using ${numberOfSamplesToUse} of ${data.length} samples for first block of data`);
        data = data.slice(data.length - numberOfSamplesToUse, data.length);
    }

    al_state.buffer.push([...data]);
	al_state.bufferlen += data.length;
    al_state.totaldatalen += data.length;
	self.postMessage({cmd: 'logevent', type: "recorder-mark", data: `${al_state.totaldatalen}`, time: time})
}

function al_flush() {
    if (al_state.buffer != null) {
        let endtime = Date.now();
        let oldbuffer = al_state.buffer;
		let oldbufferlen = al_state.bufferlen; 
        al_state.buffer = [];
		al_state.bufferlen = 0;

        let merged = new Float32Array(oldbufferlen);
        var offset = 0;
        for (var i = 0; i < oldbuffer.length; i++) {
            merged.set(oldbuffer[i], offset);
            offset += oldbuffer[i].length;
        }

		al_upload_blob(encodeWAV(merged), endtime);
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}
function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
function encodeWAV(samples) {
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);
    let numChannels = 1;

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, al_state.samplerate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, al_state.samplerate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, numChannels * 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: 'audio/wav' });
}

function al_blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
};

function al_upload_blob(blob, fragment_endtime) {
    al_blobToBase64(blob).then(base64encoded => {
        // base64encoded now looks something like this:
        //    "data:video/x-matroska;codecs=avc1,opus;base64,Q7Z1…xMIqrZDmb7+gYAUyoqJ/euC8Zu5hEe6frr3xfDTLJSfLqPJQ="
        // We only want to send the base64 encoded data
        base64encoded = base64encoded.substr(base64encoded.indexOf('base64')+7)

        const formData = new FormData();
        formData.append('starttime', al_state.starttime);
        seq_nr_string = "000000" + al_state.seq_nr++;
        formData.append('fragment_number', seq_nr_string.substr(seq_nr_string.length-6));
        formData.append('fragment_endtime', fragment_endtime);
        formData.append('location', al_state.location);
        formData.append('base64data', base64encoded);

        let url = `${window.location.origin}/logger/audiologger`;
        console.log(`[audiologger]: POST ${al_state.location}-${al_state.starttime}.`)
        fetch(url, { method: 'post', body: formData })
        .catch((error) => {
            console.log(`[audiologger]: POST ${al_state.location}-${al_state.starttime} failed: ${error}`);
        });           
    });
}