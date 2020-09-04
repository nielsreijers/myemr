// Record all key events into an array

// Don't log username and password
if (window.location.href.indexOf("login.php") == -1) {
  var aa_events = [];

  function aa_logKeyMouseEvent(evt) {
      console.log(evt);
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
      aa_events.push({ unixtime: Date.now(), type: type, data: data, x: x, y: y });
  }
  window.addEventListener("keydown", aa_logKeyMouseEvent);
  window.addEventListener("keyup", aa_logKeyMouseEvent);
  window.addEventListener("click", aa_logKeyMouseEvent);
  window.addEventListener("contextmenu", aa_logKeyMouseEvent);
  window.addEventListener("dblclick", aa_logKeyMouseEvent);
  window.addEventListener("wheel", aa_logKeyMouseEvent);
  window.addEventListener("mousemove", aa_logKeyMouseEvent);

  // Push to server at regular intervals
  // Reduce interval timing for more frequent recordings, but increases server load
  // You can also set this to send only if certain number of key stroke were made.
  window.setInterval(function () {
    if (aa_events.length>5) {
        eventsToSend = aa_events;
        aa_events = [];
        var data = JSON.stringify(eventsToSend);

        let url = `${window.location.origin}/logger/keylogger`;
        fetch(url, { method: 'post', body: data })
        .then(response => response.text())
        .then(data => {
          console.log('[keylogger]:', data);
        })
        .catch((error) => {
          // TODO: There is no server error currently.
          console.error('[keylogger] Error:', error);
        });
    }
  }, 500);  
}

function aa_logEvent(type, data) {
  aa_events.push({ unixtime: Date.now(), type: type, data: data, x: -1, y: -1 });
}
