module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['gruntfile.js', 'public/js/*.js', 'tests/specs/**/*.js', 'server/*.js'],
            options: {ignores: ['public/js/bundle.js']}
        },

        csslint: {
            all: {
                src:['public/css/main.css']
            }
        },
        jasmine: {
            all: {
                src: [ 'public/js/bundle.js' ],
                options: {
                    specs: 'tests/dist/test_bundle.js',
                    vendor: ['public/lib/knockout/dist/*.js',
                                'public/lib/knockout-validation/dist/*.js',
                                'public/lib/underscore/*.js',
                                'tests/helpers/socket.io.fake.js',
                                'tests/lib/sinon.js',
                                'public/lib/alertify.js/lib/alertify.js']
                }
            }
        },
        jasmine_node: {
            projectRoot: "tests/specs/server"
        },
        pug: {
            compile: {
                options: {
                    data: {
                        debug: false,
                        wsHost: 'wss://scrumbles.azurewebsites.net'
                    }
                },
                files: {
                    "public/Index.html": ["public/templates/Index.pug"]
                }
            }
        },
        browserify: {
            dist: {
                files: {
                    'public/js/bundle.js': ['public/js/main.js']
                }
            },
            test: {
                src: [  'tests/specs/client/*.js'
                ],
                dest: 'tests/dist/test_bundle.js',
                options: {
                    ignore: ['public/node_modules/underscore/underscore.js']
                }
            }
        },
        uglify: {
            index: {
                files: {
                    'public/js/dest/main.min.js': ['public/js/bundle.js']
                }
            },
            options: {
                sourceMap:true
            }
        },
        cssmin: {
            options:{
                rebaseTo:'public/css'
            },
            target: {
                files: {
                    'public/css/dest/main.min.css':
                        [
                            'public/css/main.css',
                            'public/css/card-selection.css',
                            'public/css/test.css',
                            'public/css/alertify.core.css',
                            'public/css/alertify.default.css'],
                    'public/css/dest/bootstrap.min.css': ['public/css/bootstrap.css']
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'public/css/main.css': 'public/css/main.scss',
                    'public/css/card-selection.css': 'public/css/card-selection.scss'
                }
            }
        },
        watch: {
            scripts: {
                files: ['public/js/*.js'],
                tasks: ['browserify', 'uglify'],
                opitons: {
                    spawn: true
                }
            },
            pug: {
                files: ['public/templates/*.pug'],
                tasks: ['pug'],
                options: {
                    spawn: true
                }
            },
            css: {
                files: ['public/css/*.css', 'public/css/*.scss'],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: true
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    // Default task(s).
    grunt.registerTask('test', ['browserify', 'jasmine:all', 'jasmine_node']);
    grunt.registerTask('default', ['jshint:all', 'pug', 'browserify', 'jasmine:all', 'jasmine_node', 'uglify', 'sass', 'cssmin:target']);
    grunt.registerTask('notest', ['jshint:all', 'pug', 'browserify', 'uglify', 'sass', 'cssmin:target']);
    grunt.registerTask('build', ['pug', 'browserify', 'uglify', 'sass', 'cssmin']);
};