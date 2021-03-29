var al_state = { }

// public interface: al_turnoff, al_startNewRecording

async function al_turnon() {
    console.log("al_turnon() called.");

    let constraints = {
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
        }
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints);

    console.log("stream created, initializing Recorder.js ..."); 
    var context = new AudioContext();
    /* use the stream */
    input = context.createMediaStreamSource(stream);
    /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
    al_state.rec = new Recorder(input, {
        numChannels: 1
    });
}

function al_turnoff() {
    console.log("al_turnoff() called.");

    al_stopRecording();
    // Seems we can't turnoff recorder.js once it started
    al_state = { };
}

async function al_startNewRecording(location) {
    console.log(`al_startNewRecording('${location}') called.`);
    if (!al_state.rec) {
        console.log('turning on recorder.js...');
        await al_turnon();
        console.log('recorder.js turned on.');
    }
    if (al_state.rec && al_state.location) {
        al_stopRecording();
    } else {
        console.log("al_startNewRecording: no current recording.");
    }
    al_startRecording(location);
}

function al_startRecording(location) {
    console.log("al_startRecording() called.");
    al_state.starttime = `${Date.now()}`;
    al_state.location = location;
    al_state.rec.record();
    kl_logEvent("startaudio", location + '-' + al_state.starttime);
}


function al_stopRecording() {
    console.log("al_stopRecording() called.");
    let starttime = al_state.starttime;
    let location = al_state.location;
    let endtime = Date.now()
    if(al_state.rec) {
        al_state.rec.stop();
        al_state.rec.exportWAV(function(blob) {
            al_upload_blob(blob, 0, starttime, endtime, location);
            kl_logEvent("stopaudio", `${location}-${endtime}`);
        });
        al_state.rec.clear();
        console.log(`al_stopRecording: recording for ${location} uploaded.`);
    } else {
        console.log("al_stopRecording: no current recording.");
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