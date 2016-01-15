module.exports = function(config){
    configuration = {
        basePath : './',
        reporters: ['junit', 'coverage'],
        files : [
            'app/assets/js/lib/app-lib.min.js',
            'app/js/**/*.js',
            'test/**/*.js',
        ],
        autoWatch : true,
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'ChromeCanary'],
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
        ],
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
