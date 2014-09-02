/**
 * Gruntfile.js Grunt 프로그램의 설정파일입니다. 상세한 사항은 gruntjs.com 참고.
 */

var fs = require('fs');

module.exports = function ( grunt ) {
  var concatObj = {
    css : {
      'public/css/app.css' : [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'public/css/base.css' ]
    },
    baseline : {
      'public/js/baseline.js' : [ 'bower_components/jquery/dist/jquery.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-resource/angular-resource.min.js',
          'bower_components/angular-route/angular-route.min.js' ]
    }
  };
  var watchObj = {
    stylus : {
      files : [ '<%= stylus.compile.files.src %>' ],
      tasks : [ 'stylus', 'concat:css' ],
      options : {
        spawn : true
      }
    },
    baseline : {
      files : [ '<%= jshint.files %>' ],
      tasks : [ 'jshint' ],
      options : {
        spawn : true
      }
    }
  };
  var uglifyObj = {
    options : {
      banner : '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      report : 'gzip'
    }
  };

  var dirs = fs.readdirSync('client/scripts');

  for ( var i = 0; i < dirs.length; i++ ) {
    var dir = dirs[i];

    concatObj[dir] = {};
    uglifyObj[dir] = {};

    concatObj[dir]['public/js/' + dir + '.js'] = [ 'client/scripts/' + dir
        + '/*.js' ];
    uglifyObj[dir]['public/js/' + dir + '.min.js'] = [ 'public/js/' + dir
        + '.js' ];

    watchJS[dir] = {
      files : [ 'client/scripts/' + dir + '/*.js' ],
      tasks : [ 'concat:' + dir, 'uglify:' + dir ]
    }
  }

  grunt
      .initConfig({
        pkg : grunt.file.readJSON('package.json'),
        stylus : {
          compile : {
            files : {
              dest : 'public/css/base.css',
              src : [ 'client/stylesheets/*.styl' ]
            }
          }
        },
        concat : concatObj,
        uglify : uglifyObj,
        jshint : {
          output : {
            jshintrc : true,
            force : true
          },
          files : [ 'Gruntfile.js', 'server.js', 'server/**/*.js',
              'client/**/*.js' ]
        },
        watch : watchObj,
        nodemon : {
          script : 'server.js'
        }
      });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('jshint', [ 'jshint' ]);
  grunt.registerTask('compile', [ 'stylus', 'concat', 'uglify' ]);

  grunt.registerTask('default', [ 'jshint', 'stylus', 'concat', 'uglify',
      'watch', 'nodemon' ]);

};