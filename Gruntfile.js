module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    htmllint: {
      all: ["*.html"]
    },

    watch: {
      css: {
        files: '**/*.html',
        tasks: ['htmllint']
      }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-html');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
