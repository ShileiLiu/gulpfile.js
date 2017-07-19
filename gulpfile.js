//要监听的项目
let project = [
'Admin',
'Index',
'public',
];
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var plumber = require('gulp-plumber');
let imagemin = require('gulp-imagemin');
let concat = require('gulp-concat');
let browserSync = require('browser-sync').create();
let ts = require('gulp-typescript');
var webpack = require("webpack");
var htmlMin = require('gulp-htmlmin');
var webpackConfig = require("./webpack.config.js");
var myConfig = Object.create(webpackConfig);
var contentIncluder = require('gulp-content-includer');
gulp.task('ts',function(){//TypeScript处理模块，不用可注释
	for(let i = 0;i<project.length;i++){
		gulp.src(`./build/${project[i]}/js/ts/*.ts`)
		.pipe(plumber())
		.pipe(ts())
		.pipe(gulp.dest(`./build/${project[i]}/js`));
	}
})
gulp.task("webpack", function(callback) {//webpack模块
	var myConfig = Object.create(webpackConfig);
	return webpack(myConfig, function(err, stats) {
		callback();
	});
});
gulp.task('concat',function() {//HTML合并压缩模块
	var options = {
		removeComments: true,//清除HTML注释
//      collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
	}
	for(let i = 0;i<project.length;i++){
	    gulp.src(`./build/${project[i]}/html/*.html`)
	    .pipe(plumber())
	    .pipe(contentIncluder({
	        includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
	    }))
	    .pipe(htmlMin(options))
	    .pipe(gulp.dest(`./src/${project[i]}/html`));
    }
    gulp.src(`./build/Index/html/anli/*.html`)
    .pipe(plumber())
    .pipe(contentIncluder({
        includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
    }))
    .pipe(htmlMin(options))
    .pipe(gulp.dest(`./src/Index/html/anli`));
});
//图片压缩
//gulp.task('image-min',function(){
//	gulp.src('./build/Public/images/*.{jpg,png,gif}')
//	.pipe(imagemin({
//          optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//          progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//          interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//          multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
//      }))
//	.pipe(gulp.dest('./src/Public/images'))
//});
//启动配置服务器
gulp.task('serve', function() {//服务监听
    gulp.watch(`./build/components/*.vue`, ['webpack']);
    for(let i = 0;i<project.length;i++){
    	gulp.watch(`./build/${project[i]}/css/*.css`, ['webpack']);
  		gulp.watch(`./build/${project[i]}/js/ts/*.ts`,["ts"]);
  		gulp.watch(`./build/${project[i]}/js/*.js`, ['webpack']);
    	gulp.watch(`./build/${project[i]}/components/*/*.vue`, ['webpack']);
     	gulp.watch(`./build/${project[i]}/html/*.html`, ['concat']);      	
     	gulp.watch(`./build/${project[i]}/html/anli/*.html`, ['concat']);
    }
});
gulp.task('default',['serve']);