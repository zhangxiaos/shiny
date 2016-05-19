/*
 * 音乐控制
 *
 */
function AudioPlayer(player) {
    this.isPlay = false;
    this.source = document.querySelector('.audio-source');
    this.player = player;
}
AudioPlayer.prototype = {
    constructor: AudioPlayer,
    play: function() {
        if (!this.isPlay) {
            this.source.play(); 
            this.isPlay = true;
        }
    },
    pause: function() {
      if (this.isPlay) {
          this.source.pause(); 
          this.isPlay = false;
      }
    }
};
