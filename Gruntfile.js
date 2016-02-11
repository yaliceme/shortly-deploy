module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    processhtml: {
      options: {
        data: {
          message: 'Hello world!'
        }
      },
      dist: {
        files: {
          'views/layout.ejs': ['views/layout.ejs'],
          'views/index.ejs': ['views/index.ejs']
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/lib.min.js': ['public/lib/backbone.js', 'public/lib/handlebars.js', 'public/lib/jquery.js', 'public/lib/underscore.js'],
          'public/dist/client.min.js': ['public/client/app.js', 'public/client/createLinkView.js', 'public/client/link.js', 'public/client/links.js', 'public/client/linksView.js', 'public/client/linkView.js', 'public/client/router.js']
        }
      }
    },

    eslint: {
      target: [
        'app/**/*.js',
        'lib/**/*.js',
        'public/client/**/*.js',
        'test/**/*.js',
        './server.js',
        './server-config.js'
        // Add list of files to lint here
      ]
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'uglify',
          'processhtml'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      push: {
        command: ['git push live master']
      },
      prodServer: {
        command: ['npm install']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

   // grunt.task.run([ 'watch' ]);
  });

  grunt.registerTask('prod', function (target) {

  });


  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     // add your production server task here
  //   }
  //   grunt.task.run([ 'server-dev' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [ 'eslint', 'mochaTest'
  ]);

  // grunt.registerTask('build', [ 'shell:devServer', 'test', 'uglify', 'processhtml', 'shell:prodServer', 'watch'
  // ]);

  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     grunt.task.run([ 'shell:prodServer','watch' ]);
  //     // add your production server task here
  //   } else {
  //     grunt.task.run([ 'server-dev' ]);
  //   }
  // });

  grunt.registerTask('deploy', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(["test", "shell:push"]);
    } else {
      grunt.task.run(["test", "nodemon"]);
    }
  });

  grunt.registerTask('build', function(n) {
      grunt.task.run(["uglify", "processhtml", "watch"]);
  });
};


