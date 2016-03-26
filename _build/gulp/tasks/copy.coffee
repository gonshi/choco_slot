gulp = require 'gulp'
config = require '../config'
$ = (require 'gulp-load-plugins')()

# Copy All Files At The Root Level (dist)
gulp.task 'copy', (dir) ->
    gulp.src(config.path.dist + '**/*')
        .pipe(gulp.dest('../214'))
        .pipe($.size({ title: 'copy' }))

gulp.task 'copy-preview', (dir) ->
    gulp.src(config.path.dist + '**/*')
        .pipe(gulp.dest('../html5-cl/taji/choco/'))
        .pipe($.size({ title: 'copy-preview' }))

gulp.task 'copy-slot-maker', (dir) ->
    gulp.src(config.path.dist + '**/*')
        .pipe(gulp.dest('../../slot-maker/public/214/'))
        .pipe($.size({ title: 'copy-slot-maker' }))

# gulp.task 'copy:docs', () ->
#     gulp.src([])
#         .pipe(gulp.dest())
