/*global module:false*/
module.exports = function(grunt) {

  /**
   * Project configuration.
   */

  const babel       = require('@rollup/plugin-babel').default,
        terser      = require('rollup-plugin-terser').terser;

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
          'dist/assets/main.css': 'src/assets/scss/main.scss'
        }
      }
    },
    postcss: {
      options: {
        map: {
            inline: false,
            annotation: 'dist/assets/'
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
          }),
          terser()
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
      htdpcs: {
        files: [
          'src/htdocs/**/*'
        ],
        tasks: ['build-htdocs']
      },
      scss: {
        files: [
          'src/assets/**/*.scss'
        ],
        tasks: ['build-scss']
      },
      js: {
        files: [
          'src/assets/**/*.js'
        ],
        tasks: ['build-js']
      }
    }
  });

  // Automatically load all grunt task dependencies
  require('load-grunt-tasks')(grunt);

  // Tasks
  grunt.registerTask('build-htdocs', ['copy']);
  grunt.registerTask('build-scss', ['stylelint', 'dart-sass', 'postcss']);
  grunt.registerTask('build-js', ['jshint', 'rollup']);
  grunt.registerTask('build', ['build-htdocs', 'build-scss', 'build-js']);
  grunt.registerTask('serve', ['connect', 'watch']);
  grunt.registerTask('default', ['build']);

};
