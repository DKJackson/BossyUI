var gulp = require('gulp-help')(require('gulp')),
	shell = require('gulp-shell'),
	jshint = require('gulp-jshint'),
	install = require('gulp-install'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	sequence = require('run-sequence'),
	karma = require('karma').server,
	compass = require('gulp-compass'),
	nodemon = require('gulp-nodemon'),
	config = require('./gulp_config.json');

gulp.task('build-sandbox', 'Runs build and adds BossyUI libs to Sandbox', function(callback) {

	sequence(
		'sandbox-install',
		'build-js',
		'build-sass',
		'sandbox-copy-js',
		'sandbox-copy-css',
		'sandbox-copy-templates',
		'sandbox-copy-graphics',
		callback);
});

gulp.task('sandbox-install', false, function() {

	return gulp
		.src('sites/sandbox/bower.json')
		.pipe(install());
});

gulp.task('sandbox-copy-js', false, function() {

	return gulp
		.src(['dist/js/bossy.all.js'])
		.pipe(gulp.dest('sites/sandbox/js'));
});

gulp.task('sandbox-copy-templates', false, function() {
	return gulp
		.src(['src/directives/templates/*.html'])
		.pipe(gulp.dest('sites/sandbox'));
});

gulp.task('sandbox-copy-css', false, function() {

	return gulp
		.src(['dist/css/bossy.css'])
		.pipe(gulp.dest('sites/sandbox/css'));
});

gulp.task('sandbox-copy-graphics', false, function() {
	return gulp
		.src(['src/graphics/*.svg'])
		.pipe(gulp.dest('sites/sandbox/graphics'));
});

gulp.task('build-js', 'Runs build for all lib Javascript', function() {

	return gulp
		.src(config.paths.js.src)
		.pipe(sourcemaps.init())
		.pipe(concat('bossy.all.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.paths.js.dist));
});

gulp.task('build-sass', 'Runs build for all lib Sass/Css', function() {

	return gulp
		.src(config.paths.scss.src)
		.pipe(compass({
			style: 'nested',
			sass: 'src/scss',
			css: config.paths.css.dist
		}));
});

gulp.task('run-tests', 'Runs all Karma tests', function() {

	karma.start({
		configFile: __dirname + '/test/karma.conf.js'
	});
});

gulp.task('serve-sandbox', 'Runs development environment server', ['build-sandbox'], function() {
	gulp.watch(config.paths.scss.src, ['build-sass', 'sandbox-copy-css']);
	gulp.watch(config.paths.js.src, ['build-js', 'sandbox-copy-js']);
	gulp.watch(['src/directives/templates/*.html'], ['sandbox-copy-templates']);

	return gulp.src('')
		.pipe(shell([
			'node sites/sandbox/server.js'
		]));
});

gulp.task('jshint', 'Runs JSHint on JS lib', function() {

	return gulp
		.src(config.paths.js.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('watch', 'Watcher task', function() {
	gulp.watch(config.paths.scss.src, ['build-sass']);
	gulp.watch(config.paths.js.src, ['build-js']);
});

gulp.task('install', 'Runs npm and bower installs', function() {
	return gulp
		.src(['./bower.json', './package.json'])
		.pipe(install());
});
