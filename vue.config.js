module.exports = ({
  devServer: {
    host: 'localhost',
    port: 3000,     // 服务启动端口
    open: true,     // 服务启打开默认浏览器
  },
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title = '电商ERP管理系统';
          return args;
        })
  }
})
