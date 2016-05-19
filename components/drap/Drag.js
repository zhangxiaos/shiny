function Drag(id) {
	this.oDiv = document.getElementById(id);
	
	var _this = this;

	this.oDiv.onmousedown = function(ev) {
		_this.fnDown(ev);
		//将所有的鼠标事件都加到oDiv上，同时还解决了IE文字选中问题，因为文字压根儿得不到鼠标事件。
		if(_this.oDiv.setCapture) {
			_this.oDiv.setCapture();
		}
		return false;
	}	
};

Drag.prototype.fnDown = function(ev) {
	var _this = this;
	var oEvent = window.event || ev;
	this.disX = oEvent.clientX - this.oDiv.offsetLeft;
	this.disY = oEvent.clientY - this.oDiv.offsetTop;

	if(this.oDiv.setCapture) {
		this.oDiv.onmousemove = function(ev) {
			_this.fnMove(ev);
		}
		this.oDiv.onmouseup = function() {
			_this.fnUp();
		}
	} else {
		document.onmousemove = function(ev) {
			_this.fnMove(ev);
		}
		document.onmouseup = function() {
			_this.fnUp();
		}
	}
};

Drag.prototype.fnMove = function(ev) {
	var oEvent = window.event || ev;
	this.l = oEvent.clientX - this.disX;
	this.h = oEvent.clientY - this.disY;

	if(this.l<0) {
		this.l = 0;
	}

	if(this.l>document.documentElement.clientWidth-this.oDiv.offsetWidth) {
		this.l = document.documentElement.clientWidth-this.oDiv.offsetWidth;
	}

	if(this.h<0) {
		this.h = 0;
	}
	
	if(this.h>document.documentElement.clientHeight-this.oDiv.offsetHeight) {
		this.h = document.documentElement.clientHeight-this.oDiv.offsetHeight;
	}

	this.oDiv.style.left = this.l + 'px';
	this.oDiv.style.top = this.h + 'px';
}

Drag.prototype.fnUp = function() {
	this.oDiv.onmousemove = null;
	this.oDiv.onmouseup = null;
	document.onmousemove = null;
	document.onmouseup = null;

	//由于事件捕获一只开着，当鼠标弹起的时候拖动其他地方会导致oDiv移动，因此要在鼠标弹起时清除掉捕获
	if(this.releaseCapture) {
		this.releaseCapture();
	}
}