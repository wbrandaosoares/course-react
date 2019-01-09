'use strict';

var gulp			= require('gulp'),
    sass			= require('gulp-sass'),
	plumber			= require('gulp-plumber'),
    sourcemaps		= require('gulp-sourcemaps'),
	uglify			= require('gulp-uglify-es').default,
	cleancss		= require('gulp-clean-css'),
	autoprefixer	= require('gulp-autoprefixer'),
	named			= require('vinyl-named'),
	webpack			= require('webpack'),
	webpackStream	= require('webpack-stream');

// Set the browser that you want to support
const SUPPORTED_BROWSERS = [
	">= 0.35%",
	"not dead",
	"iOS >= 11",
	"Firefox >= 60",
	"Safari >= 11",
	"Android >= 4.4",
	"Opera >= 50"
];

gulp.task('build-js', gulp.series(function() {
	return gulp.src(['js/**/*.js', 'js/**/*.jsx'])
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(named())
		.pipe(webpackStream({
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.(js|jsx)$/,
						exclude: /node_modules/,
						use: {
							loader: "babel-loader",
							options: {
								presets: [
									['@babel/preset-env', {
										targets: {
											browsers: SUPPORTED_BROWSERS
										}
									}], ["@babel/react", {
										targets: {
											browsers: SUPPORTED_BROWSERS
										}
									}]
								]
							}
						}
					}
				]
			}
		}))
		.pipe(sourcemaps.init({largeFile: true}))
		.pipe(uglify()) 
		.pipe(sourcemaps.write('../../maps'))
		.pipe(gulp.dest('../public/js/pages'));
}));

gulp.task('build-css', gulp.series(function() {
	return gulp.src('scss/**/*.scss')
		.pipe(plumber({
			handleError: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sourcemaps.init({largeFile: true}))  // Process the original sources
		.pipe(sass())
		.pipe(autoprefixer({browsers: SUPPORTED_BROWSERS}))
		.pipe(cleancss({log:false}))
		.pipe(sourcemaps.write('../../maps')) // Add the map to modified source.
		.pipe(gulp.dest('../public/css/pages'));
}));

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', gulp.series(function() {
	gulp.watch('js/**/*.js', gulp.parallel(['build-js']));
	gulp.watch('scss/**/*.scss', gulp.parallel(['build-css']));
}));

// define the default task and add the watch task to it
gulp.task('default', gulp.series(['watch']));

