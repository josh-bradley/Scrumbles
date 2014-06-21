module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['gruntfile.js', 'public/js/*.js', 'tests/specs/**/*.js', 'server/*.js'],
            options: {ignores: ['public/js/jquery.*']}
        },

        csslint: {
            all: {
                src:['public/css/main.css']
            }
        },
        jasmine: {
            all: {
                src: ['public/lib/underscore.js',
                        'tests/lib/sinon.js',
                        'public/lib/knockout.js',
                        'public/lib/underscore.js',
                        'public/lib/knockout.validation.min.js',
                        'tests/helpers/sinonExtentions.js',
                        'tests/helpers/serverCalls',
                        'tests/helpers/clientSideMocks.js',
                        'tests/helpers/clientTestHelper.js',
                        'public/js/socketManager.js',

                        'tests/helpers/socket.io.fake.js',

                    'public/js/service/*.js',
                        'public/js/joinRoomViewModel.js',
                        'public/js/room.js',
                        'public/js/pageStatus.js',
                    'public/js/player.js',
                        'public/js/players.js',
                        'public/js/loadMessageViewModel.js',
                        'public/js/socketListener.js',
                        'public/js/page.js'],
                options: {
                    specs: 'tests/specs/client/*.js'
                }
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec',
                jUnit: {
                    report: true,
                    savePath : "./build/reports/jasmine/",
                    useDotNotation: true,
                    consolidate: true
                }
            },
            all: ['tests/specs/server/']
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    // Default task(s).
    grunt.registerTask('default', ['jshint:all', 'jasmine', 'jasmine_node']);
};