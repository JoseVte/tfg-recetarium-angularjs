module.exports = function(config){
    configuration = {
        basePath : './',
        reporters: ['junit', 'coverage', 'html'],
        files : [
            '../app/assets/js/lib/app-lib.min.js',
            '../app/js/**/*.js',
            '**/*.js',
        ],
        autoWatch : true,
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-htmlfile-reporter',
        ],
        htmlReporter: {
            outputFile: 'test_out/unit.html',
            pageTitle: 'Unit Tests'
        },
        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        preprocessors: {
            'app/js/**/*.js': ['coverage']
        },
        coverageReporter: {
            dir: 'test_out/coverage/',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'cobertura', subdir: '.', file: 'cobertura.xml' },
            ]
        }
    };
    if(process.env.TRAVIS){
        configuration.browsers = ['Chrome_travis_ci'];
    }
    config.set(configuration);
};
