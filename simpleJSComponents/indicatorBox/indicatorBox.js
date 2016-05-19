function ProgressBar(container) {
    this.container = document.getElementById('container');
    this.init();
}

ProgressBar.prototype.init = function () {
    this.container.innerHTML = '<div class="bar-container"><div class="bar" style="width:60%"></div><div class="indicator-box" style="left:60%"><div class="indicator-value">60%</div><div class="indicator"></div></div></div>';
    this.barContainer = this.container.querySelector('.bar-container');
    this.bar = this.container.querySelector('.bar');
    this.indicatorBox = this.container.querySelector('.indicator-box');
    this.indicatorValue = this.container.querySelector('.indicator-value');
    this.BAR_CAP = this.barContainer.offsetWidth;
    this.maxX = this.BAR_CAP;
    this.minX = 0;
    this.enableDrag();
}

ProgressBar.prototype.enableDrag = function () {
    var that = this;
    
    this.indicatorBox.addEventListener('mousedown', function (e) {
      
        var downX = e.clientX - that.indicatorBox.offsetLeft;
       
        document.addEventListener('mousemove', move_, false);

        function move_(e) {
            var newX = e.clientX - downX  + that.indicatorBox.offsetWidth / 2;
            // var newX = e.clientX - downX;
            that.barMove(that.constrainX(newX));
        };

        document.addEventListener('mouseup', function up_() {
            document.removeEventListener('mousemove', move_, false);
            document.removeEventListener('mouseup', up_, false);
        }, false);

        e.preventDefault();
    }, false);
}

ProgressBar.prototype.constrainX = function (x) {
    if(x < this.minX){
      x = this.minX;
    }else if(x > this.maxX){
      x = this.maxX;
    }
    return x;
}

ProgressBar.prototype.barMove = function (x) {
    var percentage = (x / this.BAR_CAP * 100).toFixed(1);
    this.currentValue = percentage;
    this.indicatorBox.style.left = x  + 'px';
    this.bar.style.width = percentage + '%';
    this.indicatorValue.innerHTML = percentage + '%';
}

ProgressBar.prototype.set = function (x) {
    x = this.constrainX(x * this.BAR_CAP);
    this.barMove(x);
}

ProgressBar.prototype.setMinX = function (x) {
    this.minX = x * this.BAR_CAP;
}

ProgressBar.prototype.setMaxX = function (x) {
    this.maxX = x * this.BAR_CAP;
}