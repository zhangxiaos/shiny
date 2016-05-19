/*
 * 预加载图片
 *
 */
function ImageLoader(cb) {
	this.images = [];
	this.cb = cb;
	this.counter = {
		success: 0,
		failed: 0
	};
	this.start = 0;
	this.complete = false;
	this.percentNode = document.querySelector(".loading-wrap .percent");
};

ImageLoader.prototype = {
	constructor: ImageLoader,
	add: function(url){
	  this.images.push(url);
	  return this;
	},
	notify: function(key){
	  this.counter[key]++;
	  var counter = this.counter;
	  var size = this.images.length;
	  var loaded = counter.success + counter.failed;
	  var percent = Math.min(((loaded / size) * 100).toFixed(0), 100);
	  var percentNode = this.percentNode;
	  var cb = this.cb;

	  if(percentNode){
	    percentNode.innerHTML = (percent + "%");
	  }
	  ImageLoader.complete = (loaded >= size);

	  if (ImageLoader.complete) {
	    setTimeout(function() {
	      cb(); 
	    }, 1000)
	  }
	},
	load: function(){
	  var imgs = this.images;
	  var size = imgs.length;
	  var _this = this;
	  ImageLoader.startTime = (new Date().getTime());
	  imgs.forEach(function(item) {
	    ImageLoader.loader(_this, item);
	  });
	}
};

ImageLoader.loader = function(imageLoader, url){
	var img = new Image();
	img.src = url;

	img.onload = function(){
		imageLoader.notify("success");
		img = null;
	};

	img.onerror = function(){
		imageLoader.notify("failed");
		img = null;
	}
};
