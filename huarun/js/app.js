
var loader = new ImageLoader(startAni);
preLoad(loader);

var audioPlayer = new AudioPlayer($('.audio-player'));

audioPlayer.player.on('click', function() {
  if (!audioPlayer.isPlay) {
    audioPlayer.play();
    $(this).css('background-image', 'url(images/play-start.png)');
    $('.play-ipic').show();

  } else {
    audioPlayer.pause();
    $(this).css('background-image', 'url(images/play-pause.png)');
    $('.play-ipic').hide();
  }
});

function preLoad(loader) {
  $('.content').find('[data-url]').each(function(index, item) {
    var src = $(item).attr('data-url');
    loader.add(src);
    src = 'url(' + src + ')';
    $(item).css('background-image', src);
  });

  $('.swiper-slide').find('[data-src]').each(function(index, item) {
    var src = $(item).attr('data-src');
    loader.add(src);
    $(item).attr('src', src)
  });
  loader.load();
}

function startAni() {
  var mySwiper = new Swiper('.swiper-container', {
    preventClicksPropagation: true,
    direction : 'vertical',
    onSlideChangeEnd: slideChangeEnd
  })

  $('.loader').removeClass('loader-ani');
  $('.loading-wrap').hide();
  setTimeout(function() {
    $('.start').addClass('start-ani');
  }, 500);
  $('.start-wrap').on('webkitAnimationEnd', function() {
    $(this).hide();
    addAni(0);
    setTimeout(function() {
      $('.audio-player').show();
      audioPlayer.play();
    }, 1000)
  });
}

function slideChangeEnd(swiper){
  addAni(swiper.activeIndex);
  removeAni(swiper.previousIndex);
  if (swiper.previousIndex === 0) {
      $('.arrow').hide();
      $('.arrow').removeClass('arrow-ani');
  }
}

function addAni(index) {
  var curSlider = $('.swiper-slide')[index];
  aniEles = $(curSlider).find('[data-ani]');
  aniEles.forEach(function(item, key) {
    var className = $(item).attr('data-ani');
    $(item).addClass(className);
  });
  if (index === 0){
    $('.sub-ani').on('webkitAnimationEnd', function() {
      $('.arrow').show();
      $('.arrow').addClass('arrow-ani');
    });
  }
}

function removeAni(index) {
  var curSlider = $('.swiper-slide')[index];
  aniEles = $(curSlider).find('[data-ani]');
  
  aniEles.forEach(function(item, key) {
    var className = $(item).attr('data-ani');
    $(item).removeClass(className);
  });
}
