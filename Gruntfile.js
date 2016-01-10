/**
 * Grunt taskfiles
 *
 */
module.exports = function (grunt) {
    grunt.initConfig({
        // concat files
        concat: {
            js: {
                src: [
                    'src/Namespace.js',                         // Namespace
                    'src/Consts.js',                            // Consts class
                    'src/Settings.js',                          // Settings class
                    'src/Palette.js',                           // Class to manage palette
                    'src/Music.js',                             // Class to music

                    // scenes
                    'src/scenes/IntroScene.js',                 // intro scene class
                    'src/scenes/GameScene.js',                  // game scene class

                    'src/PythonApp.js'                          // main app
                ],
                dest: 'dist/python.js'
            }
        },

        // uglify
        uglify: {
            dist: {
                src: ['<%= concat.js.dest %>'],
                dest: 'dist/python.min.js'
            },
            options : {
                banner : '/** pythonApp (c) twitter@r0mk1n, 2016 */\n'
            }
        },

        // checking syntax
        jshint: {
            files: [/*'Gruntfile.js',*/ 'dist/python.js']
        }
    });

    // loading
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    var operations = ['concat', 'uglify', 'jshint' ];

    // default tasks list
    grunt.registerTask('default', operations );
};