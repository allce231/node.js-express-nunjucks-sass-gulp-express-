// gulpfile.js
var gulp = require('gulp');
var server = require('gulp-express');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

var argv = require('minimist')(process.argv.slice(2));
var env = argv.e; //gulp server -e build  -e后面的值

// 将.scss/.sass文件实时转变为.css文件
gulp.task('styles', function() {
    return gulp.src('static/scss/**/*.scss')
        .pipe(gulpif(env!='build', sourcemaps.init()))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulpif(env!='build', sourcemaps.write()))

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

gulp.task('jshint',function(){
    return gulp.src('static/js/**/*.js')
        .pipe(gulpif(env!='build', sourcemaps.init()))
        .pipe(uglify())
        .pipe(gulpif(env!='build', sourcemaps.write()))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('./public/js/'))
        .pipe(notify(function(file) {
            return 'js编译成功！';
        }));
});

gulp.task('img',function(){
    return gulp.src('static/images/**/*')
        .pipe(gulp.dest('./public/images/'))
        .pipe(notify(function(file) {
            return 'img copy done！';
        }));
});

gulp.task("clean", function(){
    return gulp.src('./public**')
        .pipe(clean());
})


gulp.task('server', function () {
    //启动node服务
    server.run(['./bin/www']);

    //监听文件修改
    gulp.watch(['static/scss/**/*.scss'], ['styles']);
    gulp.watch(['static/js/**/*.js'], ['jshint']);
    gulp.watch(['static/images/**/*'], ['img']);

    // 监听文件修改并刷新浏览器
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
    gulp.watch(['views/**/*.html'], server.notify);
    gulp.watch(['public/images/**/*'], server.notify);
    gulp.watch(['public/css/**/*.css'], server.notify);
    gulp.watch(['public/js/**/*.js'], server.notify);
});

// 发布线上 gulp build -e build   【发布时请关闭编辑器】
// gulp.task('build',['clean'],function(){
//     gulp.start('styles', 'jshint', 'img');
// });
