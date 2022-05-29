const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

let sass = require('gulp-sass')(require('sass')),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    browserSync = require('browser-sync').create(),
    woff2 = require('gulp-ttf2woff2'),
    del = require('del'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack'),
    sourcemap = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify-es').default,
    htmlMinify = require('gulp-htmlmin'),
    webp = require('gulp-webp'),
    gulp = require('gulp'),
    svg = require("gulp-svg-sprite");

const fonts = () => {
    return src('./dev/fonts/*.ttf')
        .pipe(woff2())
        .pipe(dest('./build/fonts/'))
}

const scripts = () => {
    return src('./dev/scripts/main.js')
        .pipe(webpackStream({
            output: {
                filename: 'main.js'
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: "defaults"
                                }]
                            ]
                        }
                    }
                }]
            },
        }))
        .pipe(sourcemap.init())
        .pipe(uglify().on('error', notify.onError()))
        .pipe(rename({
          suffix: ".min"
      }))
        .pipe(sourcemap.write('.'))
        .pipe(dest('./build/scripts/'))
        .pipe(browserSync.stream())
}

const styles = () => {
    return src('./dev/styles/**/*.scss')
        .pipe(sourcemap.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(sourcemap.write('.'))
        .pipe(dest('./build/styles/'))
        .pipe(browserSync.stream())
}

const html = () => {
    return src('./dev/**/*.html')

        .pipe(dest('./build'))
        .pipe(browserSync.stream())
}

const clean = () => {
    return del(['build/'])
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });

    watch('./dev/styles/**/*.scss', styles)
    watch('./dev/**/*.html', html)
    watch('./dev/fonts/*.ttf', fonts)
    watch('./dev/scripts/main.js', scripts)
    watch('./dev/scripts/components/*.js', scripts)
    watch('./dev/scripts/vendor/*.js', vendorJS)
    watch('./dev/svg/**/*.svg',svgSprites)
    watch('./dev/img/**/*.*',imgBuild)
}

const vendorCSS = () => {
    return src('./dev/styles/*.css')
    .pipe(dest('./build/styles/'))
}

const vendorJS = () => {
    return src('./dev/scripts/vendor/*.js')
    .pipe(dest('./build/scripts/'))
}

const imgBuild = () =>{
  return src('./dev/img/**')
  .pipe(dest('./build/img/'))
}

const svgSprites = () => {
    return src('./dev/svg/**/*.svg')
    .pipe(svg({
        mode:{
            stack:{
                sprite: "../Sprite.svg"
            }
        }
    }))
    .pipe(dest('./build/'))
}

exports.default = series(clean, html, scripts, imgBuild, svgSprites, fonts, styles, vendorCSS, vendorJS, watchFiles)

const scriptsProd = () => {
    return src('./dev/scripts/main.js')
        .pipe(webpackStream({
            output: {
                filename: 'main.js'
            },
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: "defaults"
                                }]
                            ]
                        }
                    }
                }]
            },
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(uglify().on('error', notify.onError()))
        .pipe(dest('./build/scripts/'))
}

const stylespProd = () => {
    return src('./dev/styles/**/*.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', notify.onError()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('./build/styles/'))
}

const htmlProd = () => {
    return src('./dev/**/*.html')
        .pipe(htmlMinify({collapseWhitespace: true}))
        .pipe(dest('./build'))
}

exports.prod = series(clean, htmlProd, scriptsProd, imgBuild, svgSprites, fonts, stylespProd, vendorCSS, vendorJS)
