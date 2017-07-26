import gulp from 'gulp';
import clean from 'gulp-clean';
import babel from 'gulp-babel';
import minify from 'gulp-minifier';
import jsonModify from 'gulp-json-modify';

const src = './src';
const dist_folder = './dist';
const dist_folder_server = `${dist_folder}/server`;
const dist_folder_swagger_documentation = `${dist_folder}/api-docs`;

gulp.task('clean', () => {
  return gulp
    .src([`${dist_folder}/*`], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('build-babel', () => {
  return gulp
    .src(`${src}/**/*.js`)
    .pipe(babel())
    .pipe(gulp.dest(dist_folder_server));
});

gulp.task('static', () => {
  gulp.src(['src/**/*.yaml']).pipe(gulp.dest(dist_folder_server));
  gulp
    .src('package.json')
    .pipe(jsonModify({ key: 'devDependencies', value: {} }))
    .pipe(gulp.dest(dist_folder));
  gulp
    .src(['src/views/**/*.{html,css}'])
    .pipe(
      minify({
        minify: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyJS: true,
        minifyCSS: true
      })
    )
    .pipe(gulp.dest(`${dist_folder_server}/views`));
  gulp
    .src(['src/views/**/*.*', '!src/views/**/*.{html,css}'])
    .pipe(gulp.dest(`${dist_folder_server}/views`));
});

gulp.task('build', ['clean', 'build-babel', 'static']);
