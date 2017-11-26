window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  A: 65,
  W: 87,
  D: 68,
  S: 83,
  SPACE: 32,
  Left: 37,
  Right: 39,
  Enter: 13,

  isDown: function(keyCode) {
    var down = false;
    if (this._pressed[keyCode] == true)
    {
      down = true;
      this._pressed[keyCode] = false;
    }
    return down;
  },

  onKeydown: function(event) {
    if (event.keyCode != 32)
    {
      this._pressed[event.keyCode] = true;
    }
    else
    {
      if (pauseFlag)
      {
        pauseFlag = false;
      }
      else
      {
        pauseFlag = true;
      }
    }
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};


