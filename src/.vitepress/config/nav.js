exports.nav = [
  {
    text: '基础概念',
    activeMatch: `^/concept/`,
    link: '/concept/'
  },
  {
    text: '命令集',
    activeMatch: `^/commands/`,
    link: '/commands/'
  },
  {
    text: '应用场景',
    activeMatch: `^/use-case/`,
    link: '/use-case/'
  },
  {
    text: '进阶',
    activeMatch: `^/advance/`,
    link: '/advance/'
  },
  {
    text: 'GitHub',
    link: 'https://github.com/kisstar/git-handbook/',
    target: '_blank',
    rel: 'noopener noreferrer'
  }
]

exports.sidebar = {
  '/commands/': [
    {
      text: 'Basics',
      children: [{ text: 'Config', link: '/commands/basics/config' }]
    }
  ]
}
