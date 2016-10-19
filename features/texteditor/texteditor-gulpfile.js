'use strict';

module.exports = function($allonsy, $gulp, $lessPaths, $lessPlugins) {

  var sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      less = require('gulp-less'),
      minifyCSS = require('gulp-minify-css');

  function _renameDirname(p, folder) {
    p.dirname = p.dirname.split(folder)[1];
    if (p.dirname.length && p.dirname.substr(0, 1) == '\\') {
      p.dirname = p.dirname.substr(1, p.dirname.length - 1);
    }

    return p;
  }

  $gulp.task('texteditor', function(done) {

    $gulp
      .src('./node_modules/tinymce/**/*')
      .pipe($gulp.dist('vendor/tinymce'))
      .on('end', function() {

        $gulp
          .src($allonsy.globPatterns('views/tinymce-skins/**/*'))
          .pipe(rename(function(p) {
            return _renameDirname(p, 'tinymce-skins');
          }))
          .pipe($gulp.dist('vendor/tinymce/skins'))
          .on('end', function() {

            $gulp
              .src($allonsy.globPatterns('views/tinymce-plugins/**/*'))
              .pipe(rename(function(p) {
                return _renameDirname(p, 'tinymce-plugins');
              }))
              .pipe($gulp.dist('vendor/tinymce/plugins'))
              .on('end', function() {

                $gulp
                  .src('./node_modules/prismjs/themes/prism.css')
                  .pipe($gulp.dist('vendor'))
                  .on('end', function() {

                    $gulp
                      .src($allonsy.globPatterns('views/tinymce-plugins/**/plugin.js'))
                      .pipe(rename(function(p) {
                        return _renameDirname(p, 'tinymce-plugins');
                      }))
                      .pipe(sourcemaps.init())
                      .pipe(uglify().on('error', function(err) {
                        $allonsy.logWarning('allons-y-texteditor', 'texteditor:uglify-error', {
                          error: err
                        });

                        this.emit('end');
                      }))
                      .pipe(rename({
                        extname: '.min.js'
                      }))
                      .pipe(sourcemaps.write('./'))
                      .pipe($gulp.dist('vendor/tinymce/plugins'))
                      .on('end', function() {

                        $gulp
                          .src($allonsy.globPatterns('views/tinymce-plugins/**/css/*.less'))
                          .pipe(rename(function(p) {
                            return _renameDirname(p, 'tinymce-plugins');
                          }))
                          .pipe(less({
                            paths: $lessPaths,
                            plugins: ($lessPlugins || []).concat([require('less-plugin-glob')])
                          }))
                          .pipe(rename({
                            extname: '.css'
                          }))
                          .pipe($gulp.dist('vendor/tinymce/plugins'))
                          .pipe(minifyCSS({
                            keepSpecialComments: 0
                          }))
                          .pipe(rename({
                            extname: '.min.css'
                          }))
                          .pipe($gulp.dist('vendor/tinymce/plugins'))
                          .on('end', done);

                      });
                  });
              });
          });
      });

  });

  return {
    tasks: 'texteditor',
    watch:
      $allonsy.globPatterns('views/tinymce-plugins/**/*').concat(
        $allonsy.globPatterns('views/tinymce-skins/**/*')
      )
  };
};
