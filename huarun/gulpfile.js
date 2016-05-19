var gulp    = require('gulp'),                 //基础库
    imagemin = require('gulp-imagemin'),       //图片压缩
    minifycss = require('gulp-minify-css'),    //css压缩
    minifyhtml = require('gulp-minify-html'),  //html压缩
    uglify  = require('gulp-uglify'),          //js压缩
    rename = require('gulp-rename'),           //重命名
    concat  = require('gulp-concat');         //合并文件

// HTML处理
gulp.task('html', function() {
    var htmlSrc = './index.html',
        htmlDst = './dist/';

    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
});

// 样式处理
gulp.task('css', function () {
    var cssSrc = './css/*.css',
        cssDst = './dist/css';

    gulp.src(cssSrc)
        .pipe(concat('main.css'))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest(cssDst));
});

// 图片处理
gulp.task('images', function(){
    var imgSrc = './images/**/*',
        imgDst = './dist/images';

    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
})

//js处理
gulp.task('js', function () {
    var jsDst ='./dist/js';

    gulp.src(['js/lib/zepto.min.js', 'js/lib/swiper-3.3.1.jquery.min.js', 'js/app/ImageLoader.js', 'js/app/AudioPlayer.js', 'js/app.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(jsDst));
});

gulp.task('default', function(){
    gulp.start('html','css','images','js');
});


