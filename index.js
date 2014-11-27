var elixir = require('laravel-elixir'),
    gulp = require("gulp"),
    compass = require('gulp-compass'),
    utilities = require('laravel-elixir/ingredients/helpers/utilities'),
    Notification = require('laravel-elixir/ingredients/helpers/Notification'),
    _ = require('underscore');

elixir.extend("compass", function(src, outputDir, options) {

    var config = this,
        defaultOptions = {
            config_file: false,
            sourcemap:   false,
            modules:     false,
            style:       config.production ? "compressed" : "expanded",
            image:       config.baseDir   + 'images',
            font:        config.baseDir   + 'fonts',
            sass:        config.assetsDir + 'scss',
            css:         outputDir || config.cssOutput,
            js:          config.jsOutput
        };

    options = _.extend(defaultOptions, options);
    src = utilities.buildGulpSrc(src, options.sass, '**/*.scss');

    var onError = function(e) {
        new Notification().error(e, 'Compass Compilation Failed!');
        this.emit('end');
    };

    gulp.task('compass', function() {
        return gulp.src(src)
            .pipe(compass({
                require: options.modules,
                config_file: options.config_file,
                style: options.style,
                css: options.css,
                sass: options.sass,
                font: options.font,
                image: options.image,
                javascript: options.js,
                sourcemap: options.sourcemap
            })).on('error', onError)
            .pipe(gulp.dest(options.css))
            .pipe(new Notification().message('Compass Compiled!'));
    });

    this.registerWatcher('compass', options.sass + '/**/*.scss');
    return this.queueTask("compass");
});
