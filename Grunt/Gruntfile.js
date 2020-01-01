module.exports = function(grunt) {
  //grunt任务配置插件信息
  grunt.initConfig({
    //获取package.json的信息
    pkg: grunt.fil.readJSON('package.json'),
    //清理文件和文件夹插件
    clean: {
      build : ['.tmp', 'build'],
      release : ['release']
    },
    //压缩js插件
    uglify : {
      options : {
          banner : '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build : {
          src : 'src/<%=pkg.file %>.js',
          dest : 'dest/<%= pkg.file %>.min.js'
      }
    },
    //合并文件插件
    concat : {
      options : {
          separator : ';'
      },
      dist : {
          src : ['src/zepto.js', 'src/underscore.js', 'src/backbone.js'],
          dest : 'dest/libs.js'
      }
    }
    //另外还有其他好用的插件
    /* 
    grunt-contrib-copy：复制文件和文件夹。
    grunt-contrib-cssmin：CSS文件压缩。
    grunt-contrib-imagemin：图片压缩。
    grunt-usemin：Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
    grunt-contrib-htmlmin：压缩html
    */
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //使用clean插件
  grunt.loadNpmTasks('grunt-contrib-clean');
  //当输入grunt需要做什么
  grunt.registerTask('default', ['clean','uglify','concat']);
}