const { nav, sidebar } = require('./config/nav')

module.exports = {
  title: 'Git Handbook',
  description:
    'Git 是一个分布式版本管理软件，许多著名的软件都在使用 Git 进行管理，手册则旨在对它的常用功能和使用场景进行介绍。',
  lang: 'zh-CN',
  // 文档头部
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.png',
        type: 'image/x-icon'
      }
    ]
  ],
  // 主题配置
  themeConfig: {
    logo: '/logo.png',
    // 导航
    nav,
    sidebar
  }
}
