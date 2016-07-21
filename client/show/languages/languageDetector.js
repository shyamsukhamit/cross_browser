// Generated by CoffeeScript 1.10.0

/*
This test renders to a canvas a whole bunch of words in 36 different
alphabets to test which alphabets the user has installed on their computer.
The words are kept in the 2D array called codes in their UTF-16 format
to ensure that they aren't interpreted before it is time to render them
The 37th string in codes is a single character that we are hoping will
always show up as a cannot be displayed character.
 *
While wether the alphabet can be displayed or not is deteremined by the
operating system, the symbol used to represent cannot be displayed is
deteremined by the browser.  However, it does seem like it is always some
sort of box
 */

(function() {
  var LanguageDector, caf, raf, root, safeParseJSON;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  safeParseJSON = function(s) {
    var error;
    try {
      return JSON.parse(s);
    } catch (error) {
      return false;
    }
  };

  raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

  caf = window.cancelAnimationFrame || window.mozcancelAnimationFrame || window.webkitcancelAnimationFrame || window.ocancelAnimationFrame;

  root.LanguageDector = LanguageDector = (function() {
    function LanguageDector(debug) {
      this.debug = debug;
      this.codes = safeParseJSON("[[76,97,116,105,110], [27721,23383], [1575,1604,1593,1585,1576,1610,1577], [2342,2375,2357,2344,2366,2327,2352,2368], [1050,1080,1088,1080,1083,1080,1094,1072], [2476,2494,2434,2482,2494,32,47,32,2437,2488,2478,2496,2479,2492,2494], [20206,21517], [2583,2625,2608,2606,2625,2582,2624], [43415,43438], [54620,44544], [3108,3142,3122,3137,3095,3137], [2980,2990,3007,2996,3021], [3374,3378,3375,3390,3379,3330], [4121,4156,4116,4154,4121,4140], [3652,3607,3618], [7070,7077,7060,7082,7059], [3221,3240,3277,3240,3233], [2711,2753,2716,2736,2750,2724,2752], [3749,3762,3751], [2825,2852,2893,2837,2867], [4877,4821,4829], [3523,3538,3458,3524,3517], [1344,1377,1397,1400,1409], [6017,6098,6040,6082,6042], [917,955,955,951,957,953,954,972], [6674,6682,6664,6673], [1488,1500,1508,1489,1497,1514], [3926,3964,3921,3851], [4325,4304,4320,4311,4323,4314,4312], [41352,41760], [6190,6179,6185,6189,6179,6191], [11612,11593,11580,11593,11599,11568,11606], [1808,1834,1825,1821,1808], [1931,1960,1928,1964,1920,1960], [5123,5316,5251,5198,5200,5222], [5091,5043,5033]]");
      this.fontSize = 30;
      this.extraHeigth = 100;
      this.height = this.fontSize + this.extraHeigth;
      this.width = 500;
      this.canvas = $("<canvas height='" + this.height + "' width='" + this.width + "'/>").appendTo($('#test_canvases'));
      this.ctx = this.canvas[0].getContext('2d');
      this.results = [];
      this.boxTester = emscript.cwrap('boxTester', 'number', ['array', 'number', 'number']);
    }

    LanguageDector.prototype.testIfBoxes = function(pixels, rows, cols) {
      var B, G, L, R, binaryImage, i, j, ref;
      binaryImage = new Uint8Array(rows * cols);
      for (i = j = 0, ref = rows * cols; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        R = pixels[4 * i + 0];
        G = pixels[4 * i + 1];
        B = pixels[4 * i + 2];
        L = R * 299 / 1000 + G * 587 / 1000 + B * 114 / 1000;
        if (L < 250) {
          binaryImage[i] = 1;
        } else {
          binaryImage[i] = 0;
        }
      }
      return this.boxTester(binaryImage, rows, cols);
    };

    LanguageDector.prototype.begin = function(cb) {
      var tester;
      this.cb = cb;
      this.count = 0;
      tester = (function(_this) {
        return function(index) {
          var c, isBoxes, j, len, pixels, ref, text;
          if (index === _this.codes.length) {
            emscript._free(_this.ptr);
            console.log(_this.results);
            sender.postLangsDetected(_this.results);
            return _this.cb();
          } else {
            text = "";
            ref = _this.codes[index];
            for (j = 0, len = ref.length; j < len; j++) {
              c = ref[j];
              text += String.fromCharCode(c);
            }
            _this.ctx.shadowBlur = 0;
            _this.ctx.shadowColor = "#00FFFFFF";
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, _this.width, _this.height);
            _this.ctx.fillStyle = "black";
            _this.ctx.font = _this.fontSize + "px sans-serif";
            _this.ctx.fillText("" + text, 5, _this.height - _this.extraHeigth / 2.0);
            pixels = _this.ctx.getImageData(0, 0, _this.width, _this.height).data;
            isBoxes = _this.testIfBoxes(pixels, _this.height, _this.width);
            if (_this.debug) {
              _this.ctx.fillStyle = "white";
              _this.ctx.fillRect(0, 0, _this.width, _this.height);
              _this.ctx.fillStyle = "black";
              _this.ctx.fillText(index + " " + text + " Boxes: " + isBoxes, 5, _this.height - _this.extraHeigth / 2.0);
            }
            _this.results.push(isBoxes ? 0 : 1);
            return raf(function() {
              if (_this.debug) {
                console.log(isBoxes + "   index: " + index);
                _this.canvas = $("<canvas height='" + _this.height + "' width='" + _this.width + "'/>").appendTo($('#test_canvases'));
                _this.ctx = _this.canvas[0].getContext('2d');
              }
              return tester(index + 1);
            });
          }
        };
      })(this);
      return raf(function() {
        return tester(0);
      });
    };

    return LanguageDector;

  })();

}).call(this);
