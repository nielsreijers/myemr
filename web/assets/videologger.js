vl_mimeType = 'video/webm;codecs=vp9';
var vl_options = {
    // audio, video, canvas, gif
   type: 'video',

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
   mimeType: vl_mimeType,

   // MediaStreamRecorder, StereoAudioRecorder, WebAssemblyRecorder
   // CanvasRecorder, GifRecorder, WhammyRecorder
   recorderType: MediaStreamRecorder,

   // disable logs
   disableLogs: false,

   // get intervals based blobs
   // value in milliseconds
   timeSlice: 5000,

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
   audioBitsPerSecond: 128000,

   // only for video track
   videoBitsPerSecond: 1280000,

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

//    // used by StereoAudioRecorder
//    // the range 22050 to 96000.
//    sampleRate: 96000,

//    // used by StereoAudioRecorder
//    // the range 22050 to 96000.
//    // let us force 16khz recording:
//    desiredSampRate: 16000,

//    // used by StereoAudioRecorder
//    // Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
//    bufferSize: 16384,

//    // used by StereoAudioRecorder
//    // 1 or 2
//    numberOfAudioChannels: 2,

//    // used by WebAssemblyRecorder
//    frameRate: 30,

//    // used by WebAssemblyRecorder
//    bitrate: 128000,

//    // used by MultiStreamRecorder - to access HTMLCanvasElement
//    elementClass: 'multi-streams-mixer'
};


var vl_state = {}

function vl_turnon() {
    console.log("vl_turnon() called.");

    vl_state = {}

    var commonConfig = {
        onMediaCaptured: function(stream) {
            console.log('onMediaCaptured() called.')
            vl_state.stream = stream;
            vl_startRecording(vl_newRecordingPendingLocation);
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

    vl_startStream(commonConfig);
}

function vl_turnoff() {
    console.log("vl_turnoff() called.");

    vl_stopStream();

    vl_state = {};
}

function vl_blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise(resolve => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
    });
};




function vl_startStream(config) {
    constraints = {
        "video": {
            "width": {
                "exact": 640
                // "exact": 1280
            },
            "height": {
                "exact": 480
                // "exact": 720
            }
        },
        "audio": true
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

function vl_stopStream() {
    console.log("vl_stopStream() called.");

    if(vl_state.stream && vl_state.stream.stop) {
        vl_state.stream.stop();
        vl_state.stream = null;
    }

    if(vl_state.stream instanceof Array) {
        vl_state.stream.forEach(function(stream) {
            stream.stop();
        });
        vl_state.stream = null;
    }

    console.log('Recording status: stopped');
    if (vl_state.recordRTC.getBlob()) {
        console.log('<br>Size: ' + bytesToSize(vl_state.recordRTC.getBlob().size));        
    }
}

function vl_startRecording(location) {
    console.log("vl_startRecording() called.");

    starttime = `${Date.now()}`;

    vl_state.blobs = [];
    vl_options.ondataavailable = function(blob) {
        vl_state.blobs.push(blob);
        vl_blobToBase64(blob).then(base64encoded => {
            // base64encoded now looks something like this:
            //    "data:video/x-matroska;codecs=avc1,opus;base64,Q7Z1…xMIqrZDmb7+gYAUyoqJ/euC8Zu5hEe6frr3xfDTLJSfLqPJQ="
            // We only want to send the base64 encoded data
            base64encoded = base64encoded.substr(base64encoded.indexOf('base64')+7)
 
            const formData = new FormData();
            formData.append('starttime', starttime);
            formData.append('location', location);
            formData.append('base64data', base64encoded);

            let url = `${window.location.origin}/logger/videologger`;
            console.log(`[videologger]: POST ${location}-${starttime} ...`)
            fetch(url, { method: 'post', body: formData })
            .then(response => response.text())
            .then(data => {
                console.log(`[videologger]: POST ${location}-${starttime} done`)
            })
            .catch((error) => {
                console.log(`[videologger]: POST ${location}-${starttime} failed: ${error}`)
            });           
        });
    };

    vl_state.recordRTC = RecordRTC(vl_state.stream, vl_options);
    vl_state.recordRTC.startRecording();
    kl_logEvent("startvideo", location + '-' + starttime)
}

var vl_newRecordingPendingLocation = "";
function vl_stopOrRestartRecording() {
    console.log("vl_stopOrRestartRecording() called.");

    if(vl_state.recordRTC) {
        // Stop if we were currently recording,
        // and maybe start a new recording after this one is processed
        vl_state.recordRTC.stopRecording(function() {
            if(vl_state.blobs && vl_state.blobs.length) {
                var blob = new File(vl_state.blobs,'tmp.webm', {
                    type: vl_mimeType
                });
                
                vl_state.recordRTC.getBlob = function() {
                    return blob;
                };
            }
            vl_state.blobs = [];
            if (vl_newRecordingPendingLocation != "") {
                vl_startRecording(vl_newRecordingPendingLocation);
                vl_newRecordingPendingLocation = "";
            }
        });
    } else {
        // Otherwise just start a new recording if we need to
        if (vl_newRecordingPendingLocation != "") {
            vl_startRecording(vl_newRecordingPendingLocation);
            vl_newRecordingPendingLocation = "";
        }
    }
}

function vl_startNewRecording(location) {
    vl_newRecordingPendingLocation = location;
    // If the videologger is still initialising, startRecording will be called with vl_newRecordingPendingLocation as parameter
    // If it's already initialised, stop the current recording and restart a new one
    if (vl_state.stream != null) {
        vl_stopOrRestartRecording();
    }
}

// // Add button to start/stop recording
// let vl_startstop = document.createElement('button');
// vl_startstop.innerText = "start recording";
// vl_startstop.disabled = true;
// document.body.prepend(vl_startstop)

// vl_startstop.onclick = () => {
//     if (vl_startstop.textContent = vl_startstop.textContent == "start recording") {
//         vl_startstop.textContent = "stop recording";
//         vl_turnon();
//     } else {
//         vl_startstop.textContent = "start recording";
//         vl_turnoff();
//     }
// }

vl_turnon();
