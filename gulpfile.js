var gulp   = require('gulp'),
gutil      = require('gulp-util'),
sass       = require('gulp-sass'),
cssnano    = require('gulp-cssnano'),
autoprefix = require('gulp-autoprefixer'),
notify     = require('gulp-notify'),
minify     = require('gulp-minify-css'),
concat     = require('gulp-concat'),
rename     = require('gulp-rename'),
uglify     = require('gulp-uglify'),
del        = require('del'),
argv       = require('yargs').argv,
gulpif     = require('gulp-if'),
beautify   = require('gulp-beautify'),
ngAnnotate = require('gulp-ng-annotate'),
jshint     = require('gulp-jshint'),
stylish    = require('jshint-stylish');

// Paths variables
var paths = {
    'src': {
        'sass': 'app/sass',
        'css': 'app/css',
        'js': 'app/js',
        'img': 'app/img',
        'bower': 'app/bower'
    },
    'dest': {
        'assets': 'app/assets',
        'css': 'app/assets/css',
        'js': 'app/assets/js',
        'fonts': 'app/assets/fonts',
        'jsLib': 'app/assets/js/lib',
        'img': 'app/assets/img',
        'icons': 'app/assets/img/icons',
    }
};

// SCSS Task
gulp.task('sass', function() {
    return gulp.src(paths.src.sass + '/app.scss')
    .pipe(sass({ style: 'compressed' })
    .on('error', sass.logError))
    .pipe(autoprefix('last 10 version'))
    .pipe(concat('app.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpif(argv.production, minify({ compatibility: 'ie8' })))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(notify({ message: 'CSS minified' }));
});

// JS Task
gulp.task('js', function() {
    return gulp.src([
        paths.src.js + '/**/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpif(argv.production, ngAnnotate({ single_quotes: true })))
    .on('error', console.log)
    .pipe(gulpif(argv.production, uglify({mangle: false}), beautify({indentSize: 2})))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .on('error', console.log)
    .pipe(gulp.dest(paths.dest.js))
    .pipe(notify({ message: 'JS minified' }));
});

// JS bower
gulp.task('lib-js', function() {
    return gulp.src([
        paths.src.bower + '/jquery/dist/jquery.min.js',
        paths.src.bower + '/fancybox/source/jquery.fancybox.pack.js',
        paths.src.bower + '/angular/angular.min.js',
        paths.src.bower + '/moment/min/moment-with-locales.min.js',
        paths.src.bower + '/textAngular/dist/textAngular-rangy.min.js',
        paths.src.bower + '/textAngular/dist/textAngular-sanitize.min.js',
        paths.src.bower + '/textAngular/dist/textAngular.min.js',
        paths.src.bower + '/pnotify/dist/pnotify.js',
        paths.src.bower + '/pnotify/dist/pnotify.animate.js',
        paths.src.bower + '/pnotify/dist/pnotify.buttons.js',
        paths.src.bower + '/pnotify/dist/pnotify.callbacks.js',
        paths.src.bower + '/pnotify/dist/pnotify.confirm.js',
        paths.src.bower + '/pnotify/dist/pnotify.desktop.js',
        paths.src.bower + '/pnotify/dist/pnotify.history.js',
        paths.src.bower + '/pnotify/dist/pnotify.mobile.js',
        paths.src.bower + '/pnotify/dist/pnotify.nonblock.js',
        paths.src.bower + '/angular-environment/dist/angular-environment.min.js',
        paths.src.bower + '/angular-route/angular-route.min.js',
        paths.src.bower + '/angular-resource/angular-resource.min.js',
        paths.src.bower + '/angular-animate/angular-animate.min.js',
        paths.src.bower + '/angular-aria/angular-aria.min.js',
        paths.src.bower + '/angular-material/angular-material.min.js',
        paths.src.bower + '/angular-messages/angular-messages.min.js',
        paths.src.bower + '/angular-ui-router/release/angular-ui-router.min.js',
        paths.src.bower + '/angular-mocks/angular-mocks.js',
    ])
    .pipe(concat('app-lib.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(ngAnnotate({single_quotes: true}))
    .on("error", console.log)
    .pipe(gulpif(argv.production, uglify({mangle: false}), beautify({indentSize: 2})))
    .on("error", console.log)
    .pipe(gulp.dest(paths.dest.jsLib))
    .pipe(notify({ message: 'JS lib minified' }));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(paths.src.bower + '/material-design-icons/iconfont/*.*')
    .pipe(gulp.dest(paths.dest.fonts));
});

// Imagen
gulp.task('img', function() {
    gulp.src([
        paths.src.img + '/**/*.*'
    ])
    .pipe(gulp.dest(paths.dest.img));

    gulp.src([
        paths.src.bower + '/fancybox/source/**.png',
        paths.src.bower + '/fancybox/source/**.gif'
    ])
    .pipe(gulp.dest(paths.dest.css));
});

// Watch folders
gulp.task('watch', function() {
    gulp.watch(paths.src.sass + '/**/*.scss', ['sass']);
    gulp.watch(paths.src.js + '/**/*.js', ['js']);
});

// Clean public folder Task
gulp.task('clean', function() {
    return del([
        paths.dest.assets + '/**/*.*',
        paths.dest.assets + '/**/**/*.*'
    ]);
});

// Run Default
gulp.task('default', [
    'clean',
    'sass',
    'js',
    'lib-js',
    'fonts',
    'img',
    'watch'
]);
