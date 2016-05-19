
function Tab(ele) {
	this.oParent = document.getElementById(ele);
	this.aInput = this.oParent.getElementsByTagName('input');
	this.aDiv = this.oParent.getElementsByTagName('div');
}

Tab.prototype.init = function() {
	var This = this, len = this.aInput.length;
	for (var i = 0; i < len; i++) {
		this.aInput[i].index = i;
		this.aInput[i].onclick = function() {
			This.change(this);
		};
	}
}

Tab.prototype.change = function(obj) {
	var len = this.aInput.length;
	for (var i = 0; i < len; i++) {
		this.aInput[i].className = '';
		this.aDiv[i].style.display = 'none';
	}
	obj.className = 'active';
	this.aDiv[obj.index].style.display = 'block';
}