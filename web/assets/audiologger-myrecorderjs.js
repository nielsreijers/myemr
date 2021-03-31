var al_state = {
    turnedon: false,
    recording: false,
    seq_nr: 0,
    location: ''
}

// public interface: al_turnoff, al_stopRecording, al_startNewRecording

async function al_turnon() {
    console.log("al_turnon() called.");

    if (!al_state.turnedon) {
        myrec_turnon();
        al_state.turnedon = true;
    }
}

function al_turnoff() {
    console.log("al_turnoff() called.");

    if (al_state.turned) {
        al_stopRecording();
        myrec_turnoff();
        al_state.turnedon = false;        
    }
}

async function al_startNewRecording(location) {
    console.log(`al_startNewRecording('${location}') called.`);
    if (!al_state.turnedon) {
        console.log('turning on recorder.js...');
        await al_turnon();
    }
    if (al_state.recording) {
        console.log("al_startNewRecording: stoping current recording...");
        al_stopRecording();
    } else {
        console.log("al_startNewRecording: no current recording.");
    }
    al_startRecording(location);
}

function al_startRecording(location) {
    console.log(`al_startRecording('${location}') called.`);
    let starttime = `${Date.now()}`;
    al_state.recording = true;
    al_state.seq_nr = 0;
    al_state.location = location;
    kl_logEvent("startaudio", `${location}-${starttime}`);
    myrec_record(function (blob, endtime) {
        al_upload_blob(blob, al_state.seq_nr++, starttime, endtime, location);
    });
}

function al_stopRecording() {
    console.log("al_stopRecording() called.");
    if (al_state.recording) {
        kl_logEvent("stopaudio", `${location}-${Date.now()}`);
        myrec_stoprecording();
        al_state.recording = false;        
    }
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

function al_upload_blob(blob, seq_nr, starttime, fragment_endtime, location) {
    console.log(`upload blob for ${location}`)
    al_blobToBase64(blob).then(base64encoded => {
        // base64encoded now looks something like this:
        //    "data:video/x-matroska;codecs=avc1,opus;base64,Q7Z1…xMIqrZDmb7+gYAUyoqJ/euC8Zu5hEe6frr3xfDTLJSfLqPJQ="
        // We only want to send the base64 encoded data
        base64encoded = base64encoded.substr(base64encoded.indexOf('base64')+7)

        const formData = new FormData();
        formData.append('starttime', starttime);
        seq_nr_string = "000000" + seq_nr;
        formData.append('fragment_number', seq_nr_string.substr(seq_nr_string.length-6));
        formData.append('fragment_endtime', fragment_endtime);
        formData.append('location', location);
        formData.append('base64data', base64encoded);

        let url = `${window.location.origin}/logger/audiologger`;
        console.log(`[audiologger]: POST ${location}-${starttime}.`)
        fetch(url, { method: 'post', body: formData })
        .catch((error) => {
            console.log(`[audiologger]: POST ${location}-${starttime} failed: ${error}`);
        });           
    });
}