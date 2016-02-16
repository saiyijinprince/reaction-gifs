/**
 * Created by akabeera on 2/10/2016.
 */
module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        files: [
            'dist.dev/bower_components/jquery.js',
            'dist.dev/bower_components/lodash.js',
            'dist.dev/bower_components/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'dist.dev/bower_components/moment.js',
            'dist.dev/bower_components/thief.js',
            'dist.dev/bower_components/thief-angular.js',
            'dist.dev/components/**/*.js',
            'dist.dev/app.js'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        //reporters: ['dots'],

        // web server port
        //port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher'
        ]
    });
};