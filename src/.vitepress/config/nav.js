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
      text: 'Setup and Config',
      children: [
        {
          text: 'git',
          link: '/commands/setup-config/git'
        },
        {
          text: 'config',
          link: '/commands/setup-config/config'
        }
      ]
    },
    {
      text: 'Getting and Creating Projects',
      children: [
        {
          text: 'init',
          link: '/commands/getting-and-creating-projects/init'
        }
      ]
    }
  ]
}
