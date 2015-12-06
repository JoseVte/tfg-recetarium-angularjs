// Initialise
var gulp   = require('gulp'),
gutil      = require('gulp-util'),
sass       = require('gulp-sass'),
minify     = require('gulp-minify-css'),
autoprefix = require('gulp-autoprefixer'),
notify     = require('gulp-notify'),
concat     = require('gulp-concat'),
rename     = require('gulp-rename'),
uglify     = require('gulp-uglify'),
del        = require('del');

// Paths variables
var paths = {
    'src': {
        'sass': 'app/sass',
        'css': 'app/css',
        'js': 'app/js',
        'bower': 'app/bower'
    },
    'dest': {
        'assets': 'app/assets',
        'css': 'app/assets/css',
        'js': 'app/assets/js',
        'fonts': 'app/assets/fonts',
        'jsLib': 'app/assets/js/lib'
    }
};

// SCSS Task
gulp.task('sass', function() {
    return gulp.src([
        paths.src.sass + '/**/*.scss'
    ])
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefix('last 10 version'))
    .pipe(concat('app.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify())
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
    //.pipe(uglify())
    .pipe(gulp.dest(paths.dest.js))
    .pipe(notify({ message: 'JS minified' }));
});

// JS bower
gulp.task('lib-js', function() {
    return gulp.src([
        paths.src.bower + '/jquery/dist/jquery.min.js',
        paths.src.bower + '/angular/angular.min.js',
        paths.src.bower + '/angular-route/angular-route.min.js',
        paths.src.bower + '/angular-resource/angular-resource.min.js',
        paths.src.bower + '/angular-animate/angular-animate.min.js',
        paths.src.bower + '/angular-aria/angular-aria.min.js',
        paths.src.bower + '/angular-material/angular-material.min.js',
        paths.src.bower + '/angular-ui-router/release/angular-ui-router.min.js'
    ])
    .pipe(gulp.dest(paths.dest.jsLib))
    .pipe(notify({ message: 'Library JS minified: <%= file.relative %>' }));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(paths.src.bower + '/font-awesome/fonts/**.*') 
    .pipe(gulp.dest(paths.dest.fonts));
});

// Watch folders
gulp.task('watch', function() {
    gulp.watch(paths.src.sass + '/**/*.scss', ['sass']);
    gulp.watch(paths.src.js + '/**/*.js', ['js']);
});

// Clean public folder Task
gulp.task('clean', function() {
    return del([paths.dest.assets + '/**/*.*']);
});

// Run Default
gulp.task('default', [
    'clean',
    'sass',
    'js',
    'lib-js',
    'fonts',
    'watch'
]);
