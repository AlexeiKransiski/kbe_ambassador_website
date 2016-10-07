var args = require('yargs').argv,
    path = require('path'),
    flip = require('css-flip'),
    through = require('through2'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp),
    PluginError = $.util.PluginError,
    del = require('del'),
    htmlmin = require('gulp-htmlmin');

var browserSync = require("browser-sync");
var spa = require("browser-sync-spa");

browserSync.use(spa({
  selector: "[ng-app]" // Only needed for angular apps 
}));

// production mode (see build task)
var isProduction = false;
// styles sourcemaps
var useSourceMaps = false;

// Switch to sass mode. 
// Example:
//    gulp --usesass
var useSass = args.usesass;

// Angular template cache
// Example:
//    gulp --usecache
var useCache = args.usecache;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!' + hidden_files;

// MAIN PATHS
var paths = {
  app: '../app/',
  //markup:  'jade/',
  styles: 'less/',
  scripts: 'js/',
  html: 'html/'
}

// if sass -> switch to sass folder
if (useSass) {
  log('Using SASS stylesheets...');
  paths.styles = 'sass/';
}


// VENDOR CONFIG
var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./vendor.base.json'),
    dest: '../app/js',
    name: 'base.js'
  },
  // vendor scripts to make the app work. Usually via lazy loading
  app: {
    source: require('./vendor.json'),
    dest: '../vendor'
  }
};


// SOURCES CONFIG 
var source = {
  scripts: [paths.scripts + 'app.module.js',
            // template modules
            paths.scripts + 'modules/**/*.module.js',
            paths.scripts + 'modules/**/*.js',
            // custom modules
            paths.scripts + 'custom/**/*.module.js',
            paths.scripts + 'custom/**/*.js'
  ],
  //templates: {
  //  index: [paths.markup + 'index.*'],
  //  views: [paths.markup + '**/*.*', '!' + paths.markup + 'index.*']
  //},
  styles: {
    app: [paths.styles + '*.*'],
    themes: [paths.styles + 'themes/*'],
    watch: [paths.styles + '**/*', '!' + paths.styles + 'themes/*']
  },
  html: {
    index: [paths.html + 'index.*'],
    views: [paths.html + '**/*.*', '!' + paths.html + 'index.*']
  }
};

// BUILD TARGET CONFIG 
var build = {
  scripts: paths.app + 'js',
  styles: paths.app + 'css',
  templates: {
    index: '../',
    views: paths.app,
    cache: paths.app + 'js/' + 'templates.js',
  }
};

// PLUGINS OPTIONS

var prettifyOpts = {
  indent_char: ' ',
  indent_size: 3,
  unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'pre', 'code']
};

var vendorUglifyOpts = {
  mangle: {
    except: ['$super'] // rickshaw requires this
  }
};

var compassOpts = {
  project: path.join(__dirname, '../'),
  css: 'app/css',
  sass: 'master/sass/',
  image: 'app/img'
};

var compassOptsThemes = {
  project: path.join(__dirname, '../'),
  css: 'app/css',
  sass: 'master/sass/themes/', // themes in a subfolders
  image: 'app/img'
};

var tplCacheOptions = {
  root: 'app',
  filename: 'templates.js',
  //standalone: true,
  module: 'app.core',
  base: function (file) {
    return file.path.split('jade')[1];
  }
};

var injectOptions = {
  name: 'templates',
  transform: function (filepath) {
    return 'script(src=\'' +
              filepath.substr(filepath.indexOf('app')) +
            '\')';
  }
}

//---------------
// TASKS
//---------------


// JS APP
gulp.task('scripts:app', function () {
  log('Building scripts..');
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(source.scripts)
      .pipe($.jsvalidate())
      .on('error', handleError)
      .pipe($.if(useSourceMaps, $.sourcemaps.init()))
      .pipe($.concat('app.js'))
      .pipe($.ngAnnotate())
      .on('error', handleError)
      .pipe($.if(isProduction, $.uglify({ preserveComments: 'some' })))
      .on('error', handleError)
      .pipe($.if(useSourceMaps, $.sourcemaps.write()))
      .pipe(gulp.dest(build.scripts));
});

// 
gulp.task('scripts:i18n', function () {
  log('Building i18n..');
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src('i18n/**.json')
      .pipe(gulp.dest('../app/i18n'));
});



// VENDOR BUILD
gulp.task('vendor', gulpsync.sync(['vendor:base', 'vendor:app']));

// Build the base script to start the application from vendor assets
gulp.task('vendor:base', function () {
  log('Copying base vendor assets..');
  return gulp.src(vendor.base.source)
      .pipe($.expectFile(vendor.base.source))
      .pipe($.if(isProduction, $.uglify()))
      .pipe($.concat(vendor.base.name))
      .pipe(gulp.dest(vendor.base.dest))
  ;
});

// copy file from bower folder into the app vendor folder
gulp.task('vendor:app', function () {
  log('Copying vendor assets..');

  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(vendor.app.source, { base: 'bower_components' })
      .pipe($.expectFile(vendor.app.source))
      .pipe(jsFilter)
      .pipe($.if(isProduction, $.uglify(vendorUglifyOpts)))
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe($.if(isProduction, $.minifyCss()))
      .pipe(cssFilter.restore())
      .pipe(gulp.dest(vendor.app.dest));

});

// APP LESS
gulp.task('styles:app', function () {
  log('Building application styles..');
  return gulp.src(source.styles.app)
      .pipe($.if(useSourceMaps, $.sourcemaps.init()))
      .pipe(useSass ? $.compass(compassOpts) : $.less())
      .on('error', handleError)
      .pipe($.if(isProduction, $.minifyCss()))
      .pipe($.if(useSourceMaps, $.sourcemaps.write()))
      .pipe(gulp.dest(build.styles));
});

// APP RTL
gulp.task('styles:app:rtl', function () {
  log('Building application RTL styles..');
  return gulp.src(source.styles.app)
      .pipe($.if(useSourceMaps, $.sourcemaps.init()))
      .pipe(useSass ? $.compass(compassOpts) : $.less())
      .on('error', handleError)
      .pipe(flipcss())
      .pipe($.if(isProduction, $.minifyCss()))
      .pipe($.if(useSourceMaps, $.sourcemaps.write()))
      .pipe($.rename(function (path) {
        path.basename += "-rtl";
        return path;
      }))
      .pipe(gulp.dest(build.styles));
});

// LESS THEMES
gulp.task('styles:themes', function () {
  log('Building application theme styles..');
  return gulp.src(source.styles.themes)
      .pipe(useSass ? $.compass(compassOptsThemes) : $.less())
      .on('error', handleError)
      .pipe(gulp.dest(build.styles));
});

// JADE
//gulp.task('templates:index', ['templates:views'], function() {
//    log('Building index..');

//    var tplscript = gulp.src(build.templates.cache, {read: false});
//    return gulp.src(source.templates.index)
//        .pipe( $.if(useCache, $.inject(tplscript, injectOptions)) ) // inject the templates.js into index
//        .pipe( $.jade() )
//        .on('error', handleError)
//        .pipe($.htmlPrettify( prettifyOpts ))
//        .pipe(gulp.dest(build.templates.index))
//        ;
//});

//// JADE
//gulp.task('templates:views', function() {
//    log('Building views.. ' + (useCache?'using cache':''));

//    if(useCache) {

//      return gulp.src(source.templates.views)
//          .pipe($.jade())
//          .on('error', handleError)
//          .pipe($.angularTemplatecache(tplCacheOptions))
//          .pipe( $.if(isProduction, $.uglify({preserveComments:'some'}) ))
//          .pipe(gulp.dest(build.scripts));
//          ;  
//    }
//    else {

//      return gulp.src(source.templates.views)
//          .pipe( $.if( !isProduction, $.changed(build.templates.views, { extension: '.html' }) ))
//          .pipe($.jade())
//          .on('error', handleError)
//          .pipe($.htmlPrettify( prettifyOpts ))
//          .pipe(gulp.dest(build.templates.views))
//          ;
//    }
//});

// HTML
gulp.task('html:index', function () {
  gulp.src('html/index.html')
    .pipe($.if(isProduction, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest('../'));
});

gulp.task('html:views', function () {
  gulp.src('html/views/*.html')
    .pipe($.if(isProduction, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.app + '/views'));
});

gulp.task('html:partialViews', function () {
  gulp.src('html/views/partials/*.html')
    .pipe($.if(isProduction, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.app + '/views/partials'));
});

gulp.task('html:pages', function () {
  gulp.src('html/pages/*.html')
    .pipe($.if(isProduction, htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest(paths.app + '/pages'));
});

// images

gulp.task('images', function () {
  gulp.src('img/**/**.*')
    .pipe(gulp.dest(paths.app + '/img'));
});

// Static server
gulp.task('browser-sync', function () {
  log('Starting up browser-sync..');
  browserSync.init({
    open: false,
    server: {
      baseDir: "../"
    }
  });
});

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function () {
  log('Starting watch and LiveReload..');

  $.livereload.listen();

  gulp.watch(source.scripts, ['scripts:app']);
  gulp.watch(source.styles.watch, ['styles:app', 'styles:app:rtl']);
  gulp.watch(source.styles.themes, ['styles:themes']);
  gulp.watch(source.html.views, ['html:views']);
  gulp.watch(source.html.index, ['html:index']);
  gulp.watch(source.html.partialViews, ['html:partialViews']);
  gulp.watch(source.html.pages, ['html:pages']);
  //gulp.watch(source.templates.views, ['templates:views']);
  //gulp.watch(source.templates.index, ['templates:index']);

  // a delay before triggering browser reload to ensure everything is compiled
  var livereloadDelay = 1500;
  // list of source file to watch for live reload
  var watchSource = [].concat(
      source.scripts,
      source.styles.watch,
      source.styles.themes,
      source.html.views,
      source.html.index
      //source.html.partialViews
      //source.html.pages      
      //source.templates.views,
      //source.templates.index
    );

  gulp
    .watch(watchSource)
    .on('change', function (event) {
      setTimeout(function () {
        $.livereload.changed(event.path);
      }, livereloadDelay);
    });

});

// lint javascript
gulp.task('lint', function () {
  return gulp
      .src(source.scripts)
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
      .pipe($.jshint.reporter('fail'));
});

// Remove all files from the build paths
gulp.task('clean', function (done) {
  var delconfig = [].concat(
                      build.styles,
                      build.scripts,
                      //build.templates.index + 'index.html',
                      //build.templates.views + 'views',
                      //build.templates.views + 'pages',
                      vendor.app.dest
                    );

  log('Cleaning: ' + $.util.colors.blue(delconfig));
  // force: clean files outside current directory
  del(delconfig, { force: true }, done);
});

//---------------
// MAIN TASKS
//---------------

// build for production (minify)
gulp.task('build', gulpsync.sync([
          'prod',
          'vendor',
          'assets',
          'copy-to-dist',
          'aws-s3'
]));

gulp.task('build-local', gulpsync.sync([
          'prod',
          'vendor',
          'assets',
          'copy-to-dist'
]));

gulp.task('prod', function () {
  log('Starting production build...');
  isProduction = true;
});

gulp.task('copy-to-dist', gulpsync.sync([
          'copy-app-to-dist',
          'copy-vendor-to-dist',
          'copy-server-to-dist',
          'copy-index-to-dist',
          'copy-custom-bower-to-dist'
]));

gulp.task('copy-app-to-dist', function () {
  log('Copying app to dist...');

  return gulp.src('../app/**')
    .pipe(gulp.dest('./dist/app/'));
});

gulp.task('copy-vendor-to-dist', function () {
  log('Copying vendor to dist...');

  return gulp.src('../vendor/**')
    .pipe(gulp.dest('./dist/vendor/'));
});

gulp.task('copy-server-to-dist', function () {
  log('Copying server to dist...');

  return gulp.src('../server/**')
    .pipe(gulp.dest('./dist/server/'));
});

gulp.task('copy-index-to-dist', function () {
  log('Copying server to dist...');

  return gulp.src('../index.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-custom-bower-to-dist', function () {
  log('Copying server to dist...');

  return gulp.src('../bower_components_custom/**')
    .pipe(gulp.dest('./dist/bower_components_custom/'));
});

gulp.task('aws-s3', function () {

  log('Uploading to AWS S3...');

  var aws = {
    key: 'AKIAIGYL6YRFZQCGGRVQ',
    secret: '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',
    region: 'us-west-1',
    bucket: 'kadhoambassador.kadho.com'
  };
  var s3 = require("gulp-s3");
  gulp.src('./dist/**')
    .pipe(s3(aws));



});

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function () { useSourceMaps = true; });

// default (no minify)
gulp.task('default', gulpsync.sync([
          'vendor',
          'assets',
          'watch',
          'browser-sync'
]), function () {

  log('************');
  log('* All Done * You can start editing your code, LiveReload will update your browser after any change..');
  log('************');

});

gulp.task('assets', [
          'scripts:app',
          'scripts:i18n',
          'styles:app',
          'styles:app:rtl',
          'styles:themes',
          'html:index',
          'html:views',
          'html:pages',
          'html:partialViews',
          'images'
          //'templates:index',
          //'templates:views'
]);


/////////////////////


// Error handler
function handleError(err) {
  log(err.toString());
  this.emit('end');
}

// Mini gulp plugin to flip css (rtl)
function flipcss(opt) {

  if (!opt) opt = {};

  // creating a stream through which each file will pass
  var stream = through.obj(function (file, enc, cb) {
    if (file.isNull()) return cb(null, file);

    if (file.isStream()) {
      // Todo: isStream!
    }

    var flippedCss = flip(String(file.contents), opt);
    file.contents = new Buffer(flippedCss);
    cb(null, file);
  });

  // returning the file stream
  return stream;
}

// log to console using 
function log(msg) {
  $.util.log($.util.colors.blue(msg));
}
