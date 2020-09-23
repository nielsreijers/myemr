/**
 * TypingDNAzh - Typing Biometrics JavaScript API with CJK support.
 * Modified from TypingDNA's typingdna.js
 * 
 * https://www.typingdna.com/scripts/typingdna.js
 * https://api.typingdna.com/scripts/typingdna.js (alternative)
 *
 * GitHub repository
 * https://github.com/TypingDNA/TypingDnaRecorder-JavaScript
 *
 * @version 3.1
 * @author Raul Popa & Stefan Endres
 * @copyright TypingDNA Inc. https://www.typingdna.com
 * @license http://www.apache.org/licenses/LICENSE-2.0
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Typical usage:
 * var tdna = new TypingDNAzh(); // creates a new TypingDNAzh object and starts recording
 * var typingPattern = tdna.getTypingPattern({type:1, text:"Hello5g21?*"});
 * returns a type 1 typing pattern (and continues recording afterwards)
 *
 * Optional:
 * tdna.stop(); // ends recording and clears history stack (returns recording flag: false)
 * tdna.start(); // restarts the recording after a stop (returns recording flag: true)
 * tdna.reset(); // restarts the recording anytime, clears history stack and starts from scratch (returns nothing)
 * var typingPatternQuality = TypingDNAzh.getQuality(typingPattern); //returns the quality/strength of any typing pattern
 * (there is no need to initialize the class to do pattern quality checking)
 */

/**
 * Creates a single instance (or a reference) of the TypingDNAzh class
 * @return {Object} Returns the single instance of the TypingDNAzh class.
 * @example var tdna = new TypingDNAzh();
 */
function TypingDNAzh() {
    if (TypingDNAzh.initialized !== true) {
      // MAIN FUNCTIONS //
      TypingDNAzh.prototype.start = function() {
        return TypingDNAzh.start.apply(this, arguments);
      }
      TypingDNAzh.prototype.stop = function() {
        return TypingDNAzh.stop.apply(this, arguments);
      }
      TypingDNAzh.prototype.reset = function() {
        return TypingDNAzh.reset.apply(this, arguments);
      }
      TypingDNAzh.prototype.addTarget = function() {
        return TypingDNAzh.addTarget.apply(this, arguments);
      }
      TypingDNAzh.prototype.removeTarget = function() {
        return TypingDNAzh.removeTarget.apply(this, arguments);
      }
      TypingDNAzh.prototype.getTypingPattern = function() {
        return TypingDNAzh.getTypingPattern.apply(this, arguments);
      }
      TypingDNAzh.prototype.getMouseDiagram = function() {
        return TypingDNAzh.getMouseDiagram.apply(this, arguments);
      }
      TypingDNAzh.prototype.startMouse = function() {
        return TypingDNAzh.startMouse.apply(this, arguments);
      }
      TypingDNAzh.prototype.stopMouse = function() {
        return TypingDNAzh.stopMouse.apply(this, arguments);
      }
      TypingDNAzh.prototype.getQuality = function() {
        return TypingDNAzh.getQuality.apply(this, arguments);
      }
      TypingDNAzh.prototype.getLength = function() {
        return TypingDNAzh.getLength.apply(this, arguments);
      }
      TypingDNAzh.prototype.isMobile = function() {
        return TypingDNAzh.isMobile.apply(this, arguments);
      }
      TypingDNAzh.prototype.getTextId = function() {
        return TypingDNAzh.getTextId.apply(this, arguments)
      }
     
      // DEPRECATED FUNCTIONS //
      TypingDNAzh.prototype.get = function() {
        // deprecated in favor of getTypignPattern()
        return TypingDNAzh.get.apply(this, arguments);
      }
      TypingDNAzh.prototype.startDiagram = function() {
        // deprecated in favor of start()
        // return TypingDNAzh.startDiagram.apply(this, arguments);
      }
      TypingDNAzh.prototype.stopDiagram = function() {
        // deprecated in favor of stop()
        // return TypingDNAzh.stopDiagram.apply(this, arguments);
      }
      TypingDNAzh.prototype.getDiagram = function() {
        // deprecated in favor of getTypignPattern()
        return TypingDNAzh.getDiagram.apply(this, arguments);
      }
      TypingDNAzh.prototype.getExtendedDiagram = function() {
        // deprecated in favor of getTypignPattern()
        return TypingDNAzh.getExtendedDiagram.apply(this, arguments);
      }
  
      // CJK support NR 20200923
      TypingDNAzh.codeToKeyCode = function(code) {
          switch (code) {
              case 'Backspace'    : return   8;
              case 'Tab'          : return   9;
              case 'Enter'        : return  13;
              case 'ShiftLeft'    : return  16;
              case 'ShiftRight'   : return  16;
              case 'ControlLeft'  : return  17;
              case 'ControlRight' : return  17;
              case 'AltRight'     : return  18;
              case 'Escape'       : return  27;
              case 'Space'        : return  32;
              case 'PageUp'       : return  33;
              case 'PageDown'     : return  34;
              case 'End'          : return  35;
              case 'Home'         : return  36;
              case 'ArrowLeft'    : return  37;
              case 'ArrowUp'      : return  38;
              case 'ArrowRight'   : return  39;
              case 'ArrowDown'    : return  40;
              case 'PrintScreen'  : return  44;
              case 'Insert'       : return  45;
              case 'Delete'       : return  46;
              case 'Digit0'       : return  48;
              case 'Digit1'       : return  49;
              case 'Digit2'       : return  50;
              case 'Digit3'       : return  51;
              case 'Digit4'       : return  52;
              case 'Digit5'       : return  53;
              case 'Digit6'       : return  54;
              case 'Digit7'       : return  55;
              case 'Digit8'       : return  56;
              case 'Digit9'       : return  57;
              case 'KeyA'         : return  65;
              case 'KeyB'         : return  66;
              case 'KeyC'         : return  67;
              case 'KeyD'         : return  68;
              case 'KeyE'         : return  69;
              case 'KeyF'         : return  70;
              case 'KeyG'         : return  71;
              case 'KeyH'         : return  72;
              case 'KeyI'         : return  73;
              case 'KeyJ'         : return  74;
              case 'KeyK'         : return  75;
              case 'KeyL'         : return  76;
              case 'KeyM'         : return  77;
              case 'KeyN'         : return  78;
              case 'KeyO'         : return  79;
              case 'KeyP'         : return  80;
              case 'KeyQ'         : return  81;
              case 'KeyR'         : return  82;
              case 'KeyS'         : return  83;
              case 'KeyT'         : return  84;
              case 'KeyU'         : return  85;
              case 'KeyV'         : return  86;
              case 'KeyW'         : return  87;
              case 'KeyX'         : return  88;
              case 'KeyY'         : return  89;
              case 'KeyZ'         : return  90;
              case 'MetaLeft'     : return  91;
              case 'Semicolon'    : return 186;
              case 'Equal'        : return 187;
              case 'Comma'        : return 188;
              case 'Minus'        : return 189;
              case 'Period'       : return 190;
              case 'Slash'        : return 191;
              case 'Backquote'    : return 192;
              case 'BracketLeft'  : return 219;
              case 'Backslash'    : return 220;
              case 'BracketRight' : return 221;
              case 'Quote'        : return 222;
              case 'WakeUp'       : return 255;
              default             : return 0;
  
          }
      }
  
      TypingDNAzh.initialized = true;
      TypingDNAzh.prototype.maxHistoryLength = TypingDNAzh.maxHistoryLength;
      TypingDNAzh.prototype.defaultHistoryLength = TypingDNAzh.defaultHistoryLength;
      TypingDNAzh.prototype.maxSeekTime = TypingDNAzh.maxSeekTime;
      TypingDNAzh.prototype.maxPressTime = TypingDNAzh.maxPressTime;
      TypingDNAzh.version = 3.1;
      TypingDNAzh.cookieId = 0;
      TypingDNAzh.flags = 0;
      TypingDNAzh.instance = this;
      TypingDNAzh.document = document;
      TypingDNAzh.ua = window.navigator.userAgent,
        TypingDNAzh.platform = window.navigator.platform;
      TypingDNAzh.maxHistoryLength = 2000;
      TypingDNAzh.maxSeekTime = 1500;
      TypingDNAzh.maxPressTime = 300;
      TypingDNAzh.defaultHistoryLength = 160;
      TypingDNAzh.spKeyCodes = [8, 13, 32];
      TypingDNAzh.spKeyCodesObj = {
        8: 1,
        13: 1,
        32: 1,
      };
      TypingDNAzh.keyCodes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        32, 222, 188, 190, 186, 187, 189, 191, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57
      ];
      TypingDNAzh.keyCodesObj = {}
      var keyCodesLen = TypingDNAzh.keyCodes.length;
      for (var i = 0; i < keyCodesLen; i++) {
        TypingDNAzh.keyCodesObj[TypingDNAzh.keyCodes[i]] = 1;
      }
      TypingDNAzh.pt1 = TypingDNAzh.ut1 = (new Date).getTime();
      TypingDNAzh.wfk = [];
      TypingDNAzh.sti = [];
      TypingDNAzh.skt = [];
      TypingDNAzh.recording = true;
      TypingDNAzh.mouseRecording = true;
      TypingDNAzh.mouseMoveRecording = false;
      TypingDNAzh.spKeyRecording = true;
      TypingDNAzh.diagramRecording = true;
      TypingDNAzh.motionFixedData = true;
      TypingDNAzh.motionArrayData = true;
      TypingDNAzh.dwfk = [];
      TypingDNAzh.dsti = [];
      TypingDNAzh.dskt = [];
      TypingDNAzh.drkc = [];
      TypingDNAzh.dlastDownKey;
      TypingDNAzh.prevKeyCode = 0;
      TypingDNAzh.maxMoveDeltaTime = 600;
      TypingDNAzh.maxScrollDeltaTime = 800;
      TypingDNAzh.maxStopTime = 1500;
      TypingDNAzh.maxClickTime = 600;
      TypingDNAzh.maxMouseHistoryLength = 500;
      TypingDNAzh.lastMouseMoveTime = TypingDNAzh.lastMouseDownTime = (new Date).getTime();
      TypingDNAzh.stopTimes = [];
      TypingDNAzh.clickTimes = [];
      TypingDNAzh.lastMouseStop = false;
      TypingDNAzh.zl = 0.0000001;
      TypingDNAzh.ACInputLengths = {
        inputs: [],
        lastLength: [],
      };
      TypingDNAzh.targetIds = [];
      TypingDNAzh.lastTarget = "";
      TypingDNAzh.lastTargetFound = false;
      TypingDNAzh.replaceMissingKeys = true;
      TypingDNAzh.replaceMissingKeysPerc = 7;
      TypingDNAzh.pressCalculated = false;
      TypingDNAzh.pressRecorded = false;
  
      TypingDNAzh.keyDown = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        var keyCode = TypingDNAzh.codeToKeyCode(e.code);
        if (TypingDNAzh.wfk[keyCode] === 1 || TypingDNAzh.dwfk[keyCode] === 1) {
          //return;
        }
        var t0 = TypingDNAzh.pt1;
        TypingDNAzh.pt1 = (new Date).getTime();
        var seekTotal = TypingDNAzh.pt1 - t0;
        var startTime = TypingDNAzh.pt1;
        if (TypingDNAzh.recording === true || (TypingDNAzh.spKeyCodesObj[keyCode] && TypingDNAzh.spKeyRecording === true)) {
          if (!e.shiftKey) {
            TypingDNAzh.wfk[keyCode] = 1;
            TypingDNAzh.skt[keyCode] = seekTotal;
            TypingDNAzh.sti[keyCode] = startTime;
          }
        }
        if (TypingDNAzh.diagramRecording === true) {
          TypingDNAzh.dwfk[keyCode] = 1;
          TypingDNAzh.dskt[keyCode] = seekTotal;
          TypingDNAzh.dsti[keyCode] = startTime;
          TypingDNAzh.dlastDownKey = keyCode;
        }
      }
  
      TypingDNAzh.keyPress = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        if (TypingDNAzh.diagramRecording === true) {
          var keyCode = TypingDNAzh.dlastDownKey;
          TypingDNAzh.drkc[keyCode] = e.charCode;
        }
      }
  
      TypingDNAzh.keyUp = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        var ut = (new Date).getTime();
        var keyCode = TypingDNAzh.codeToKeyCode(e.code);
        var pressTime = 0;
        var seekTime = 0;
        if (TypingDNAzh.recording === true || (TypingDNAzh.spKeyCodesObj[keyCode] && TypingDNAzh.spKeyRecording === true)) {
          if (!e.shiftKey) {
            if (TypingDNAzh.wfk[keyCode] === 1) {
              pressTime = ut - TypingDNAzh.sti[keyCode];
              seekTime = TypingDNAzh.skt[keyCode];
              var arr = [keyCode, seekTime, pressTime, TypingDNAzh.prevKeyCode, ut, e.target.id,];
              TypingDNAzh.history.add(arr);
              TypingDNAzh.prevKeyCode = keyCode;
            }
          }
          TypingDNAzh.wfk[keyCode] = 0;
        }
        if (TypingDNAzh.diagramRecording === true) {
          if (TypingDNAzh.drkc[keyCode] !== undefined && TypingDNAzh.drkc[keyCode] !== 0) {
            if (TypingDNAzh.dwfk[keyCode] === 1) {
              pressTime = ut - TypingDNAzh.dsti[keyCode];
              seekTime = TypingDNAzh.dskt[keyCode];
              var realKeyCode = TypingDNAzh.drkc[keyCode];
              var arrD = [keyCode, seekTime, pressTime, realKeyCode, ut, e.target.id,];
              TypingDNAzh.history.addDiagram(arrD);
            }
          }
          TypingDNAzh.dwfk[keyCode] = 0;
        }
      }
  
      TypingDNAzh.MobileKeyDown = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        var keyCode = TypingDNAzh.codeToKeyCode(e.code);
        if (TypingDNAzh.wfk[keyCode] === 1 || TypingDNAzh.dwfk[keyCode] === 1) {
          //return;
        }
        TypingDNAzh.lastPressTime = (new Date).getTime();
        if (TypingDNAzh.recording === true || (TypingDNAzh.spKeyCodesObj[keyCode] && TypingDNAzh.spKeyRecording === true)) {
          TypingDNAzh.wfk[keyCode] = 1;
        }
        if (TypingDNAzh.diagramRecording === true) {
          TypingDNAzh.dwfk[keyCode] = 1;
          TypingDNAzh.dlastDownKey = keyCode;
        }
      }
  
      TypingDNAzh.MobileKeyPress = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        if (TypingDNAzh.diagramRecording === true) {
          var keyCode = TypingDNAzh.dlastDownKey;
          TypingDNAzh.drkc[keyCode] = e.charCode;
        }
      }
  
      TypingDNAzh.MobileKeyUp = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        var t0 = TypingDNAzh.ut1;
        TypingDNAzh.ut1 = (new Date).getTime();
        var seekTime = TypingDNAzh.ut1 - t0;
        var kpGet = TypingDNAzh.kpGetAll();
        var pressTime = (kpGet[0] !== 0) ? Math.round(TypingDNAzh.ut1 - kpGet[0]) : 0;
        if (isNaN(pressTime)) {
          pressTime = 0;
        }
        var keyCode = TypingDNAzh.codeToKeyCode(e.code);
        if (TypingDNAzh.recording === true || (TypingDNAzh.spKeyCodesObj[keyCode] && TypingDNAzh.spKeyRecording === true)) {
          if (TypingDNAzh.wfk[keyCode] === 1) {
            var arr = [keyCode, seekTime, pressTime, TypingDNAzh.prevKeyCode, TypingDNAzh.ut1, e.target.id];
            TypingDNAzh.history.add(arr);
            TypingDNAzh.prevKeyCode = keyCode;
          }
          TypingDNAzh.wfk[keyCode] = 0;
        }
        if (TypingDNAzh.diagramRecording === true) {
          if (TypingDNAzh.drkc[keyCode] !== undefined && TypingDNAzh.drkc[keyCode] !== 0) {
            if (TypingDNAzh.dwfk[keyCode] === 1) {
              var realKeyCode = TypingDNAzh.drkc[keyCode];
              var arrD = [keyCode, seekTime, pressTime, realKeyCode, TypingDNAzh.ut1, e.target.id, kpGet[1].join(','), kpGet[2].join(','), kpGet[3].join(','), kpGet[4].join(',')];
              TypingDNAzh.history.addDiagram(arrD);
            }
          }
          TypingDNAzh.dwfk[keyCode] = 0;
        }
      }
  
      // only for Android devices
      TypingDNAzh.AndroidKeyDown = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        TypingDNAzh.lastPressTime = (new Date).getTime();
        if (TypingDNAzh.ACInputLengths.inputs.indexOf(e.target) === -1) {
          TypingDNAzh.ACInputLengths.inputs.push(e.target);
          TypingDNAzh.ACInputLengths.lastLength.push(0);
        }
      }
  
      TypingDNAzh.AndroidKeyUp = function(e) {
        if (!TypingDNAzh.recording && !TypingDNAzh.diagramRecording) {
          return;
        }
        var t0 = TypingDNAzh.ut1;
        TypingDNAzh.ut1 = (new Date).getTime();
        if (!TypingDNAzh.isTarget(e.target.id)) {
          return;
        }
        var seekTime = TypingDNAzh.ut1 - t0;
        var kpGet = TypingDNAzh.kpGetAll();
        var pressTime = (kpGet[0] !== 0) ? Math.round(TypingDNAzh.ut1 - kpGet[0]) : 0;
        if (isNaN(pressTime)) {
          pressTime = 0;
        }
        var keyCode = TypingDNAzh.codeToKeyCode(e.code);
        var targetIndex = TypingDNAzh.ACInputLengths.inputs.indexOf(e.target);
        if (targetIndex === -1) {
          TypingDNAzh.ACInputLengths.inputs.push(e.target);
          TypingDNAzh.ACInputLengths.lastLength.push(0);
          targetIndex = TypingDNAzh.ACInputLengths.inputs.indexOf(e.target);
        }
        var charCode = 0;
        if (e.target.value.length >= TypingDNAzh.ACInputLengths.lastLength[targetIndex]) {
          var char = e.target.value.substr((e.target.selectionStart - 1) || 0, 1);
          keyCode = char.toUpperCase().charCodeAt(0);
          charCode = char.charCodeAt(0);
        }
        TypingDNAzh.ACInputLengths.lastLength[targetIndex] = e.target.value.length;
        var arr = [keyCode, seekTime, pressTime, TypingDNAzh.prevKeyCode, TypingDNAzh.ut1, e.target.id,];
        TypingDNAzh.history.add(arr);
        TypingDNAzh.prevKeyCode = keyCode;
        if (TypingDNAzh.diagramRecording === true) {
          var arrD = [keyCode, seekTime, pressTime, charCode, TypingDNAzh.ut1, e.target.id, kpGet[1].join(','), kpGet[2].join(','), kpGet[3].join(','), kpGet[4].join(',')];
          TypingDNAzh.history.addDiagram(arrD);
        }
      }
  
      TypingDNAzh.mouseScroll = function(e) {
        if (TypingDNAzh.mouseRecording === true) {
          if (TypingDNAzh.mouseMoveRecording === true) {
            if (TypingDNAzh.mouse.scrollStarted === true) {
              var currentTime = (new Date).getTime();
              TypingDNAzh.mouse.scrollTimes.push(currentTime);
              TypingDNAzh.mouse.scrollTopArr.push(TypingDNAzh.document.body.scrollTop);
              clearInterval(TypingDNAzh.scrollInterval);
              TypingDNAzh.scrollInterval = setInterval(TypingDNAzh.mouse.checkScroll, TypingDNAzh.maxScrollDeltaTime);
            } else {
              TypingDNAzh.mouse.scrollStarted = true;
            }
          }
        }
      }
  
      TypingDNAzh.mouseMove = function(e) {
        if (TypingDNAzh.mouseRecording === true) {
          var currentTime = (new Date).getTime();
          if (TypingDNAzh.mouseMoveRecording === true) {
            if (TypingDNAzh.mouse.started === true) {
              TypingDNAzh.mouse.times.push(currentTime);
              TypingDNAzh.mouse.xPositions.push(e.screenX);
              TypingDNAzh.mouse.yPositions.push(e.screenY);
              clearInterval(TypingDNAzh.moveInterval);
              TypingDNAzh.moveInterval = setInterval(TypingDNAzh.mouse.checkMove, TypingDNAzh.maxMoveDeltaTime);
            } else {
              TypingDNAzh.mouse.started = true;
            }
          }
          TypingDNAzh.lastMouseMoveTime = currentTime;
        }
      }
  
      TypingDNAzh.mouseDown = function(e) {
        if (TypingDNAzh.mouseRecording === true) {
          TypingDNAzh.mouse.checkMove();
          TypingDNAzh.mouse.checkScroll();
          if (e.which === 1) {
            TypingDNAzh.lastMouseDownTime = (new Date).getTime();
            var stopTime = TypingDNAzh.lastMouseDownTime - TypingDNAzh.lastMouseMoveTime;
            if (stopTime < TypingDNAzh.maxStopTime && TypingDNAzh.lastMouseStop === false) {
              TypingDNAzh.stopTimes.push(stopTime);
              if (TypingDNAzh.mouseMoveRecording === true) {
                var eventType = 3;
                var arr = [eventType, stopTime,];
                TypingDNAzh.mouse.history.add(arr);
                TypingDNAzh.lastMouseStop = true;
              }
            }
          }
        }
      }
  
      TypingDNAzh.mouseUp = function(e) {
        if (TypingDNAzh.mouseRecording === true) {
          if (e.which === 1) {
            var clickTime = (new Date).getTime() - TypingDNAzh.lastMouseDownTime;
            if (clickTime < TypingDNAzh.maxClickTime) {
              TypingDNAzh.clickTimes.push(clickTime);
            }
            if (TypingDNAzh.mouseMoveRecording === true) {
              if (TypingDNAzh.mouse.started === true) {
                TypingDNAzh.mouse.checkMove(true);
              } else {
                var eventType = 4;
                var arr = [eventType, clickTime,];
                TypingDNAzh.mouse.history.add(arr);
              }
            }
          }
        }
      }
  
      TypingDNAzh.isMobile = function() {
        if (TypingDNAzh.mobile !== undefined) {
          return TypingDNAzh.mobile;
        } else {
          var check = 0;
          (function(a) {
            if (
              /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i
              .test(a) ||
              /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
              .test(a.substr(0, 4))) {
              check = 1;
            }
          })(navigator.userAgent || navigator.vendor || window.opera);
          TypingDNAzh.mobile = check;
          return check;
        }
      }
  
      TypingDNAzh.isAndroid = function() {
        return /Android/i.test(navigator.userAgent);
      }
  
      TypingDNAzh.isFirefox = function() {
        return /Firefox/i.test(navigator.userAgent);
      }
  
      TypingDNAzh.isTarget = function(target) {
        if (TypingDNAzh.lastTarget === target && TypingDNAzh.lastTargetFound) {
          return true;
        } else {
          var targetLength = TypingDNAzh.targetIds.length;
          var targetFound = false;
          if (targetLength > 0) {
            for (var i = 0; i < targetLength; i++) {
              if (TypingDNAzh.targetIds[i] === target) {
                targetFound = true;
                break;
              }
            }
            TypingDNAzh.lastTarget = target;
            TypingDNAzh.lastTargetFound = targetFound;
            return targetFound;
          } else {
            TypingDNAzh.lastTarget = target;
            TypingDNAzh.lastTargetFound = true;
            return true;
          }
        }
      }
  
      TypingDNAzh.kpAccZ = [];
      TypingDNAzh.kpX = [];
      TypingDNAzh.kpY = [];
      TypingDNAzh.kpTimes = [];
      TypingDNAzh.kpLastZ = 0;
      TypingDNAzh.kpLastAccX = 0;
      TypingDNAzh.kpLastAccY = 0;
      TypingDNAzh.kpLastPitch = 0;
      TypingDNAzh.kpLastRoll = 0;
      TypingDNAzh.lastPressTime = 0;
      TypingDNAzh.hasDeviceMotion = false;
      TypingDNAzh.hasDeviceOrientation = false;
  
      TypingDNAzh.deviceMotionHandler = function(e) {
        TypingDNAzh.kpTimes.push((new Date).getTime());
        var kpCurAccX = Math.round(100 * e.accelerationIncludingGravity.x);
        var kpCurAccY = Math.round(100 * e.accelerationIncludingGravity.y);
        var kpCurAccZ = Math.round(100 * e.accelerationIncludingGravity.z);
        if (e.rotationRate) {
          var kpCurX = Math.round(10 * e.rotationRate.alpha);
          var kpCurY = Math.round(10 * e.rotationRate.beta);
          var kpCurZ = Math.round(10 * e.rotationRate.gamma);
        }
        TypingDNAzh.kpLastAccX = kpCurAccX;
        TypingDNAzh.kpLastAccY = kpCurAccY;
        TypingDNAzh.kpAccZ.push(kpCurAccZ);
        TypingDNAzh.kpX.push(kpCurX);
        TypingDNAzh.kpY.push(kpCurY);
        TypingDNAzh.kpLastZ = kpCurZ;
  
        TypingDNAzh.kpLastPitch = Math.floor((Math.atan2(-kpCurAccY, Math.sqrt(Math.pow(kpCurAccX, 2) + Math.pow(kpCurAccZ, 2))) * 180 / Math.PI) * 10);
        TypingDNAzh.kpLastRoll = Math.floor((Math.atan2(-kpCurAccX, Math.sqrt(Math.pow(kpCurAccY, 2) + Math.pow(kpCurAccZ, 2))) * 180 / Math.PI) * 10);
        if (TypingDNAzh.kpX.length > 21) {
          TypingDNAzh.kpTimes.shift();
          TypingDNAzh.kpAccZ.shift();
          TypingDNAzh.kpX.shift();
          TypingDNAzh.kpY.shift();
        }
        if (!TypingDNAzh.hasDeviceMotion) {
          TypingDNAzh.hasDeviceMotion = true;
          TypingDNAzh.hasDeviceOrientation = true;
        }
      }
  
      if (TypingDNAzh.isMobile() === 1) {
        if (TypingDNAzh.isAndroid()) {
          if (TypingDNAzh.isFirefox()) {
            TypingDNAzh.document.addEventListener("input", TypingDNAzh.AndroidKeyUp);
            TypingDNAzh.document.addEventListener("keydown", TypingDNAzh.AndroidKeyDown);
          } else {
            TypingDNAzh.document.addEventListener("keyup", TypingDNAzh.AndroidKeyUp);
            TypingDNAzh.document.addEventListener("keydown", TypingDNAzh.AndroidKeyDown);
          }
        } else {
          TypingDNAzh.document.addEventListener("keyup", TypingDNAzh.MobileKeyUp);
          TypingDNAzh.document.addEventListener("keydown", TypingDNAzh.MobileKeyDown);
          TypingDNAzh.document.addEventListener("keypress", TypingDNAzh.MobileKeyPress);
        }
        if (window.DeviceMotionEvent !== undefined) {
          window.addEventListener('devicemotion', TypingDNAzh.deviceMotionHandler);
        }
      } else {
        if (TypingDNAzh.document.addEventListener) {
          TypingDNAzh.document.addEventListener("keyup", TypingDNAzh.keyUp);
          TypingDNAzh.document.addEventListener("keydown", TypingDNAzh.keyDown);
          TypingDNAzh.document.addEventListener("keypress", TypingDNAzh.keyPress);
          TypingDNAzh.document.addEventListener("mousemove", TypingDNAzh.mouseMove);
          TypingDNAzh.document.addEventListener("mousedown", TypingDNAzh.mouseDown);
          TypingDNAzh.document.addEventListener("mouseup", TypingDNAzh.mouseUp);
          TypingDNAzh.document.addEventListener("scroll", TypingDNAzh.mouseScroll);
        } else if (TypingDNAzh.document.attachEvent) {
          TypingDNAzh.document.attachEvent("onkeyup", TypingDNAzh.keyUp);
          TypingDNAzh.document.attachEvent("onkeydown", TypingDNAzh.keyDown);
          TypingDNAzh.document.attachEvent("onkeypress", TypingDNAzh.keyPress);
          TypingDNAzh.document.attachEvent("onmousemove", TypingDNAzh.mouseMove);
          TypingDNAzh.document.attachEvent("onmousedown", TypingDNAzh.mouseDown);
          TypingDNAzh.document.attachEvent("onmouseup", TypingDNAzh.mouseUp);
          TypingDNAzh.document.attachEvent("onscroll", TypingDNAzh.mouseScroll);
        } else {
          console.log("browser not supported");
        }
      }
  
      TypingDNAzh.kpADifArr = function(arr) {
        var length = arr.length - 1;
        var firstArr = [0];
        if (length < 2) {
          return [
            [0],
            [0]
          ];
        }
        var newArr = [];
        var returnArr = [];
        for (var i = 0; i < length; i++) {
          firstArr.push(arr[i + 1] - arr[i]);
        }
        for (i = 0; i < length; i++) {
          var newVal = firstArr[i + 1] - firstArr[i];
          newArr.push(newVal);
          returnArr.push(Math.abs(newVal));
        }
        return [newArr, returnArr,];
      }
  
      TypingDNAzh.kpRDifArr = function(arr) {
        var length = arr.length - 2;
        var firstArr = [];
        if (length < 0) {
          return [
            [0],
            [0]
          ];
        }
        var localMax = 0;
        var localMin = 0;
        var posMax = 0;
        var posMin = 0;
        var newVal = 0;
        if (length > 0) {
          for (i = 0; i < length; i++) {
            newVal = arr[i + 1] - arr[i];
            firstArr.push(newVal);
            if (newVal >= localMax) {
              localMax = newVal;
              posMax = i;
            } else if (newVal <= localMin) {
              localMin = newVal;
              posMin = i;
            }
          }
        } else {
          newVal = arr[1] - arr[0];
          firstArr.push(newVal);
        }
        var returnArr = [posMax - 1, posMax, posMax + 1, posMax + 2, posMax + 3, posMin - 1, posMin, posMin + 1, posMin + 2, posMin + 3];
        return [firstArr, returnArr,];
      }
  
      TypingDNAzh.kpGetAll = function() {
        var returnVal = 0;
        var returnMotion = [];
        if (TypingDNAzh.kpAccZ.length < 2) {
          returnVal = (TypingDNAzh.hasDeviceMotion && TypingDNAzh.hasDeviceOrientation) ? 0 : TypingDNAzh.lastPressTime;
          returnMotion = [0, 0, 0, 0, 0, 0, TypingDNAzh.kpLastPitch, TypingDNAzh.kpLastRoll,];
          return [returnVal, returnMotion, [0],
            [0],
            [0]
          ];
        } else {
          [kpza, kpzaAbs] = TypingDNAzh.kpADifArr(TypingDNAzh.kpAccZ);
          [kpXR, kpxPos] = TypingDNAzh.kpRDifArr(TypingDNAzh.kpX);
          [kpYR, kpyPos] = TypingDNAzh.kpRDifArr(TypingDNAzh.kpY);
          TypingDNAzh.kpX.shift();
          TypingDNAzh.kpY.shift();
          TypingDNAzh.kpAccZ.shift();
          TypingDNAzh.kpTimes.shift();
          var kpPos = kpxPos.concat(kpyPos);
          kpPos = kpPos.sort();
          var kpxyPos = [];
          for (i = 1; i < kpPos.length; i++) {
            if (kpPos[i] !== kpPos[i - 1]) {
              kpxyPos.push(kpPos[i]);
            }
          }
          var lastKpza = 0;
          var lastKpTime = TypingDNAzh.kpTimes[TypingDNAzh.kpTimes.length - 1];
          for (i = 0; i < kpxyPos.length; i++) {
            var j = kpxyPos[i];
            var minj = (kpzaAbs.length > 8) ? 2 : ((kpzaAbs.length > 4) ? 1 : 0);
            if (j > minj && kpzaAbs[j] !== undefined && kpzaAbs[j] > lastKpza) {
              lastKpza = kpzaAbs[j];
              lastKpTime = TypingDNAzh.kpTimes[j];
            }
          }
          returnVal = lastKpTime;
          returnMotion = [TypingDNAzh.kpLastAccX, TypingDNAzh.kpLastAccY, TypingDNAzh.kpAccZ.pop(), TypingDNAzh.kpX.pop(), TypingDNAzh.kpY.pop(), TypingDNAzh.kpLastZ, TypingDNAzh.kpLastPitch, TypingDNAzh.kpLastRoll];
          TypingDNAzh.kpX = [];
          TypingDNAzh.kpY = [];
          TypingDNAzh.kpAccZ = [];
          TypingDNAzh.kpTimes = [];
          if (!TypingDNAzh.pressCalculated) {
            TypingDNAzh.pressCalculated = true;
          }
  
          return [returnVal, returnMotion, kpza, kpXR, kpYR,];
        }
      }
  
      TypingDNAzh.mouse = {};
      TypingDNAzh.mouse.times = [];
      TypingDNAzh.mouse.xPositions = [];
      TypingDNAzh.mouse.yPositions = [];
      TypingDNAzh.mouse.scrollTimes = [];
      TypingDNAzh.mouse.scrollTopArr = [];
      TypingDNAzh.mouse.history = {};
      TypingDNAzh.mouse.history.stack = [];
  
      TypingDNAzh.mouse.getDistance = function(a, b) {
        return Math.sqrt((a * a) + (b * b));
      }
  
      TypingDNAzh.mouse.getTotalDistance = function(xPositions, yPositions) {
        var totalDistance = 0;
        var length = xPositions.length;
        for (i = 1; i < length - 1; i++) {
          var a = xPositions[i] - xPositions[i - 1];
          var b = yPositions[i] - yPositions[i - 1];
          totalDistance += TypingDNAzh.mouse.getDistance(a, b);
        }
        return totalDistance;
      }
  
      TypingDNAzh.mouse.getAngle = function(xPosDelta, yPosDelta) {
        var angle = 0;
        var leftRight = (xPosDelta >= 0); // 1 if left, 0 if right
        var downUp = (yPosDelta < 0); // 1 if down, 0 if up
        if (leftRight) {
          if (downUp) {
            angle = 180 + (Math.round(Math.atan(Math.abs(xPosDelta) / (Math.abs(yPosDelta) + 0.0000001)) / 0.01745329251)) // 0.01745329251 = pi/180
          } else {
            angle = 270 + (90 - Math.round(Math.atan(Math.abs(xPosDelta) / (Math.abs(yPosDelta) + 0.0000001)) / 0.01745329251))
          }
        } else {
          if (downUp) {
            angle = 90 + (90 - Math.round(Math.atan(Math.abs(xPosDelta) / (Math.abs(yPosDelta) + 0.0000001)) / 0.01745329251))
          } else {
            angle = Math.round(Math.atan(Math.abs(xPosDelta) / (Math.abs(yPosDelta) + 0.0000001)) / 0.01745329251)
          }
        }
        return angle;
      }
  
      TypingDNAzh.mouse.recordMoveAction = function(drag) {
        var length = TypingDNAzh.mouse.times.length;
        if (length < 3) {
          return;
        }
        var deltaTime = TypingDNAzh.mouse.times[length - 1] - TypingDNAzh.mouse.times[0];
        var xPosDelta = TypingDNAzh.mouse.xPositions[length - 1] - TypingDNAzh.mouse.xPositions[0];
        var yPosDelta = TypingDNAzh.mouse.yPositions[length - 1] - TypingDNAzh.mouse.yPositions[0];
        var directDistance = Math.round(TypingDNAzh.mouse.getDistance(xPosDelta, yPosDelta));
        var totalDistance = Math.round(TypingDNAzh.mouse.getTotalDistance(TypingDNAzh.mouse.xPositions, TypingDNAzh.mouse.yPositions));
        var ratioDistance = Math.round(totalDistance * 100 / directDistance);
        var speed = Math.round(directDistance * 100 / deltaTime);
        var angle = TypingDNAzh.mouse.getAngle(xPosDelta, yPosDelta);
        var eventType = drag === true ? 5 : 1;
        var arr = [eventType, deltaTime, directDistance, speed, angle, ratioDistance,];
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
          if (isNaN(arr[i])) {
            return;
          }
        }
        TypingDNAzh.mouse.history.add(arr);
        TypingDNAzh.lastMouseStop = false;
      }
  
      TypingDNAzh.mouse.recordScrollAction = function() {
        var length = TypingDNAzh.mouse.scrollTimes.length;
        if (length < 2) {
          return;
        }
        var deltaTime = TypingDNAzh.mouse.scrollTimes[length - 1] - TypingDNAzh.mouse.scrollTimes[0];
        var directDistance = TypingDNAzh.mouse.scrollTopArr[length - 1] - TypingDNAzh.mouse.scrollTopArr[0];
        var speed = Math.round(directDistance * 100 / deltaTime);
        var eventType = 2;
        var arr = [eventType, deltaTime, directDistance, speed,];
        var arrLen = arr.length;
        for (var i = 0; i < arrLen; i++) {
          if (isNaN(arr[i]) && !isFinite(arr[i])) {
            return;
          }
        }
        TypingDNAzh.mouse.history.add(arr);
      }
  
      TypingDNAzh.mouse.history.add = function(arr) {
        this.stack.push(arr);
        if (this.stack.length > TypingDNAzh.maxMouseHistoryLength) {
          this.stack.shift();
        }
      }
  
      TypingDNAzh.mouse.history.getDiagram = function() {
        var mouseDiagram = this.stack.join('|');
        var diagramType = 9; // for mouse diagram
        return [String(TypingDNAzh.isMobile()) + ',' + String(TypingDNAzh.version) + ',' + TypingDNAzh.flags + ',' + diagramType + ',0,0,' + TypingDNAzh.getSpecialKeys() +
          ',' + TypingDNAzh.getDeviceSignature(), mouseDiagram
        ].join('|');
      }
  
      TypingDNAzh.mouse.clearLastMove = function() {
        TypingDNAzh.mouse.times = [];
        TypingDNAzh.mouse.xPositions = [];
        TypingDNAzh.mouse.yPositions = [];
      }
  
      TypingDNAzh.mouse.checkMove = function(drag) {
        clearInterval(TypingDNAzh.moveInterval);
        if (TypingDNAzh.mouse.started === true) {
          TypingDNAzh.mouse.started = false;
          TypingDNAzh.mouse.recordMoveAction(drag);
          TypingDNAzh.mouse.clearLastMove();
        }
      }
  
      TypingDNAzh.mouse.clearLastScroll = function() {
        TypingDNAzh.mouse.scrollTimes = [];
        TypingDNAzh.mouse.scrollTopArr = [];
      }
  
      TypingDNAzh.mouse.checkScroll = function() {
        clearInterval(TypingDNAzh.scrollInterval);
        if (TypingDNAzh.mouse.scrollStarted === true) {
          TypingDNAzh.mouse.scrollStarted = false;
          TypingDNAzh.mouse.recordScrollAction();
          TypingDNAzh.mouse.clearLastScroll();
        }
      }
  
      /**
       * Adds a target to the targetIds array.
       */
      TypingDNAzh.addTarget = function(target) {
        var targetLength = TypingDNAzh.targetIds.length;
        var targetFound = false;
        if (targetLength > 0) {
          for (var i = 0; i < targetLength; i++) {
            if (TypingDNAzh.targetIds[i] === target) {
              targetFound = true;
              break;
            }
          }
          if (!targetFound) {
            TypingDNAzh.targetIds.push(target);
          }
        } else {
          TypingDNAzh.targetIds.push(target);
        }
      }
  
      /**
       * Adds a target to the targetIds array.
       */
      TypingDNAzh.removeTarget = function(target) {
        var targetLength = TypingDNAzh.targetIds.length;
        if (targetLength > 0) {
          for (var i = 0; i < targetLength; i++) {
            if (TypingDNAzh.targetIds[i] === target) {
              TypingDNAzh.targetIds.splice(i, 1);
              break;
            }
          }
        }
      }
  
      /**
       * Resets the history stack
       */
      TypingDNAzh.reset = function(all) {
        TypingDNAzh.history.stack = [];
        TypingDNAzh.history.stackDiagram = [];
        TypingDNAzh.clickTimes = [];
        TypingDNAzh.stopTimes = [];
        TypingDNAzh.ACInputLengths = {
          inputs: [],
          lastLength: [],
        };
        if (all === true) {
          TypingDNAzh.mouse.history.stack = [];
        }
      }
  
      /**
       * Automatically called at initilization. It starts the recording of keystrokes.
       */
      TypingDNAzh.start = function() {
        TypingDNAzh.diagramRecording = true;
        return TypingDNAzh.recording = true;
      }
  
      /**
       * Ends the recording of further keystrokes. To restart recording afterwards you can
       * either call TypingDNAzh.start() or create a new TypingDNAzh object again, not recommended.
       */
      TypingDNAzh.stop = function() {
        TypingDNAzh.diagramRecording = false;
        return TypingDNAzh.recording = false;
      }
  
      /**
       * Starts the recording of mouse activity.
       */
      TypingDNAzh.startMouse = function() {
        return TypingDNAzh.mouseRecording = TypingDNAzh.mouseMoveRecording = true;
      }
  
      /**
       * Stops the recording of mouse activity.
       */
      TypingDNAzh.stopMouse = function() {
        return TypingDNAzh.mouseRecording = TypingDNAzh.mouseMoveRecording = false;
      }
  
      /**
       * Resets mouse recording
       */
      TypingDNAzh.resetMouse = function(all) {
        if (all === true) {
          TypingDNAzh.clickTimes = [];
          TypingDNAzh.stopTimes = [];
        }
        TypingDNAzh.mouse.history.stack = [];
      }
  
      /**
       * This is the main function that outputs the typing pattern as a String
       * {type:Number, text:String, textId:Number, length: Number, targetId:String, caseSensitive:Boolean}
       * @param {Object} obj an object with the following properties
       * * * @param {String} type 0 for anytext pattern, 1 for sametext pattern (also called diagram pattern)
       * * * and 2 for extended pattern (most versatile, can replace both anytext and sametext patterns)
       * * * @param {Number} length (Optional) the length of the text in the history for which you want
       * * * the typing pattern. length is ignored when text or targetId is set (or both).
       * * * @param {String} text  (Only for type 1 and type 2) a typed string that you want the typing pattern for
       * * * @param {Number} textId (Optional, only for type 1 and type 2) a personalized id for the typed text
       * * * @param {String} targetId (Optional) specifies if pattern is obtain only from text typed in a certain target
       * * * @param {Boolean} caseSensitive (Optional, default: false) Used if you pass a text for type 1 or type 2
       * * * DEPRECATED * * * in favor of type = 2 * * *
       * * * @param {Boolean} extended (Only for type 1) specifies if full information about what was typed is produced,
       * * * including the actual key pressed, if false, only the order of pressed keys is kept (no actual content)
       * @return {String} A typing pattern in string form
       * @example var typingPattern = tdna.getTypingPattern({type:0, length:180});
       * @example var typingPattern = tdna.getTypingPattern({type:1, text:"Hello5g21?*"});
       * @example var typingPattern = tdna.getTypingPattern({type:2, text:"example@mail.com"});
       */
      TypingDNAzh.getTypingPattern = function(obj) {
        var str = '';
        if (typeof obj === 'object') {
          switch (obj.type) {
            case 0:
              return TypingDNAzh.get(obj.length, obj.targetId);
              break;
            case 1:
              str = (obj.text !== undefined) ? obj.text : obj.length;
              return TypingDNAzh.history.getDiagram(obj.extended, str, obj.textId, obj.targetId, obj.caseSensitive);
              break;
            case 2:
              str = (obj.text !== undefined) ? obj.text : obj.length;
              return TypingDNAzh.history.getDiagram(true, str, obj.textId, obj.targetId, obj.caseSensitive);
              break;
            default:
              return TypingDNAzh.get(obj.length);
              break;
          }
        } else {
          return TypingDNAzh.get();
        }
      }
  
      TypingDNAzh.getDiagram = function(str, textId) {
        return TypingDNAzh.history.getDiagram(false, str, textId, undefined, false);
      }
  
      TypingDNAzh.getExtendedDiagram = function(str, textId) {
        return TypingDNAzh.history.getDiagram(true, str, textId, undefined, false);
      }
  
      TypingDNAzh.getMouseDiagram = function() {
        return TypingDNAzh.mouse.history.getDiagram();
      }
      TypingDNAzh.getSpecialKeys = function() {
        return TypingDNAzh.history.getSpecialKeys();
      }
  
      TypingDNAzh.get = function(length, targetId) {
        var historyTotalLength = TypingDNAzh.history.stack.length;
        if (length === undefined || length === 0) {
          length = TypingDNAzh.defaultHistoryLength;
        }
        if (length > historyTotalLength) {
          length = historyTotalLength;
        }
        var obj = {};
        var targetLength;
        [obj.arr, targetLength] = TypingDNAzh.history.get(length, "", targetId);
        if (targetId !== undefined && targetId !== "") {
          length = targetLength;
        }
        var zl = TypingDNAzh.zl;
        var histRev = length;
        var histSktF = TypingDNAzh.math.fo(TypingDNAzh.history.get(length, "seek", targetId));
        var histPrtF = TypingDNAzh.math.fo(TypingDNAzh.history.get(length, "press", targetId));
        var pressHistMean = Math.round(TypingDNAzh.math.avg(histPrtF));
        var seekHistMean = Math.round(TypingDNAzh.math.avg(histSktF));
        var pressHistSD = Math.round(TypingDNAzh.math.sd(histPrtF));
        var seekHistSD = Math.round(TypingDNAzh.math.sd(histSktF));
        var charMeanTime = seekHistMean + pressHistMean;
        var pressRatio = TypingDNAzh.math.rd((pressHistMean + zl) / (charMeanTime + zl), 4);
        var seekToPressRatio = TypingDNAzh.math.rd((1 - pressRatio) / pressRatio, 4);
        var pressSDToPressRatio = TypingDNAzh.math.rd((pressHistSD + zl) / (pressHistMean + zl), 4);
        var seekSDToPressRatio = TypingDNAzh.math.rd((seekHistSD + zl) / (pressHistMean + zl), 4);
        var cpm = Math.round(6E4 / (charMeanTime + zl));
        if (histRev === 0) {
          cpm = 0;
        }
        var arr = [];
        for (var i in obj.arr) {
          var rev = obj.arr[i][1].length;
          var seekMean = 0;
          var pressMean = 0;
          var postMean = 0;
          var seekSD = 0;
          var pressSD = 0;
          var postSD = 0;
          switch (obj.arr[i][0].length) {
            case 0:
              break;
            case 1:
              seekMean = TypingDNAzh.math.rd((obj.arr[i][0][0] + zl) / (seekHistMean + zl), 4);
              break;
            default:
              arr = TypingDNAzh.math.fo(obj.arr[i][0]);
              seekMean = TypingDNAzh.math.rd((TypingDNAzh.math.avg(arr) + zl) / (seekHistMean + zl), 4);
              seekSD = TypingDNAzh.math.rd((TypingDNAzh.math.sd(arr) + zl) / (seekHistSD + zl), 4);
          }
          switch (obj.arr[i][1].length) {
            case 0:
              break;
            case 1:
              pressMean = TypingDNAzh.math.rd((obj.arr[i][1][0] + zl) / (pressHistMean + zl), 4);
              break;
            default:
              arr = TypingDNAzh.math.fo(obj.arr[i][1]);
              pressMean = TypingDNAzh.math.rd((TypingDNAzh.math.avg(arr) + zl) / (pressHistMean + zl), 4);
              pressSD = TypingDNAzh.math.rd((TypingDNAzh.math.sd(arr) + zl) / (pressHistSD + zl), 4);
          }
          switch (obj.arr[i][2].length) {
            case 0:
              break;
            case 1:
              postMean = TypingDNAzh.math.rd((obj.arr[i][2][0] + zl) / (seekHistMean + zl), 4);
              break;
            default:
              arr = TypingDNAzh.math.fo(obj.arr[i][2]);
              postMean = TypingDNAzh.math.rd((TypingDNAzh.math.avg(arr) + zl) / (seekHistMean + zl), 4);
              postSD = TypingDNAzh.math.rd((TypingDNAzh.math.sd(arr) + zl) / (seekHistSD + zl), 4);
          }
          delete obj.arr[i][2];
          delete obj.arr[i][1];
          delete obj.arr[i][0];
          obj.arr[i][0] = rev;
          obj.arr[i][1] = seekMean;
          obj.arr[i][2] = pressMean;
          obj.arr[i][3] = postMean;
          obj.arr[i][4] = seekSD;
          obj.arr[i][5] = pressSD;
          obj.arr[i][6] = postSD;
        }
        arr = [];
        TypingDNAzh.apu(arr, histRev);
        TypingDNAzh.apu(arr, cpm);
        TypingDNAzh.apu(arr, charMeanTime);
        TypingDNAzh.apu(arr, pressRatio);
        TypingDNAzh.apu(arr, seekToPressRatio);
        TypingDNAzh.apu(arr, pressSDToPressRatio);
        TypingDNAzh.apu(arr, seekSDToPressRatio);
        TypingDNAzh.apu(arr, pressHistMean);
        TypingDNAzh.apu(arr, seekHistMean);
        TypingDNAzh.apu(arr, pressHistSD);
        TypingDNAzh.apu(arr, seekHistSD);
        for (var c = 0; c <= 6; c++) {
          for (i = 0; i < 44; i++) {
            var keyCode = TypingDNAzh.keyCodes[i];
            var val = obj.arr[keyCode][c];
            if (val === 0 && c > 0) {
              val = 1;
            }
            TypingDNAzh.apu(arr, val);
          }
        }
        TypingDNAzh.apu(arr, TypingDNAzh.isMobile());
        TypingDNAzh.apu(arr, TypingDNAzh.version);
        TypingDNAzh.apu(arr, TypingDNAzh.flags);
        TypingDNAzh.apu(arr, -1); // diagramType
        TypingDNAzh.apu(arr, histRev);
        TypingDNAzh.apu(arr, 0); // textId
        arr.push(TypingDNAzh.getSpecialKeys());
        arr.push(TypingDNAzh.getDeviceSignature());
        return arr.join(",");
      }
  
      TypingDNAzh.apu = function(arr, val) {
        "NaN" === String(val) && (val = 0);
        arr.push(val);
      }
  
      TypingDNAzh.math = {};
  
      TypingDNAzh.math.rd = function(val, dec) {
        return Number(val.toFixed(dec));
      }
  
      TypingDNAzh.math.avg = function(arr) {
        var len = arr.length;
        if (len > 0) {
          var sum = 0;
          for (var i = 0; i < len; i++) {
            sum += arr[i];
          }
          return this.rd(sum / len, 4);
        } else {
          return 0;
        }
      }
  
      TypingDNAzh.math.sd = function(arr) {
        var len = arr.length;
        if (len < 2) {
          return 0;
        } else {
          var sumVS = 0;
          var mean = this.avg(arr);
          for (var i = 0; i < len; i++) {
            sumVS += (arr[i] - mean) * (arr[i] - mean);
          }
          var sd = Math.sqrt(sumVS / len);
          return sd;
        }
      }
  
      TypingDNAzh.math.fo = function(arr) {
        if (arr.length > 1) {
          var values = arr.concat();
          var len = arr.length;
          values.sort(function(a, b) {
            return a - b;
          });
          var asd = this.sd(values);
          var aMean = values[Math.ceil(arr.length / 2)];
          var multiplier = 2;
          var maxVal = aMean + multiplier * asd;
          var minVal = aMean - multiplier * asd;
          if (len < 20) {
            minVal = 0;
          }
          var fVal = [];
          for (var i = 0; i < len; i++) {
            var tempval = values[i];
            if (tempval < maxVal && tempval > minVal) {
              fVal.push(tempval);
            }
          }
          return fVal;
        } else {
          return arr;
        }
      }
  
      // Calculate a 32 bit FNV-1a hash
      TypingDNAzh.math.fnv1aHash = function(str) {
        if (str === undefined || typeof str !== 'string') {
          return 0;
        }
        str = str.toLowerCase();
        var i, l;
        var hval = 0x721b5ad4;
        for (i = 0, l = str.length; i < l; i++) {
          hval ^= str.charCodeAt(i);
          hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        return hval >>> 0;
      }
  
      TypingDNAzh.history = {};
      TypingDNAzh.history.stack = [];
      TypingDNAzh.history.stackDiagram = [];
  
      TypingDNAzh.history.add = function(arr) {
        this.stack.push(arr);
        if (this.stack.length > TypingDNAzh.maxHistoryLength) {
          this.stack.shift();
        }
      }
  
      TypingDNAzh.history.addDiagram = function(arr) {
        this.stackDiagram.push(arr);
      }
  
      TypingDNAzh.history.getDiagram = function(extended, str, textId, targetId, caseSensitive) {
        caseSensitive = (caseSensitive !== undefined) ? caseSensitive : (str === undefined || str === "");
        var returnArr = [];
        var motionArr = [];
        var kpzaArr = [];
        var kpxrArr = [];
        var kpyrArr = [];
        var mobile = Boolean(TypingDNAzh.isMobile());
        var diagramType = (extended === true) ? 1 : 0;
        var stackDiagram = this.stackDiagram;
        var element = {};
        if (targetId !== undefined && targetId !== "" && stackDiagram.length > 0) {
          stackDiagram = TypingDNAzh.sliceStackByTargetId(stackDiagram, targetId);
          if (str === undefined || str === "") {
            element = TypingDNAzh.document.getElementById(targetId);
            if (element != null) {
              str = element.value;
            }
          }
        } else {
          var targetLength = TypingDNAzh.targetIds.length;
          if (str === undefined || str === "") {
            if (targetLength > 0) {
              str = "";
              for (var i = 0; i < targetLength; i++) {
                element = TypingDNAzh.document.getElementById(TypingDNAzh.targetIds[i]);
                if (element != null) {
                  str += element.value;
                }
              }
            } else {
              if (!extended) {
                console.log("Please provide a fixed string param OR use the addTarget method.");
              }
            }
          }
        }
        var missingCount = 0;
        var diagramHistoryLength = stackDiagram.length;
        var strLength = diagramHistoryLength;
        if (typeof str === 'string') {
          strLength = str.length;
        } else if (typeof str === 'number' && str < diagramHistoryLength) {
          strLength = str;
        }
        var returnTextId = 0;
        if (textId !== undefined) {
          if (isNaN(parseInt(textId))) {
            returnTextId = TypingDNAzh.math.fnv1aHash(textId);
          } else {
            returnTextId = parseInt(textId);
          }
        } else {
          if (typeof str === 'string') {
            returnTextId = TypingDNAzh.math.fnv1aHash(str);
          }
        }
        returnArr.push([TypingDNAzh.isMobile(), TypingDNAzh.version, TypingDNAzh.flags, diagramType, strLength,
          returnTextId, TypingDNAzh.getSpecialKeys(), TypingDNAzh.getDeviceSignature(),
        ]);
        var arr = [];
        var keyCode = 0;
        var charCode = 0;
        var seekTime = 0;
        var pressTime = 0;
        if (str !== undefined && str.length > 0 && typeof str === 'string') {
          var strLower = str.toLowerCase();
          var strUpper = str.toUpperCase();
          var lastFoundPos = [];
          var lastPos = 0;
          var strUpperCharCode;
          var currentSensitiveCharCode;
          for (i = 0; i < str.length; i++) {
            var currentCharCode = str.charCodeAt(i);
            if (!caseSensitive) {
              strUpperCharCode = strUpper.charCodeAt(i);
              currentSensitiveCharCode = (strUpperCharCode !== currentCharCode) ? strUpperCharCode : strLower.charCodeAt(i);
            }
            var startPos = lastPos;
            var finishPos = diagramHistoryLength;
            var found = false;
            while (found === false) {
              for (var j = startPos; j < finishPos; j++) {
                arr = stackDiagram[j];
                charCode = arr[3];
                if (charCode === currentCharCode || (!caseSensitive && charCode === currentSensitiveCharCode)) {
                  found = true;
                  if (j === lastPos) {
                    lastPos++;
                    lastFoundPos = [];
                  } else {
                    lastFoundPos.push(j);
                    var len = lastFoundPos.length;
                    if (len > 1 && lastFoundPos[len - 1] === lastFoundPos[len - 2] + 1) {
                      lastPos = j + 1;
                      lastFoundPos = [];
                    }
                  }
                  keyCode = arr[0];
                  seekTime = arr[1];
                  pressTime = arr[2];
                  if (extended) {
                    returnArr.push([charCode, seekTime, pressTime, keyCode,]);
                  } else {
                    returnArr.push([seekTime, pressTime,]);
                  }
                  if (mobile === true && arr[6] !== undefined && arr[6].length > 0) {
                    if (TypingDNAzh.hasDeviceMotion && TypingDNAzh.hasDeviceOrientation) {
                      if (TypingDNAzh.motionFixedData === true) {
                        motionArr.push(arr[6]);
                      }
                      if (TypingDNAzh.motionArrayData === true) {
                        kpzaArr.push(arr[7]);
                        kpxrArr.push(arr[8]);
                        kpyrArr.push(arr[9]);
                      }
                    }
                  }
                  break;
                }
              }
              if (found === false) {
                if (startPos !== 0) {
                  startPos = 0;
                  finishPos = lastPos;
                } else {
                  found = true;
                  if (TypingDNAzh.replaceMissingKeys) {
                    missingCount++;
                    if (typeof TypingDNAzh.savedMissingAvgValues !== 'object' ||
                      TypingDNAzh.savedMissingAvgValues.historyLength !== diagramHistoryLength) {
                      var histSktF = TypingDNAzh.math.fo(TypingDNAzh.history.get(0, "seek"));
                      var histPrtF = TypingDNAzh.math.fo(TypingDNAzh.history.get(0, "press"));
                      seekTime = Math.round(TypingDNAzh.math.avg(histSktF));
                      pressTime = Math.round(TypingDNAzh.math.avg(histPrtF));
                      TypingDNAzh.savedMissingAvgValues = {
                        seekTime: seekTime,
                        pressTime: pressTime,
                        historyLength: diagramHistoryLength,
                      };
                    } else {
                      seekTime = TypingDNAzh.savedMissingAvgValues.seekTime;
                      pressTime = TypingDNAzh.savedMissingAvgValues.pressTime;
                    }
                    var missing = 1;
                    if (extended) {
                      returnArr.push([currentCharCode, seekTime, pressTime, currentCharCode, missing,]);
                    } else {
                      returnArr.push([seekTime, pressTime, missing,]);
                    }
                    if (mobile === true) {
                      if (TypingDNAzh.motionFixedData === true) {
                        motionArr.push("");
                      }
                      if (TypingDNAzh.motionArrayData === true) {
                        kpzaArr.push("");
                        kpxrArr.push("");
                        kpyrArr.push("");
                      }
                    }
                    break;
                  }
                }
              }
            }
            if (TypingDNAzh.replaceMissingKeysPerc < missingCount * 100 / strLength) {
              return null;
            }
          }
        } else {
          var startCount = 0;
          if (typeof str === 'number') {
            startCount = diagramHistoryLength - str;
          }
          if (startCount < 0) {
            startCount = 0;
          }
          for (i = startCount; i < diagramHistoryLength; i++) {
            arr = stackDiagram[i];
            keyCode = arr[0];
            seekTime = arr[1];
            pressTime = arr[2];
            if (extended) {
              charCode = arr[3];
              returnArr.push([charCode, seekTime, pressTime, keyCode]);
            } else {
              returnArr.push([seekTime, pressTime]);
            }
            if (mobile === true && arr[6] !== undefined && arr[6].length > 0) {
              if (TypingDNAzh.motionFixedData === true) {
                motionArr.push(arr[6]);
              }
              if (TypingDNAzh.motionArrayData === true) {
                kpzaArr.push(arr[7]);
                kpxrArr.push(arr[8]);
                kpyrArr.push(arr[9]);
              }
            }
          }
        }
        var returnStr = returnArr.join("|");
        if (mobile === true) {
          if (TypingDNAzh.motionFixedData === true) {
            returnStr += "#" + motionArr.join("|");
          }
          if (TypingDNAzh.motionArrayData === true) {
            returnStr += "#" + kpzaArr.join("|");
            returnStr += "/" + kpxrArr.join("|");
            returnStr += "/" + kpyrArr.join("|");
          }
        }
        return returnStr;
      }
  
      TypingDNAzh.sliceStackByTargetId = function(stack, targetId) {
        var length = stack.length;
        var newStack = [];
        for (i = 0; i < length; i++) {
          var arr = stack[i];
          if (arr[5] === targetId) {
            newStack.push(arr);
          }
        }
        return newStack;
      }
  
      TypingDNAzh.history.get = function(length, type, targetId) {
        var stack = this.stack;
        if (targetId !== undefined && targetId !== "" && stack.length > 0) {
          stack = TypingDNAzh.sliceStackByTargetId(stack, targetId);
        }
        var historyTotalLength = stack.length;
        if (length === 0 || length === undefined) {
          length = TypingDNAzh.defaultHistoryLength;
        }
        if (length > historyTotalLength) {
          length = historyTotalLength;
        }
        var seekTime = 0;
        var pressTime = 0;
        switch (type) {
          case "seek":
            var seekArr = [];
            for (var i = 1; i <= length; i++) {
              seekTime = stack[historyTotalLength - i][1];
              if (seekTime <= TypingDNAzh.maxSeekTime) {
                seekArr.push(seekTime);
              }
            };
            return seekArr;
            break;
          case "press":
            var pressArr = [];
            for (i = 1; i <= length; i++) {
              pressTime = stack[historyTotalLength - i][2];
              if (pressTime <= TypingDNAzh.maxPressTime) {
                pressArr.push(pressTime);
              }
            };
            return pressArr;
            break;
          default:
            var historyStackObj = {};
            for (i = 0; i < keyCodesLen; i++) {
              historyStackObj[TypingDNAzh.keyCodes[i]] = [
                [],
                [],
                []
              ];
            }
            for (i = 1; i <= length; i++) {
              var arr = stack[historyTotalLength - i];
              var keyCode = arr[0];
              seekTime = arr[1];
              pressTime = arr[2];
              var prevKeyCode = arr[3];
              if (TypingDNAzh.keyCodesObj[keyCode]) {
                if (seekTime <= TypingDNAzh.maxSeekTime) {
                  historyStackObj[keyCode][0].push(seekTime);
                  if (prevKeyCode !== 0 && TypingDNAzh.keyCodesObj[prevKeyCode]) {
                    historyStackObj[prevKeyCode][2].push(seekTime);
                  }
                }
                if (pressTime <= TypingDNAzh.maxPressTime) {
                  historyStackObj[keyCode][1].push(pressTime);
                }
              }
            };
            return [historyStackObj, length];
        }
      }
  
      TypingDNAzh.history.getSpecialKeys = function() {
        var returnArr = [];
        var length = this.stack.length;
        var historyStackObj = {};
        var spKeyCodesLen = TypingDNAzh.spKeyCodes.length;
        var arr = {};
        for (var i = 0; i < spKeyCodesLen; i++) {
          historyStackObj[TypingDNAzh.spKeyCodes[i]] = [
            [],
          ];
        }
        for (i = 1; i <= length; i++) {
          arr = this.stack[length - i];
          if (TypingDNAzh.spKeyCodesObj[arr[0]]) {
            var keyCode = arr[0];
            var pressTime = arr[2];
            if (pressTime <= TypingDNAzh.maxPressTime) {
              historyStackObj[keyCode][0].push(pressTime);
            }
          }
        }
        for (i = 0; i < spKeyCodesLen; i++) {
          arr = TypingDNAzh.math.fo(historyStackObj[TypingDNAzh.spKeyCodes[i]][0]);
          var arrLen = arr.length;
          returnArr.push(arrLen);
          if (arrLen > 1) {
            returnArr.push(Math.round(TypingDNAzh.math.avg(arr)));
            returnArr.push(Math.round(TypingDNAzh.math.sd(arr)));
          } else if (arrLen === 1) {
            returnArr.push([arr[0], -1,]);
          } else {
            returnArr.push([-1, -1,]);
          }
        }
        var clicksArrLen = TypingDNAzh.clickTimes.length;
        returnArr.push(clicksArrLen);
        if (clicksArrLen > 1) {
          returnArr.push(Math.round(TypingDNAzh.math.avg(TypingDNAzh.clickTimes)));
          returnArr.push(Math.round(TypingDNAzh.math.sd(TypingDNAzh.clickTimes)));
        } else if (clicksArrLen === 1) {
          returnArr.push(TypingDNAzh.clickTimes[0], -1);
        } else {
          returnArr.push([-1, -1]);
        }
        var stopArrLen = TypingDNAzh.stopTimes.length;
        returnArr.push(stopArrLen);
        if (stopArrLen > 1) {
          returnArr.push(Math.round(TypingDNAzh.math.avg(TypingDNAzh.stopTimes)));
          returnArr.push(Math.round(TypingDNAzh.math.sd(TypingDNAzh.stopTimes)));
        } else if (stopArrLen === 1) {
          returnArr.push(TypingDNAzh.stopTimes[0], -1);
        } else {
          returnArr.push([-1, -1]);
        }
        return returnArr;
      }
  
      TypingDNAzh.getOSBrowserMobile = function() {
        var ua = TypingDNAzh.ua;
        var platform = TypingDNAzh.platform;
        var orientation = screen.height >= screen.width;
        var os = 0;
        var osversion = 0;
        var browserType = 0;
        var version = 0;
        var mobile = 1;
        if (/MSIE/.test(ua)) {
          browserType = 4;
          if (/IEMobile/.test(ua)) {
            mobile = 2;
          }
          if (/MSIE \d+[.]\d+/.test(ua)) {
            version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1].split('.')[0];
          }
        } else if (/Edge/.test(ua)) {
          browserType = 6;
          if (/Edge\/[\d\.]+/.test(ua)) {
            version = /Edge\/[\d\.]+/.exec(ua)[0].split('/')[1].split('.')[0];
          }
        } else if (/Chrome/.test(ua)) {
          if (/CrOS/.test(ua)) {
            platform = 'CrOS';
          }
          browserType = 1;
          if (/Chrome\/[\d\.]+/.test(ua)) {
            version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1].split('.')[0];
          }
        } else if (/Opera/.test(ua)) {
          browserType = 3;
          if (/mini/.test(ua) || /Mobile/.test(ua)) {
            mobile = 2;
          }
        } else if (/Android/.test(ua)) {
          browserType = 7;
          mobile = 2;
          os = 6;
        } else if (/Firefox/.test(ua)) {
          browserType = 2;
          if (/Fennec/.test(ua)) {
            mobile = 2;
          }
          if (/Firefox\/[\.\d]+/.test(ua)) {
            version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1].split('.')[0];
          }
        } else if (/Safari/.test(ua)) {
          browserType = 5;
          if ((/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua))) {
            os = 5;
            if (/iPad/.test(ua)) {
              mobile = 3;
            } else {
              mobile = 2;
            }
          }
        }
        if (!version) {
          if (/Version\/[\.\d]+/.test(ua)) {
            version = /Version\/[\.\d]+/.exec(ua);
          }
          if (version) {
            version = version[0].split('/')[1].split('.')[0];
          } else {
            if (/Opera\/[\.\d]+/.test(ua)) {
              version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1].split('.')[0];
            }
          }
        }
        if (platform === 'MacIntel' || platform === 'MacPPC') {
          os = 2;
          if (/10[\.\_\d]+/.test(ua)) {
            osversion = /10[\.\_\d]+/.exec(ua)[0].split('.', 2).join('');
          }
          if (/[\_]/.test(osversion)) {
            osversion = osversion.split('_').slice(0, 2).join('');
          }
        } else if (platform === 'CrOS') {
          os = 4;
        } else if (platform === 'Win32' || platform === 'Win64') {
          os = 1;
        } else if (!os && /Android/.test(ua)) {
          os = 6;
        } else if (!os && /Linux/.test(platform)) {
          os = 3;
        } else if (!os && /Windows/.test(ua)) {
          os = 1;
        }
        if ((mobile !== 3 || mobile === 2) && TypingDNAzh.isMobile() === 1) {
          if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(ua)) {
            mobile = 3;
          } else if ((os === 6 || os === 0) && ((orientation && screen.height > 767 && screen.width > 480) ||
            (!orientation && screen.width > 767 && screen.height > 480))) {
            mobile = 3;
          } else if (os === 1) {
            if (window.navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0) {
              mobile = 3;
            }
          } else {
            mobile = 2;
          }
        }
        var isMobile2 = Number((typeof window.orientation !== 'undefined') || (ua.indexOf('IEMobile') !== -1)) + 1;
        var isTouchDevice = Number('ontouchstart' in window || navigator.maxTouchPoints || window.DocumentTouch && document instanceof DocumentTouch || false) + 1;
        return [Number(os), Number(osversion), Number(browserType), Number(version), Number(mobile), isMobile2, Number(orientation), isTouchDevice];
      }
  
      TypingDNAzh.getDeviceSignature = function() {
        var osBrowserMobile = TypingDNAzh.getOSBrowserMobile();
        var deviceType = osBrowserMobile[4]; // {0:unknown, 1:pc, 2:phone, 3:tablet}
        var deviceModel = 0; // fnv1aHash of device manufacturer + "-" + model
        var deviceId = 0; // fnv1aHash of device id
        var isMobile = osBrowserMobile[5]; // {0:unknown, 1:pc, 2:mobile}
        var operatingSystem = osBrowserMobile[0]; // {0:unknown/other, 1:Windows, 2:MacOS, 3:Linux, 4:ChromeOS, 5:iOS, 6: Android}
        var programmingLanguage = 1; // {0:unknown, 1:JavaScript, 2:Java, 3:Swift, 4:C++, 5:C#, 6:AndroidJava}
        var systemLanguage = TypingDNAzh.math.fnv1aHash(navigator.language); // fnv1aHash of language
        var isTouchDevice = osBrowserMobile[7] // {0:unknown, 1:no, 2:yes}
        var pressType = TypingDNAzh.getPressType(); // {0:unknown, 1:recorded, 2:calculated, 3:mixed}
        var keyboardInput = 0; // {0:unknown, 1:keyboard, 2:touchscreen, 3:mixed}
        var keyboardType = 0; // {0:unknown, 1:internal, 2:external, 3:mixed}
        var pointerInput = 0; // {0:unknown, 1:mouse, 2:touchscreen, 3:trackpad, 4:other, 5:mixed}
        var browserType = osBrowserMobile[2]; // {0:unknown, 1:Chrome, 2:Firefox, 3:Opera, 4:IE, 5: Safari, 6: Edge, 7:AndroidWK}
        var displayWidth = screen.width || 0; // screen width in pixels
        var displayHeight = screen.height || 0; // screen height in pixels
        var orientation = osBrowserMobile[6] ? 1 : 2;// {0:unknown, 1:portrait, 2:landscape}
        var osVersion = osBrowserMobile[1]; // numbers only
        var browserVersion = osBrowserMobile[3]; // numbers only
        var cookieId = TypingDNAzh.cookieId; // default 0
        var signature = TypingDNAzh.math.fnv1aHash([deviceType, deviceModel, deviceId, isMobile, operatingSystem, programmingLanguage, systemLanguage, isTouchDevice, pressType,
          keyboardInput, keyboardType, pointerInput, browserType, displayWidth, displayHeight, orientation, osVersion, browserVersion, cookieId
        ].join('-')); // fnv1aHash of all above!
        return [deviceType, deviceModel, deviceId, isMobile, operatingSystem, programmingLanguage, systemLanguage, isTouchDevice, pressType,
          keyboardInput, keyboardType, pointerInput, browserType, displayWidth, displayHeight, orientation, osVersion, browserVersion, cookieId, signature
        ];
      }
  
      TypingDNAzh.getPressType = function() {
        if (TypingDNAzh.isMobile() === 0) {
          TypingDNAzh.pressRecorded === true;
          return 1; // desktop browser (typicaly)
        }
        if (TypingDNAzh.pressCalculated === true) {
          if (TypingDNAzh.pressRecorded === true) {
            return 3;
          } else {
            return 2; // mobile browser (typicaly)
          }
        } else if (TypingDNAzh.pressRecorded === true) {
          return 1; // mobile app (typicaly)
        } else {
          return 0;
        }
      }
      /**
       * Checks the quality of a typing pattern type 0, how well it is revelated, how useful the
       * information will be for matching applications. It returns a value between 0 and 1.
       * Values over 0.3 are acceptable, however a value over 0.7 shows good pattern strength.
       * @param  {String} typingPattern The typing pattern string returned by the getTypingPattern({type:0}) function.
       * @return {Number} A real number between 0 and 1. A close to 1 value means a stronger pattern.
       * @example var quality = tdna.getQuality(typingPattern);
       */
      TypingDNAzh.getQuality = function(typingPattern) {
        var obj = typingPattern.split(",");
        for (var i = 0; i < obj.length; i++) {
          obj[i] = Number(obj[i]);
        }
        var acc = 0;
        var rec = 0;
        var avgAcc = 0;
        var revs = obj.slice(11, 55);
        var avg = TypingDNAzh.math.avg(revs);
        var revsLen = revs.length;
        for (i = 0; i < revsLen; i++) {
          rec += Number(revs[i] > 0);
          acc += Number(revs[i] > 4);
          avgAcc += Number(revs[i] > avg);
        }
        var tReturn = Math.sqrt(rec * acc * avgAcc) / 75;
        return tReturn > 1 ? 1 : tReturn;
      }
  
      /**
       * Checks the validity of a typing pattern if recorded on mobile.
       * @param  {String} typingPattern The typing pattern string returned by the getTypingPattern({type:0}) function.
       * @return {Number} A real number between 0 and 1. A number larger than 0.7 usually means a valid pattern.
       * @example var quality = tdna.checkMobileValidity(typingPattern);
       */
      TypingDNAzh.checkMobileValidity = function(typingPattern) {
        var obj = typingPattern.split(',');
        var totalEvents = obj[0];
        if (totalEvents === 0) {
          return 0;
        }
        var rec = 0;
        var revs = obj.slice(11, 55);
        var revsLen = revs.length;
        for (var i = 0; i < revsLen; i++) {
          rec += Number(revs[i]);
        }
        return rec / totalEvents;
      }
  
      /**
       * Returns the length of the typing pattern.
       * @param  {String} typingPattern The typing pattern string returned by the get() function.
       * @return {Number} 0 if the typing pattern is not a valid pattern. A number greater than 0, otherwise.
       * @example var length = tdna.getLength("0,3.1,0,0,1,1091545568,0,-1,-1,0,-1,-1,0,-1,-1,2,76,13,2,105,44,1,0,0,1,1,1,902248182,11,1,0,0,0,1,2048,1152,1,0,76,0,2053506419|13436,101");
       */
      TypingDNAzh.getLength = function(typingPattern) {
        if(typingPattern && typeof typingPattern === 'string') {
          var separatorIndex = typingPattern.indexOf('|');
          if(separatorIndex > 0) {
            return Number(typingPattern.substring(0,separatorIndex).split(',')[4]) || 0;
          } else {
            return Number(typingPattern.split(',')[0]) || 0;
          }
        }
        return 0;
      }
  
      /**
       * Calculates a 32-bit FNV-1a hash on the string provided
       * @param  {String} str The string for which the textId is calculated. Usually the text being typed.
       * @return {Number} The hash of the string provided as param.
       * @example var textId = tdna.getTextId("I type to be authenticated");
       */
      TypingDNAzh.getTextId = function(str) {
        return TypingDNAzh.math.fnv1aHash(str);
      }
    } else {
      // TypingDNAzh is a static class, currently doesn't support actual multiple instances (Singleton implementation)
      return TypingDNAzh.instance;
    }
  }
  