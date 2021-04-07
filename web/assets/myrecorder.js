var myrec_stream = null;
var myrec_context = null;
var myrec_source = null;
var myrec_node = null;
var myrec_buffer = null;
var myrec_bufferlen = 0;
var myrec_totaldatalen = 0;
var myrec_starttime = 0;
var myrec_callback = null;
var myrec_recording = false;
var myrec_samplerate = 0;

let NODE_BUFFERLEN = 1024*16;
let MYREC_FLUSHSECONDS = 5;

function myrec_onaudioprocess(e) {
    var data = e.inputBuffer.getChannelData(0);

    if (myrec_buffer == null) {
        myrec_buffer = [];
        myrec_totaldatalen = 0;

        // For the first callback to onaudioprocess, part of the buffer will contain sound from before the call to myrec_record().
        // We only want the slice that starts close to the call to record, so the timing of keyboard events matches the sound.
        let msSinceStart = Date.now() - myrec_starttime;
        let msPerBuffer = NODE_BUFFERLEN * 1000 / myrec_context.sampleRate;
        let numberOfSamplesToUse = NODE_BUFFERLEN * msSinceStart / msPerBuffer;

        console.log(`myrec_onaudioprocess using ${numberOfSamplesToUse} of ${data.length} samples for first block of data`);
        data = data.slice(data.length - numberOfSamplesToUse, data.length);
    }

    myrec_buffer.push([...data]);
    myrec_bufferlen += data.length;
    myrec_totaldatalen += data.length;
    kl_logEvent("recorder-mark", `${myrec_totaldatalen}`);
}

function myrec_flush() {
    if (myrec_buffer != null) {
        let oldbuffer = myrec_buffer;
        let oldbufferlen = myrec_bufferlen;
        myrec_buffer = [];
        myrec_bufferlen = 0;

        let merged = new Float32Array(oldbufferlen);
        var offset = 0;
        for (var i = 0; i < oldbuffer.length; i++) {
            merged.set(oldbuffer[i], offset);
            offset += oldbuffer[i].length;
        }

        let endtime = Date.now();
        myrec_callback(encodeWAV(merged), endtime);
    }
}

function myrec_flushlooper() {
    if (myrec_recording) {
        myrec_flush();
    }
    setTimeout(myrec_flushlooper, MYREC_FLUSHSECONDS*1000);
}
myrec_flushlooper();

async function myrec_turnon() {
    console.log("myrec_turnon");
    let constraints = {
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
        }
    }

    myrec_stream = await navigator.mediaDevices.getUserMedia(constraints);
    myrec_context = new AudioContext();
    myrec_source = myrec_context.createMediaStreamSource(myrec_stream);
    myrec_node = myrec_context.createScriptProcessor(NODE_BUFFERLEN, 1, 1);
    myrec_node.onaudioprocess = myrec_onaudioprocess;
    myrec_source.connect(myrec_node);
    myrec_node.connect(myrec_context.destination);
    myrec_samplerate = myrec_context.sampleRate;
}

function myrec_turnoff() {
    console.log("myrec_turnoff");
    myrec_stream = null;
    myrec_context = null;
    myrec_source = null;
    myrec_node = null;
}

function myrec_record(callback) {
    console.log("myrec_record");
    myrec_starttime = Date.now();
    myrec_buffer = null;
    myrec_recording = true;
    myrec_callback = callback;
    kl_logEvent("recorder-start", `${myrec_starttime}`);
}

function myrec_stoprecording() {
    console.log("myrec_stoprecording");
    if (myrec_recording) {
        myrec_flush();
        myrec_recording = false;
        kl_logEvent("recorder-stop", `${Date.now()}`);        
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
    view.setUint32(24, myrec_samplerate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, myrec_samplerate * 4, true);
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