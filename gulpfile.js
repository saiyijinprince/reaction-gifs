// Gulpfile taken from this article: http://paislee.io/a-healthy-gulp-setup-for-angularjs-projects/

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var bowerFiles = require('main-bower-files');
var Server = require('karma').Server;

// TODO: Figure out a better way to deal with CSS
// === PATH STRINGS ======
var paths = {
    typescript: 'app/**/*.ts',
    unitTests: 'app/**/*.spec.ts',
    scriptsDir: '.tmpjs/',
    scripts: '.tmpjs/**/*.js',
    styles: [
        './app/**/*.css',
        './app/**/*.scss',
        'bower_components/thief/css/thief.css',
        'bower_components/thief-angular/css/thief-quartz-standard.css',
        'bower_components/slickgrid/css/slick.grid.css'],
    images: ['./images/**/*', 'bower_components/thief/img/*.*', 'bower_components/thief-angular/img/*.*'],
    index: './app/index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    scriptsDevServer: 'devServer/**/*.js',
    mainModuleName: 'myTestTypeScriptApp',
    dev: {
        dist: './dist.dev',
        images: './dist.dev/img',
        vendorScripts: 'dist.dev/bower_components',
        css: './dist.dev/css'
    },
    prod: {
        dist: './dist.prod',
        images: './dist.prod/img',
        scripts: './dist.prod/scripts',
        vendorScripts: 'dist.prod/bower_components',
        css: './dist.prod/css'
    }
};

// === PIPE SEGMENTS =====

var pipes = {};

// === 0. Supporting functions =====

// Call this function if you want to prevent gulp from crashing on error. E.g. .on('error', pipes.onError)
// This is useful to maintain gulp watch task even if one of the watchers crashed.
pipes.onError = function (err) {
    console.log(err);
    this.emit('end');
};

// Removes spec(test) files from the stream
pipes.withoutSpecFiles = function () {
    return plugins.filter(['**/*.*', '!**/*.spec.ts']);
};

// === 1. Ordering scripts =====

// Specify the order in which vendor scripts should be loaded.
// Note that thief and thief-angular require jquery, angular and moment to be loaded beforehand.
pipes.orderedVendorScripts = function () {
    return plugins.order([
        '*jquery.js',
        'angular.js',
        '*angular-*.js',
        '*lodash.js',
        '*moment.js',
        '*.*']);
};

pipes.orderedAppScripts = function () {
    return plugins.angularFilesort();
};

// cdnizer will replace the local files with the files hosted on the local CDN server
// this is typically used for production deployment
// TODO: This function needs reworking. It's too long and fragile. If any of the packages change location
// or if the version isn't supported, we'll error out.
pipes.cdnized = function () {

    var pathToMinifiedFile              = '${defaultCDNBase}/${package}/${versionFull}/${filenameMin}';
    var pathToMinifiedFileInJsSubdir    = '${defaultCDNBase}/${package}/${versionFull}/js/${filenameMin}';
    var pathToVanillaFile               = '${defaultCDNBase}/${package}/${versionFull}/${filename}';

    return plugins.cdnizer({
        defaultCDNBase: "//cdn.factset.com",
        defaultCDN: pathToMinifiedFile,
        files: [
            // If file is on the default CDN, it will replaced with //cdn.factset.com/package/cdn filename

            // JS
            {
                file: 'bower_components/jquery.js',
                package: 'jquery',
                test: 'window.jQuery'
            },
            {
                file: 'bower_components/lodash.js',
                package: 'lodash',
                test: 'window._'
            },
            {
                file: 'bower_components/thief.js',
                package: 'thief',
                cdn: pathToMinifiedFileInJsSubdir,
                test: 'window.thief'
            },
            {
                file: 'bower_components/angular.js',
                package: 'angular',
                test: 'window.angular'
            },
            {
                file: 'bower_components/angular-animate.js',
                package: 'angular-animate',
                // TODO: how do I test angular-animate
                //test: 'window.angular'
            },
            {
                file: 'bower_components/angular-ui-router.js',
                package: 'angular-ui-router',
                cdn: '${defaultCDNBase}/${package}/${versionFull}/release/${filenameMin}'
                // TODO: how do I test angular-ui-router
                //test: 'window.angular.ui-router'
            },
            {
                file: 'bower_components/moment.js',
                package: 'moment',
                cdn: pathToVanillaFile,
                test: 'window.moment'
            },
            {
                file: 'bower_components/thief-angular.js',
                package: 'thief-angular',
                cdn: pathToMinifiedFileInJsSubdir
            },
            {
                file: 'bower_components/slickgrid-angular.js',
                package: 'slickgrid-angular',
                cdn: '${defaultCDNBase}/${package}/v${versionFull}/${filenameMin}'
            },
            // cdnizer swaps 'bundle' and 'min', so use the hardcoded name
            {
                file: 'bower_components/slickgrid.bundle.js',
                package: 'slickgrid',
                cdn: '${defaultCDNBase}/${package}/${versionFull}/js/slickgrid.bundle.min.js'
            },
            {
                file: 'bower_components/underscore.js',
                package: 'underscore',
                cdn: pathToVanillaFile
            },

            // CSS

            {
                file: 'css/thief.css',
                package: 'thief',
                cdn: '${defaultCDNBase}/${package}/${versionFull}/css/${filenameMin}'
            },
            // can't use ${filenameMin} here. cdnizer removes -standard at the end :)
            {
                file: 'css/thief-quartz-standard.css',
                package: 'thief-angular',
                cdn: '${defaultCDNBase}/${package}/${versionFull}/css/thief-quartz-standard.min.css'
            },
            // cdnizer swaps 'grid' and 'min', so use the hardcoded name
            {
                file: 'css/slick.grid.min.css',
                package: 'slickgrid',
                cdn: '${defaultCDNBase}/${package}/${versionFull}/css/${filename}'
            }
        ]
    });
};

// === 2. Renaming files ======

// Returns a stream that has renamed arbitrary files to have .min before the existing file extension.
pipes.minifiedFileName = function () {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

// === 3. Building application scripts =====

// Validate app TypeScript
pipes.validatedTypeScript = function (includeUnitTests) {

    return gulp.src(paths.typescript)
        // Remove unit test files
        .pipe(includeUnitTests ? plugins.nop() : pipes.withoutSpecFiles() )
        // uncomment plugins.print if you ever want to see the current content of the strem. Useful for debugging.
        .pipe(plugins.tslint())
        .pipe(plugins.tslint.report("prose", {
            summarizeFailureOutput: true
        }))
        .on('error', pipes.onError);
};

// For development, validated scripts are simply moved to the dev environment. Returns a stream of the newly moved files
pipes.builtAppScriptsDev = function (includeUnitTests) {
    var filter = plugins.filter('**/*.js');

    return pipes.validatedTypeScript(includeUnitTests)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript({
            sortOutput: true
        }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.dev.dist))
        .pipe(filter);
};

// Returns a stream of one script called app.min.js that contains validated, correctly ordered, concatenated,
// and uglified application scripts. Also includes validated HTML partials that have been converted to JavaScript
// to pre-load the Angular template cache.
pipes.builtAppScriptsProd = function () {
    var filter = plugins.filter('**/*.js');
    var scriptedPartials = pipes.scriptedPartials();

    // Sorts all TypeScript files according to "<reference path=" logic and combines them into a single file.
    var transpiledTypeScript = pipes.validatedTypeScript()
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript({
            sortOutput: true,
            out: 'appscripts.min.js'
        }));

    // Attach partials to the bottom of the resulting file. Order is important because partials need to have
    // the defined modules they need to attach templateCache to.
    return es.merge( // this task is finished when the IO of both operations are done
        transpiledTypeScript, scriptedPartials)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(paths.prod.scripts))
        .pipe(filter);
};

// === 4. Building vendor scripts =====

// Returns an ordered stream of third-party scripts in the specified directory.
pipes.builtVendorScripts = function (outputPath) {
    return gulp.src(bowerFiles('**/*.js'))
        .pipe(pipes.orderedVendorScripts())
        .pipe(gulp.dest(outputPath));
};

// === 5. Building the dev server scripts =====

// The development server JavaScript lives in, and runs from /devServer.
// This segment returns a stream of validated dev server scripts. We can use this later to watch changes to the server,
// if, for example we're modifying a mock API response.
pipes.validatedDevServerScripts = function () {
    return gulp.src(paths.scriptsDevServer)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

// === 6. Building application partials =====

// Returns a stream of HTML files validated with htmlhint.
pipes.validatedPartials = function () {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter())
        .on('error', pipes.onError);

};

// For development, this segment returns validated partials in the dev environment.
pipes.builtPartialsDev = function () {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.dev.dist));
};

// For production, we use ngHtml2js, which converts all partials to JavaScript and preloads them
// into the Angular template cache. This segment returns a stream of one JavaScript file
// that will execute the preloading. This stream is merged into pipes.builtAppScriptsProd in section 3.
// Note the moduleName value should be the name of the Angular app which uses the partials.
pipes.scriptedPartials = function () {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: paths.mainModuleName,
            declareModule: false
        }));
};

// === 7. Building application styles =====

// For development, this segment returns a stream of CSS files that have been compiled from SASS.
// All directory structures are preserved in the dev environment.
pipes.builtStylesDev = function () {
    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(gulp.dest(paths.dev.css));
};

// For production, this segment returns a stream of a single, minified CSS file, including a sourcemap,
// in the production environment.
pipes.builtStylesProd = function () {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.prod.css));
};

// Process Images

pipes.processedImagesDev = function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.dev.images));
};

pipes.processedImagesProd = function () {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.prod.images));
};

pipes.builtCursorsFonts = function (outputDir) {
    var fonts = gulp.src(['bower_components/thief/fonts/*.woff', 'bower_components/thief-angular/fonts/*.woff'])
        .pipe(gulp.dest(outputDir + '/fonts'));
    var cursors = gulp.src(['bower_components/thief/cursors/*.*', 'bower_components/thief-angular/cursors/*.*'])
        .pipe(gulp.dest(outputDir + '/cursors'));
    return es.merge(fonts, cursors);
};

// === 8. Building the index =====

// Because the index (shell page) pulls together many different streams, we have some special,
// more complicated pipe segments for it. This segment returns a stream of index.html, validated with htmlhint.
pipes.validatedIndex = function () {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

// This stream outputs an index.html in the dev environment which references all the files built for development.
// Notice that there are three pipe segments that feed into the index stream.
// The gulp-inject plugin is used to write references into the index file in the places denoted.
pipes.builtIndexDev = function (includeUnitTests) {

    var orderedVendorScripts = pipes.builtVendorScripts(paths.dev.vendorScripts);

    var orderedAppScripts = pipes.builtAppScriptsDev(includeUnitTests);

    var appStyles = pipes.builtStylesDev();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.dev.dist)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(gulp.dest(paths.dev.dist));
};

// The production stream is similar, except we use production versions of the built files.
// The index is also minified post-injection.
pipes.builtIndexProd = function () {

    var vendorScripts = pipes.builtVendorScripts(paths.prod.vendorScripts);
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.prod.dist)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(pipes.cdnized())
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.prod.dist));
};

// === 9. Build everything =====

// These segments output the entire client-side application stream for dev and prod, respectively.
// For development, we have to merge the index and partials streams
// because there's no direct reference to the partial files in index.html.
pipes.builtAppDev = function () {
    return es.merge(pipes.builtIndexDev(),
        pipes.builtPartialsDev(),
        pipes.processedImagesDev(),
        pipes.builtCursorsFonts(paths.dev.dist));
};

// For production, we simply forward the stream from pipes.builtIndexProd
// because the partials are included in the app scripts.
pipes.builtAppProd = function () {
    return es.merge(pipes.builtIndexProd(),
        pipes.processedImagesProd(),
        pipes.builtCursorsFonts(paths.prod.dist));
};

// === 10. Serve app =====

// These tasks will serve the app at the default port of 8080 unless it has been overridden by an environmental var.
// If app's content changes, gulp will detect the change, process it and update the dist.
pipes.servedAppDev = function () {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({
        script: 'server.js',
        ext: 'js',
        watch: ['devServer/'],
        env: {NODE_ENV: 'development'}})
            .on('change', ['validate-devserver-scripts'])
            .on('restart', function () {
                console.log('[nodemon] restarted dev server');
            });


    // start live-reload server
    plugins.livereload.listen({start: true});

    // watch index
    gulp.watch(paths.index, function () {
        return pipes.builtIndexDev()
            .pipe(plugins.livereload());
    });

    // watch app typescripts
    gulp.watch(paths.typescript, function () {
        return pipes.builtAppScriptsDev()
            .pipe(plugins.livereload());
    });

    // watch html partials
    gulp.watch(paths.partials, function () {
        return pipes.builtPartialsDev()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function () {
        return pipes.builtStylesDev()
            .pipe(plugins.livereload());
    });

};

pipes.servedAppProd = function () {

    // start nodemon to auto-reload the dev server
    plugins.nodemon({script: 'server.js', ext: 'js', watch: ['devServer/'], env: {NODE_ENV: 'production'}})
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    plugins.livereload.listen({start: true});

    // watch index
    gulp.watch(paths.index, function () {
        return pipes.builtIndexProd()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    gulp.watch(paths.typescript, function () {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch hhtml partials
    gulp.watch(paths.partials, function () {
        return pipes.builtAppScriptsProd()
            .pipe(plugins.livereload());
    });

    // watch styles
    gulp.watch(paths.styles, function () {
        return pipes.builtStylesProd()
            .pipe(plugins.livereload());
    });

};

// === 11. Unit Tests =====

pipes.sourceWithUnitTests = function () {
    return es.merge(pipes.builtIndexDev(true),
        pipes.builtPartialsDev(),
        pipes.processedImagesDev(),
        pipes.builtCursorsFonts(paths.dev.dist));
};

pipes.runUnitTests = function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function (exitCode) {
        done();
    }).start();
};

// === TASKS =====

// 1. === Common tasks =====

// removes all compiled dev files
gulp.task('clean-dev', function () {
    return del([paths.dev.dist, paths.scriptsDir]);
});

// removes all compiled production files
gulp.task('clean-prod', function () {
    return del([paths.prod.dist, paths.scriptsDir]);
});

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// cleans and builds a complete dev environment
gulp.task('build-dev', ['clean-dev'], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('build-prod', ['clean-prod'], pipes.builtAppProd);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['build-dev', 'validate-devserver-scripts'], pipes.servedAppDev);

// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['build-prod', 'validate-devserver-scripts'], pipes.servedAppProd);

// default task builds for prod
gulp.task('default', ['build-dev']);

// 2. Deployment tasks

// The following tasks are used by a buildpack when the app is deployed to factset.io.
// Development
gulp.task('heroku:development', ['build-dev']);
// Production
gulp.task('heroku:production', ['build-prod']);

// 3. Unit testing tasks

gulp.task('build-with-unit', ['clean-dev'], pipes.sourceWithUnitTests);
gulp.task('test',['build-with-unit'], pipes.runUnitTests);
gulp.task('run-test', pipes.runUnitTests);

// 4. Advanced tasks
// commented out for simplicity. Feel free to uncomment if you need more control over gulp tasks in your project

//// checks html source files for syntax errors
//gulp.task('validate-partials', pipes.validatedPartials);
//
//// checks index.html for syntax errors
//gulp.task('validate-index', pipes.validatedIndex);
//
//// moves html source files into the dev environment
//gulp.task('build-partials-dev', pipes.builtPartialsDev);
//
//// converts partials to javascript using html2js
//gulp.task('convert-partials-to-js', pipes.scriptedPartials);
//
//// runs jshint on the dev server scripts
//gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);
//
//// validates app scripts
//gulp.task('validate-app-scripts', pipes.validatedTypeScript);
//
//// moves app scripts into the dev environment
//gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);
//
//// concatenates, uglifies, and moves app scripts and partials into the prod environment
//gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);
//
//// compiles app sass and moves to the dev environment
//gulp.task('build-styles-dev', pipes.builtStylesDev);
//
//// compiles and minifies app sass to css and moves to the prod environment
//gulp.task('build-styles-prod', pipes.builtStylesProd);
//
//// validates and injects sources into index.html and moves it to the dev environment
//gulp.task('build-index-dev', pipes.builtIndexDev);
//
//// validates and injects sources into index.html, minifies and moves it to the dev environment
//gulp.task('build-index-prod', pipes.builtIndexProd);
//
//// builds a complete dev environment
//gulp.task('build-app-dev', pipes.builtAppDev);
//
//// builds a complete prod environment
//gulp.task('build-app-prod', pipes.builtAppProd);
//
//// serve the content of dist.dev
//gulp.task('serve-dev', pipes.servedAppDev);
//
//// serve the content of dist.prod
//gulp.task('serve-dev', pipes.servedAppProd);
//
//
//gulp.task('build-misc', pipes.builtCursorsFonts);