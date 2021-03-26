al_mimeType = 'audio/wav';
al_debug = false

var al_options = {
    // audio, video, canvas, gif
   type: 'audio',

   // audio/webm
   // video/webm;codecs=vp9
   // video/webm;codecs=vp8
   // video/webm;codecs=h264
   // video/x-matroska;codecs=avc1
   // video/mpeg -- NOT supported by any browser, yet
   // video/mp4  -- NOT supported by any browser, yet
   // audio/wav
   // audio/ogg  -- ONLY Firefox
   // demo: simple-demos/isTypeSupported.html
   mimeType: al_mimeType,

   // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
   // CanvasRecorder, GifRecorder, WhammyRecorder
   recorderType: StereoAudioRecorder,

   // disable logs
   disableLogs: false,

   // get intervals based blobs
   // value in milliseconds
   timeSlice: 10000,

   // requires timeSlice above
   // returns blob via callback function
   ondataavailable: function(blob) {},

   // auto stop recording if camera stops
   checkForInactiveTracks: false,

//    // requires timeSlice above
//    onTimeStamp: function(timestamp) {},

//    // both for audio and video tracks
//    bitsPerSecond: 128000,

   // only for audio track
//    audioBitsPerSecond: 128000,

   // only for video track
//    videoBitsPerSecond: 1280000,

//    // used by CanvasRecorder and WhammyRecorder
//    // it is kind of a "frameRate"
//    frameInterval: 90,

//    // if you are recording multiple streams into single file
//    // this helps you see what is being recorded
//    previewStream: function(stream) {},

//    // used by CanvasRecorder and WhammyRecorder
//    // you can pass {width:640, height: 480} as well
//    video: HTMLVideoElement,

//    // used by CanvasRecorder and WhammyRecorder
//    canvas: {
//        width: 640,
//        height: 480
//    },

   // used by StereoAudioRecorder
   // the range 22050 to 96000.
   sampleRate: 48000,

//    // used by StereoAudioRecorder
//    // the range 22050 to 96000.
//    // let us force 16khz recording:
//    desiredSampRate: 16000,

   // used by StereoAudioRecorder
   // Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
   bufferSize: 16384,

   // used by StereoAudioRecorder
   // 1 or 2
   numberOfAudioChannels: 1,

//    // used by WebAssemblyRecorder
//    frameRate: 30,

//    // used by WebAssemblyRecorder
//    bitrate: 128000,

//    // used by MultiStreamRecorder - to access HTMLCanvasElement
//    elementClass: 'multi-streams-mixer'
};


var al_state = null

function al_turnon() {
    console.log("al_turnon() called.");

    al_state = { }

    var commonConfig = {
        onMediaCaptured: function(stream) {
            console.log('onMediaCaptured() called.')
            al_state.stream = stream;
            al_startRecording(al_newRecordingPendingLocation);
        },
        onMediaStopped: function() {
            console.log("onMediaStopped() called.");
        },
        onMediaCapturingFailed: function(error) {
            console.error('onMediaCapturingFailed(error) called: ', error);

            if(error.toString().indexOf('no audio or video tracks available') !== -1) {
                alert('RecordRTC failed to start because there are no audio or video tracks available.');
            }
            
            if(error.name === 'PermissionDeniedError' && DetectRTC.browser.name === 'Firefox') {
                alert('Firefox requires version >= 52. Firefox also requires HTTPs.');
            }

            commonConfig.onMediaStopped();
        }
    };

    al_startStream(commonConfig);
}

function al_turnoff() {
    console.log("al_turnoff() called.");

    al_stopStream();

    al_state = null;
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




function al_startStream(config) {
    constraints = {
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
        }
    }

    //// copied from RecordRTC example
    captureUserMedia = function(mediaConstraints, successCallback, errorCallback) {
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(stream) {
            successCallback(stream);
        }).catch(function(error) {
            if(error && (error.name === 'ConstraintNotSatisfiedError' || error.name === 'OverconstrainedError')) {
                alert('Your camera or browser does NOT supports selected resolutions or frame-rates. \n\nPlease select "default" resolutions.');
            }
            else if(error && error.message) {
                alert(error.message);
            }
            else {
                alert('Unable to make getUserMedia request. Please check browser console logs.');
            }

            errorCallback(error);
        });
    }

    captureUserMedia(constraints,
        function(audioVideoStream) {
            config.onMediaCaptured(audioVideoStream);

            if(audioVideoStream instanceof Array) {
                audioVideoStream.forEach(function(stream) {
                    // addStreamStopListener(stream, function() {
                    //     config.onMediaStopped();
                    // });
                });
                return;
            }

            // addStreamStopListener(audioVideoStream, function() {
            //     config.onMediaStopped();
            // });
        },
        function(error) {
            config.onMediaCapturingFailed(error);
        });
}

function al_stopStream() {
    console.log("al_stopStream() called.");

    if(al_state.stream && al_state.stream.stop) {
        al_state.stream.stop();
        al_state.stream = null;
    }

    if(al_state.stream instanceof Array) {
        al_state.stream.forEach(function(stream) {
            stream.stop();
        });
        al_state.stream = null;
    }

    console.log('Recording status: stopped');
    if (al_state.recordRTC.getBlob()) {
        console.log('<br>Size: ' + bytesToSize(al_state.recordRTC.getBlob().size));        
    }
}

function al_startRecording(location) {
    console.log("al_startRecording() called.");

    starttime = `${Date.now()}`;
    seq_nr = 0;

    al_state.blobs = [];
    al_options.ondataavailable = function(blob) {
        al_state.blobs.push(blob);
        al_blobToBase64(blob).then(base64encoded => {
            // base64encoded now looks something like this:
            //    "data:video/x-matroska;codecs=avc1,opus;base64,Q7Z1…xMIqrZDmb7+gYAUyoqJ/euC8Zu5hEe6frr3xfDTLJSfLqPJQ="
            // We only want to send the base64 encoded data
            base64encoded = base64encoded.substr(base64encoded.indexOf('base64')+7)
 
            const formData = new FormData();
            formData.append('starttime', `${starttime}-${seq_nr++}`);
            formData.append('location', location);
            formData.append('base64data', base64encoded);

            let url = `${window.location.origin}/logger/audiologger`;
            if (al_debug) {
                console.log(`[audiologger]: POST ${location}-${starttime} ...`)
            }
            fetch(url, { method: 'post', body: formData })
            .then(response => response.text())
            .then(data => {
                if (al_debug) {
                    console.log(`[audiologger]: POST ${location}-${starttime} done`)
                }
            })
            .catch((error) => {
                console.log(`[audiologger]: POST ${location}-${starttime} failed: ${error}`)
            });           
        });
    };

    al_state.recordRTC = RecordRTC(al_state.stream, al_options);
    al_state.recordRTC.startRecording();
    kl_logEvent("startvideo", location + '-' + starttime)
}

var al_newRecordingPendingLocation = "";
function al_stopOrRestartRecording() {
    console.log("al_stopOrRestartRecording() called.");

    if(al_state.recordRTC) {
        // Stop if we were currently recording,
        // and maybe start a new recording after this one is processed
        al_state.recordRTC.stopRecording(function() {
            if(al_state.blobs && al_state.blobs.length) {
                var blob = new File(al_state.blobs,'tmp.webm', {
                    type: al_mimeType
                });
                
                al_state.recordRTC.getBlob = function() {
                    return blob;
                };
            }
            al_state.blobs = [];
            if (al_newRecordingPendingLocation != "") {
                al_startRecording(al_newRecordingPendingLocation);
                al_newRecordingPendingLocation = "";
            }
        });
    } else {
        // Otherwise just start a new recording if we need to
        if (al_newRecordingPendingLocation != "") {
            al_startRecording(al_newRecordingPendingLocation);
            al_newRecordingPendingLocation = "";
        }
    }
}

function al_isCameraOn() {
    return al_state != null;
}

function al_startNewRecording(location) {
    if (!al_isCameraOn()) {
        al_turnon();
    }

    al_newRecordingPendingLocation = location;
    // If the audiologger is still initialising, startRecording will be called with al_newRecordingPendingLocation as parameter
    // If it's already initialised, stop the current recording and restart a new one
    if (al_state.stream != null) {
        al_stopOrRestartRecording();
    }
}

function al_stopRecording() {
    if (al_isCameraOn()) {
        al_turnoff();
    }
}
