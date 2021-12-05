/*global module:false*/
module.exports = function(grunt) {

  /**
   * Project configuration.
   */

  const babel = require('@rollup/plugin-babel').default;

  grunt.initConfig({
    // Metadata
    pkg: grunt.file.readJSON('package.json'),


    // Copy dependency assets to dist
    copy: {
      htdocs: {
        files: [
          {
            expand: true,
            cwd: 'src/htdocs/',
            src: ['**'],
            dest: 'dist/',
            filter: 'isFile'
          }
        ]
      },
      node_modules: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'node_modules/',
            src: [
              'obs-websocket-js/dist/obs-websocket.min.js',
              'obs-websocket-js/dist/obs-websocket.min.js.map',
              'normalize.css/normalize.css'
            ],
            dest: 'dist/assets/'
          }
        ]
      }
    },
    // smoosher: {
    //   dist: {
    //     files: [
    //       {'../dist/index.html': '../dist/index.html'}
    //     ]
    //   }
    // },

    // Sass Processing & Linting
    'dart-sass': {
      dist: {
        files: {
          'dist/assets/main.css': 'src/scss/main.scss'
        }
      }
    },
    postcss: {
      options: {
        map: {
            inline: false,
            annotation: 'dist/assets/scss/'
        },
        processors: [
          require('autoprefixer')(),
          require('cssnano')()
        ]
      },
      dist: {
        src: 'dist/assets/**/*.css'
      }
    },
    stylelint: {
      options: {
        configFile: '.stylelint.rc.json',
      },
      all: ['src/assets/**/*.scss']
    },

    // ECMAScript/JS Processing & Linting
    rollup: {
      options: {
        sourceMap: true,
        plugins: [
          babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env'],
            exclude: './node_modules/**'
          })
        ]
      },
      build: {
        files: {
          'dist/assets/main.js': 'src/assets/js/main.js'
        }
      }
    },
    jshint: {
      options: {
        esversion: 11
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      build: {
        src: ['src/assets/js/**/*.js']
      }
    },

    // Serve
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: 'localhost',
          livereload: 35729,
          base: 'dist'
        }
      }
    },

    // Development
    watch: {
      options: {
        livereload: 35729
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['default']
      },
      build: {
        files: [
          'src/assets/**/*.{scss,js}',
          'src/htdocs/**/*'
        ],
        tasks: ['default']
      }
    }
  });

  // Automatically load all grunt task dependencies
  require('load-grunt-tasks')(grunt);

  // Tasks
  grunt.registerTask('default', ['copy', 'stylelint', 'dart-sass', 'postcss', 'jshint', 'rollup']);
  grunt.registerTask('server', ['connect', 'watch']);

};