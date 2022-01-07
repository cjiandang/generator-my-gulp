const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting () {
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'your gulp project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'source',
        message: 'your gulp source path',
        default: 'src'
      }
    ]).then((answers) => {
      this.answers = answers
    })
  }

  writing () {
    const paths = [
      'gulpfile.js',
      'README.md',
      '.eslintrc.js',
      '.eslintignore',
      '.gitignore',
      '.prettierrc'
    ]
    paths.forEach((item) => {
      const tmp = this.templatePath(item)
      const des = this.destinationPath(item)
      const context = this.answers
      this.fs.copyTpl(tmp, des, context)
    })

    // this.fs.write(des,'aaa')
  }

  configuring () {
    const packageSettings = {
      name: this.answers.projectName,
      version: '0.0.1',
      description: 'my gulp cli',
      scripts: {
        lint: `eslint --fix ${this.answers.source}/**/*.js`,
        fix: `prettier --write ${this.answers.source}/**/*.js`,
        dev: 'yarn gulp development',
        build: 'yarn gulp build'
      },
      'lint-staged': {
        // eslint-disable-next-line no-template-curly-in-string
        [this.answers.source + '/**/*.js']: [
          'eslint --fix',
          'prettier --write',
          'git add'
        ]
      },
      husky: {
        hooks: {
          'pre-commit': 'lint-staged'
        }
      },
      devDependencies: {
        gulp: '^4.0.2',
        'yeoman-generator': '^5.5.2',
        '@babel/cli': '^7.16.7',
        '@babel/core': '^7.16.7',
        '@babel/preset-env': '^7.16.7',
        'browser-sync': '^2.27.7',
        del: '^6.0.0',
        'gulp-babel': '^8.0.0',
        'gulp-clean-css': '^4.3.0',
        'gulp-htmlmin': '^5.0.1',
        'gulp-load-plugins': '^2.0.7',
        'gulp-sass': '^5.1.0',
        'gulp-swig': '^0.9.1',
        'gulp-uglify': '^3.0.2',
        'gulp-imagemin': '^7.1.0',
        'gulp-eslint': '^6.0.0',
        sass: '^1.46.0',
        eslint: '^7.32.0',
        'eslint-config-standard': '14.1.1',
        'eslint-plugin-import': '^2.25.4',
        'eslint-plugin-node': '^11.1.0',
        'eslint-plugin-promise': '^5.2.0',
        'eslint-plugin-standard': '^5.0.0',
        husky: '^7.0.4',
        'lint-staged': '^12.1.6',
        prettier: '^2.5.1',
        'eslint-plugin-prettier': '^4.0.0',
        'eslint-config-prettier': '^8.3.0'
      }
    }
    this.fs.writeJSON(this.destinationPath('package.json'), packageSettings)
  }
}
