define(function() {
  var activate = DisplayObject.prototype._activate;
  DisplayObject.prototype._activate = function(stage) {
    if (stage.marker) {
      this.marker = stage.marker;
    }
    activate.call(this, stage);
  };

  var composeRenderMessage = DisplayObject.prototype.composeRenderMessage;
  DisplayObject.prototype.composeRenderMessage = function(message) {
    var message = composeRenderMessage.call(this, message);
    if (this.marker) {
      message.marker = this.marker;
    }
    return message;
  };

  stage.addMessageMarker = function(value) {
    stage.marker = value;
  };

  stage.removeMessageMarker = function() {
    stage.marker = void 0;
  };
});
