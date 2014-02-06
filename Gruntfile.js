module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js',
            'src/**/*.js']
    },
    browserify: {
      production: {
        src: 'src/program.js',
        dest: 'build/program.js',
        options: {
          standalone: 'Run'
        }
      },
      debug: {
        src: 'src/program.js',
        dest: 'build/program.debug.js',
        options: {
          standalone: 'Run',
          debug: true
        }
      }
    },
    uglify: {
      build: {
        src: 'build/program.js',
        dest: 'build/program.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('default', ['jshint',
                                 'browserify:production',
                                 'uglify']);

  grunt.registerTask('debug', ['jshint',
                               'browserify:debug']);

};
