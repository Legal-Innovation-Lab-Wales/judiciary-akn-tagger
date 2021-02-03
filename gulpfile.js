const { src, dest, series } = require('gulp');
const del = require('del');
const log = require('fancy-log');

const paths = {
    react_src: 'src/main/ui/build/**/*',
    react_dist: 'src/main/resources/static-content/'
};

function clean()  {
    log('Removing the old React code from the static directory')
    return del('src/main/resources/static-content/**', { force: true });
}

function copyReactCodeTask() {
    log('Copying the new React code into the directory')
    return src(`${paths.react_src}`).pipe(dest(`${paths.react_dist}`));
}

exports.default = series(
    clean,
    copyReactCodeTask
);