// Record all events into an array
var kl_events = [];
var kl_debug = false;

function kl_logKeyMouseEvent(evt) {
  // Don't log username and password
  if (window.location.href.indexOf("login.php") == -1
      && window.location.href.indexOf("changepassword.php") == -1) {
    if (kl_debug) {
      console.log(evt)
    }
    var data;
    var x;
    var y;
    let type = evt.type;
    switch(type) {
        case "keydown":
        case "keyup":
            data = evt.key;
            break;
        case "click":
        case "contextmenu":
        case "dblclick":
        case "wheel":
        case "mousemove":
            x = evt.clientX;
            y = evt.clientY;
            break;
    }
    kl_events.push({ unixtime: Date.now(), type: type, data: data, x: x, y: y });
  }
}

function kl_logEvent(type, data) {
  kl_events.push({ unixtime: Date.now(), type: type, data: data, x: -1, y: -1 });
}

function kl_flush() {
  if (kl_events.length>0) {
    eventsToSend = kl_events;
    kl_events = [];
    var data = JSON.stringify(eventsToSend);

    let url = `${window.location.origin}/logger/keylogger`;
    if (kl_debug) {
      console.log('[keylogger] POST ...');
    }
    fetch(url, { method: 'post', body: data })
    .then(response => response.text())
    .then(_ => {
      if (kl_debug) {
        console.log('[keylogger] POST done.');
      }
    })
    .catch((error) => {
      // TODO: There is no server error currently.
      console.error('[keylogger] POST failed:', error);
    });
  }
}

// Push to server at regular intervals
// Reduce interval timing for more frequent recordings, but increases server load
// You can also set this to send only if certain number of key stroke were made.
window.setInterval(function () {
  kl_flush()
}, 500);
