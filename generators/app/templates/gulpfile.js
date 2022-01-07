const { src, dest, parallel, series, watch } = require('gulp')
const loadPlugins = require('gulp-load-plugins')()
const sass = require('gulp-sass')(require('sass'))
const bs = require('browser-sync').create()
const del = require('del')

const clean = () => {
  return del(['dist'])
}

// 模拟模板数据，swig配置解析，推荐使用json文件，再读取载入进来
const data = {
  // pkg: require('./package.json'),
  // date: new Date()
}

// 处理css
const style = () => {
  return src('<%= source %>/**/*.css', { base: '<%= source %>' })
    .pipe(sass())
    .pipe(loadPlugins.cleanCss())
    .pipe(dest('dist'))
}

// 处理js
const script = () => {
  return src('<%= source %>/**/*.js', { base: '<%= source %>' })
    .pipe(loadPlugins.eslint())
    .pipe(loadPlugins.eslint.format())
    .pipe(loadPlugins.eslint.failAfterError())
    .pipe(loadPlugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(loadPlugins.uglify())
    .pipe(dest('dist'))
}

// 处理image
const image = () => {
  return src('<%= source %>/images/**', { base: '<%= source %>' })
    .pipe(loadPlugins.imagemin())
    .pipe(dest('dist'))
}

// 处理public文件夹
const extra = () => {
  return src('<%= source %>/public/**', { base: '<%= source %>' }).pipe(
    dest('dist')
  )
}

// 处理html
const page = () => {
  return src('<%= source %>/*.html', { base: '<%= source %>' })
    .pipe(loadPlugins.swig({ data }))
    .pipe(
      loadPlugins.htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(dest('dist'))
}

// 建立server
const serve = () => {
  watch('<%= source %>/**/*.css', style)
  watch('<%= source %>/**/*.js', script)
  watch('<%= source %>/**/*.html', page)
  // watch('src/images/*',image)
  // watch('src/public/*.js',extra)
  watch(['<%= source %>/images/*', '<%= source %>/public/*.js'], bs.reload)
  bs.init({
    port: 3000,
    notify: true,
    files: 'dist/**',
    server: {
      baseDir: 'dist'
    }
  })
}

const complie = parallel(style, script, image, extra, page)
const build = series(clean, complie)
const development = series(complie, serve)
module.exports = {
  build,
  development
}
