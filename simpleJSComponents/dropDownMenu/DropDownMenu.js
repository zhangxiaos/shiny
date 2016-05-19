
function DropDown(id) {
	this.dd    = document.getElementById(id);
	this.main  = this.dd.querySelector('.main-text');
	this.list  = this.dd.querySelector('.dropdown-list');
	this.dds   = [].slice.call(document.querySelectorAll('.dropdown-wrap'));
	this.value = this.main.innerHTML;

	this.init();
}

DropDown.prototype.init = function() {
	var that = this;
	var dd = this.dd;

	this.dd.addEventListener('click', function(e){
		that.dds.forEach(function(item){
			if (item == dd) return;
			item.classList.contains('active') && item.classList.remove('active');
		});
		that.dd.classList.toggle('active');
		that.setValue(e);
		e.stopPropagation();
	}, false);

	document.addEventListener('click', function(){
		dd.classList.contains('active') && dd.classList.remove('active');
	}, false);

}

DropDown.prototype.setValue = function(e) {
	var e = e || window.event;
	var target = e.target || e.srcElement;

	if (target.tagName.toLowerCase() != 'li') return;
	this.main.innerHTML = target.innerHTML;
	this.value = target.innerHTML;
}

DropDown.prototype.getValue = function () {
    return this.value;
}