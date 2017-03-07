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
                src: [  'tests/lib/*.js',
                        'public/lib/*.js',
                        'public/lib/knockout/dist/*.js',
                        'public/lib/knockout-validation/dist/*.js',
                        'public/lib/underscore/*.js',
                        'tests/helpers/sinonExtentions.js',
                        'tests/helpers/serverCalls',
                        'tests/helpers/clientSideMocks.js',
                        'tests/helpers/clientTestHelper.js',
                        'tests/helpers/socket.io.fake.js',
                        //'public/js/dest/main.min.js'
                        // 'public/js/notify.js',
                        // 'public/js/socketManager.js',
                        // 'public/js/service/*.js',
                        // 'public/js/joinRoomViewModel.js',
                        // 'public/js/room.js',
                        // 'public/js/pageStatus.js',
                        // 'public/js/player.js',
                        // 'public/js/players.js',
                        // 'public/js/loadMessageViewModel.js',
                        // 'public/js/socketListener.js',
                        // 'public/js/page.js'
                           ],
                options: {
                    specs: 'tests/specs/client/createRoomSpec.js'
                }
            },
            new: {
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
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'node-spec',
                specFolders: ['tests/specs/server'],
                jUnit: {
                    report: true,
                    savePath : "./build/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            server: ['tests/specs/server'],
            all: ['tests/specs/server/']
        },
        jade: {
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: {
                    "public/Index.html": ["public/templates/Index.jade"]
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
                    //external: ['public/js/**/*.js'],
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
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/css/dest',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['public/templates/*.jade'],
                tasks: ['jade'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['public/css/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint:all', 'jasmine_node:server', 'jade', 'browserify', 'uglify']);
    grunt.registerTask('notest', ['jshint:all', 'jade', 'browserify', 'uglify', 'cssmin']);
    grunt.registerTask('toprod', ['jade', 'browserify', 'uglify', 'cssmin']);
    grunt.registerTask('newTest', ['browserify', 'jasmine:new']);
};