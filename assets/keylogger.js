// Record all key events into an array

// Don't log username and password
if (window.location.href.indexOf("login.php") == -1) {
  var kl_events = [];

  function kl_logKeyMouseEvent(evt) {
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

  // Push to server at regular intervals
  // Reduce interval timing for more frequent recordings, but increases server load
  // You can also set this to send only if certain number of key stroke were made.
  window.setInterval(function () {
    if (kl_events.length>0) {
      eventsToSend = kl_events;
      kl_events = [];
      var data = JSON.stringify(eventsToSend);

      let url = `${window.location.origin}/logger/keylogger`;
      console.log('[keylogger] POST ...');
      fetch(url, { method: 'post', body: data })
      .then(response => response.text())
      .then(_ => {
        console.log('[keylogger] POST done.');
      })
      .catch((error) => {
        // TODO: There is no server error currently.
        console.error('[keylogger] POST failed:', error);
      });
    }
  }, 500);  
}

function kl_logEvent(type, data) {
  kl_events.push({ unixtime: Date.now(), type: type, data: data, x: -1, y: -1 });
}
