const  gulp=require('gulp');  //引用gulp
const connect = require('gulp-connect');
const htmlmin = require('gulp-htmlmin');  
const uglify = require('gulp-uglify'); //引用压缩Js插件
const  css=require('gulp-clean-css'); //gulp压缩css文件
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const rename = require('gulp-rename'); //引用重命名插件
const runSequence = require('gulp-sequence');
const del = require('del'); //引用gulp删除插件

//path
let path = {
    //其他资源 path
    staticPath: ['src/build/css/*.*'],
    //html patn
    htmlPath: ['src/**/*.html'],
    //sass path
    sassPath: ['src/build/sass/*.scss'],
    //js path
    jsPath: ['src/build/js/*.js'],
    //images path
    imagesPath: ['src/build/img/*.{png,jpg,gif,ico}'],
    // clear path
    clean: ['./dist/**/*.*']
}


// default 默认执行任务
gulp.task('default',cb => {
    runSequence(
        'clean', // 第一步：清理目标目录
        'dest', // 第二步：打包
        'watch', // 第三步：监控
        cb
    );
});


//Clean target
gulp.task('clean', function(){
    del(path.clean).then(function(){
        console.log('Deleted files and folders:\n' + JSON.stringify(path));
    });
});

//拷贝静态资源文件
gulp.task('file',() => {
    //获取文件
    gulp.src(path.staticPath)
        //让文件流走向下个环节
        .pipe(gulp.dest('dist/build'))
})
//当文件修改时自动同步
gulp.task('watchFile',() => {gulp.watch(path.staticPath,['file']);})

//压缩同步html
gulp.task('html',() => {
    gulp.src(path.htmlPath)
        //html压缩
        .pipe(htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest('dist/'));
});
//当html修改时自动同步
gulp.task('watchHtml',() => {gulp.watch(path.htmlPath,['html']);});


//让sass转换为css
gulp.task('sass',() => {
    gulp.src(path.sassPath)
    //scss转换成css，并设置css转换格式
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('src/build/css'));
});
//当scss文件修改时自动转译同步
gulp.task('watchSass',() => {gulp.watch(path.sassPath,['sass']);});

//压缩css文件
gulp.task('css',function () {
  return gulp.src('./src/public/sass/*.css')
      .pipe(css())
      .pipe(gulp.dest('./src/public/sass'))
});

//转译压缩js
gulp.task('babel',() => {
    gulp.src(path.jsPath)
        //jsEs5转译
        .pipe(babel({
            presets: ['env']
        }))
        //js压缩
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('dist/build/js'));
});
//当js文件被修改的时候自动转译同步
gulp.task('watchBabel',() => {gulp.watch(path.jsPath,['babel']);});


//图片压缩
gulp.task('imagemin', function () {
    gulp.src(path.imagesPath)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{removeViewBox: false}], //不要移除svg的viewbox属性
            use: [pngquant({optimizationLevel: 4})] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest('dist/build/img'));
});
//当图片修改的时候自动压缩同步
gulp.task('watchImagemin',() => {gulp.watch(path.imagesPath,['imagemin']);});


// 打包构建所有的文件
gulp.task('dest',cb => {runSequence(['file','html','sass','babel','imagemin'],cb)});
// 自动转译同步所有的文件
gulp.task('watch',cb => {runSequence(['watchFile','watchHtml','watchSass','watchBabel','watchImagemin'],'connect','watchRehtml',cb)});


//设置本地服务
gulp.task('connect',() => {
    connect.server({
        root: 'src',
        host: '192.168.2.15',
        livereload: true,
        port: 8888
    });
});
//跟新本地文件同步到浏览器
gulp.task('rehtml',() => {
    gulp.src('src/**/*.*')
        .pipe(connect.reload());
});
//本地跟新文件自动同步到浏览器
gulp.task('watchRehtml',() => {gulp.watch(['src/**/*.*'], ['rehtml']);});