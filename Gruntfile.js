var fs = require('fs');
module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        'concat': {
            dev: {
                src: [
                    'src/start.js',
                    'lib/es5.isarray.js',
                    'src/vertex.js',
                    'src/intersection.js',
                    'src/polygon.js',
                    'src/driver.leaflet.js',
                    'src/end.js'
                ],
                dest: 'dist/greiner-hormann.leaflet.js'
            }
        },

        'less': {
            dev: {
                options: {
                    compress: false
                },
                files: {
                    './demo/css/styles.css': './src/less/styles.less',
                    './demo/css/base.css': './src/less/base.less',
                    './demo/css/ie8.css': './src/less/ie8.less'
                }
            }
        },

        'watch': {
            less: {
                files: './src/less/*.less',
                tasks: ['less:dev'],
                nospawn: true
            },
            js: {
                files: './src/*.js',
                tasks: ['concat:dev']
            }
        },

        'copy': {
            leaflet: {
                files: [{
                    expand: true,
                    src: ['**'],
                    cwd: './node_modules/leaflet/dist/',
                    dest: './test/lib/leaflet/'
                }, {
                    expand: true,
                    src: ['**'],
                    cwd: './node_modules/leaflet-draw/dist/',
                    dest: './test/lib/leaflet-draw/'
                }]
            }
        },

        'connect': {
            local: {
                options: {
                    port: 8888,
                    livereload: true,
                    base: '.'
                }
            }
        }
    });

    grunt.registerTask('dev', [
        'copy:leaflet',
        'watch:js'
    ]);

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

};
