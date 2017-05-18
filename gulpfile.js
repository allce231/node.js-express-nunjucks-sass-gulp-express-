// gulpfile.js
var gulp = require('gulp');
var server = require('gulp-express');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');

var argv = require('minimist')(process.argv.slice(2));
var env = argv.e; //gulp server -e build  -e后面的值

// 将.scss/.sass文件实时转变为.css文件
gulp.task('styles', function() {
    return gulp.src('public/scss/**/*.scss')
        .pipe(gulpif(env!='build', sourcemaps.init()))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulpif(env!='build', sourcemaps.write()))
        // 去掉css注释
        //.pipe(stripCssComments())
        // auto prefix
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        // css格式化、美化（因为有f2ehint，故在此不再做语法等的检查与修复）

        // 将编译后的.css文件存放在.scss文件所在目录下
        .pipe(gulp.dest(function(file) {
            return './public/css/';
        }))
        // 编译成功后的提示（频繁提示会有点烦人，可将successNotify设置为：false关闭掉）
        .pipe(notify(function(file) {
            return 'scss/sass编译成功！';
        }));
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['./bin/www']);

    // Restart the server when file changes
    gulp.watch(['views/**/*.html'], server.notify);
    gulp.watch(['public/scss/**/*.scss'], ['styles', server.notify]);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]);

    gulp.watch(['public/js/**/*.js'], ['jshint']);
    gulp.watch(['public/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
    gulp.watch(['public/css/**/*.css'], server.notify);
});

gulp.task('build',['styles']);
