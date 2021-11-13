# Config

您可以使用此命令查询/设置/替换/取消设置选项。名称实际上是由点分隔的节（section）和键（key）组成（如 user.name），对应的值将会被转义。

## 概要

```bash
git config [<file-option>] [--type=<type>] [--show-origin] [--show-scope] [-z|--null] name [value [value_regex]]
git config [<file-option>] [--type=<type>] --add name value
git config [<file-option>] [--type=<type>] --replace-all name value [value_regex]
git config [<file-option>] [--type=<type>] [--show-origin] [--show-scope] [-z|--null] --get name [value_regex]
git config [<file-option>] [--type=<type>] [--show-origin] [--show-scope] [-z|--null] --get-all name [value_regex]
git config [<file-option>] [--type=<type>] [--show-origin] [--show-scope] [-z|--null] [--name-only] --get-regexp name_regex [value_regex]
git config [<file-option>] [--type=<type>] [-z|--null] --get-urlmatch name URL
git config [<file-option>] --unset name [value_regex]
git config [<file-option>] --unset-all name [value_regex]
git config [<file-option>] --rename-section old_name new_name
git config [<file-option>] --remove-section name
git config [<file-option>] [--show-origin] [--show-scope] [-z|--null] [--name-only] -l | --list
git config [<file-option>] --get-color name [default]
git config [<file-option>] --get-colorbool name [stdout-is-tty]
git config [<file-option>] -e | --edit
```

## 描述

Git 的配置主要分为三级：存储库、全局和系统，在设置和获取时你可以通过 `--local`，`--global` 和 `--system` 选项进行指定，并且所有的配置都会写入到了文件中，分别对应为 `.git/config`，`~/.gitconfig` 和 `/etc/gitconfig`。

当你省略指定范围的参数时，默认是对存储库的配置进行修改和查询。配置离用户工作目录越近优先级越低，所以存储库的配置变量会覆盖全局的配置，而系统级配置的优先级是最低的。

### 语法

配置文件由节和变量组成，每个变量必须属于某个节。节从方括号中的节名称开始，一直持续到下一节开始。其中节名称不区分大小写。仅字母数字字符，`-` 和 `.` 允许在节名称中使用。

各节可进一步分为小节。要开始一个小节，请将其名称用双引号引起来，并在小节标题中用空格分隔，如下例所示：

```txt
[section "subsection"]
```

子节名称区分大小写，可以包含除换行符和空字节以外的任何字符，其中双引号和反斜杠可以通过反斜杠进行转义，读取时删除其他字符前面的反斜杠。

还有一种不推荐使用的 `[section.subsection]` 语法。使用此语法，子节名称将转换为小写，并区分大小写进行比较。这些子节名称遵循与节名称相同的限制。

所有其他行（以及节标题后的行的其余部分）都被识别为设置变量，形式为 `name=value`（或简称 name，表示变量为布尔“true”）。

在 Git 配置中，每个变量分为多个部分，其中变量本身的完全限定变量名是最后一个点分隔的后面部分，而 section 名称则是最后一个点之前的所有内容。

<img src="/images/config-format.png">

变量名不区分大小写，只允许字母数字字符和 `-`，并且必须以字母字符开头。有些变量可能出现多次，然后我们说变量是多值的。

定义值的行可以通过以反斜杠结束来继续到下一行；反引号和行尾被剥离。

配置格式 `name=` 后的空格和注释字符 `＃` 或 `;` 所在行都会被忽略，除非它们用双引号括起来。值中的内部空格逐字保留。

### 引用配置文件

通过 `include` 可以在一个配置文件中引用另一个配置文件，指定文件的内容将会被立刻载入，就好像它们引用的位置找到一样。

```bash
$ tree -a -L 2
.
├── .git
│   ├── ...
│   └── config
└── config.gitconfig

# 相对路径被认为是相对于包含 include 指令的配置文件的路径。
$ git config include.path ../config.gitconfig

$ cat config.gitconfig
[user]
    name = Kisstar

$ git config user.name
Kisstar
```

除此之外，您还可以通过将 `includeIf.<condition>.path` 变量有条件地包含另一个配置文件。条件以关键字后跟冒号开头，一些数据的格式和含义取决于关键字。

支持的关键字包括 `gitdir`，紧跟后面的数据用作 Glob 模式，与其类似的 `gitdir/i` 会忽略大小写。如果 `.git` 目录的位置与模式匹配，则满足包含条件。

存储库位置可以自动发现，也可以来自 `$GIT_DIR` 环境变量。如果通过 `.git` 文件自动发现存储库，则 `.git` 位置将是 `.git` 目录所在的最终位置。

```txt
# include if $GIT_DIR is /path/to/foo/.git
[includeIf "gitdir:/path/to/foo/.git"]
    path = ../config.gitconfig
```

在 Glob 模式中可以包含标准的通配符和另外两个可以匹配多个路径组件的 `**/` 和 `/**`。

- 如果模式不以 `~/`，`./` 或 `/` 开始，则 `**/` 将自动添加前置。例如，模式 foo/bar 变为 `**/foo/bar` 并与 /any/path/to/foo/bar 匹配。
- 如果模式以 `/` 结束，则会自动添加 `**`。例如，模式 foo/ 变为 `foo/**`。换句话说，它以递归方式匹配“foo”和内部的所有内容。

## 选项

### 替换多行

选项：`--replace-all`。

默认行为是最多替换一行，它将会替换与键匹配的所有行（以及有可选的 value_regex）。

```bash
$ cat .git/config
[user]
        name = Kisstar1
        name = Kisstar2
        name = Sharon

$ git config --replace-all user.name Kisstar "^K"

$ cat .git/config
[user]
        name = Kisstar
        name = Sharon
```

### 追加

选项：`--add`。

在对同一个变量设置值时默认会进行覆盖，通过该选项则可以继续追加新的值，这与在 `--replace-all` 中以 `^$` 作为 value-pattern 的值相同。

```bash
$ git config user.name Kisstar
$ git config --add user.name Sharon
$ cat .git/config
[user]
        name = Kisstar
        name = Sharon
```

### 获取给定键的值

选项：`--get`。

获取给定键的值（可选择通过与值匹配的正则表达式进行过滤）。如果未找到对应键值，则返回错误状态码 1；如果找到多个键值对，则返回最后一个值。

```bash
$ cat .git/config
[user]
        name = Kisstar
        name = Sharon

$ git config --get user.name "^K"
Kisstar
```

### 获取给定键的所有值

选项：`--get-all`。

与 `--get` 类似，但会返回给定键的所有值（会包括全局和系统，以及引入的其它配置文件中的配置）。

### 获取与正则表达式匹配的键的值

选项：`--get-regexp`。

与 `--get-all` 类似，输出所有与正则表达式匹配的键的键值对。正则表达式匹配目前区分大小写，并且针对键的规范化版本完成，其中节和变量名称是小写的，但子节名称不是。

```bash
$ cat .git/config
[section-value]
        a = b
[c]
        var-value = d
[e]
        f = value

$ git config --get-regexp value
section-value.a b
c.var-value d
```

### 获取与 URL 最匹配的值

选项：`--get-urlmatch name URL`。

如果给出了一个由两部分（section.key）组成的配置项名称，则返回与 URL 最匹配的值（如果不存在此配置名，则 section.key 的值用作回退）。如果仅将输入 section，则返回所有与 section 匹配的键值对。如果未找到值，则返回错误代码 1。

```bash
$ cat .git/config
[http]
        proxy = http://agent.example.com:8080
[http "https://coding.com"]
        proxy = http://proxy.example.com:8080

$ git config --get-urlmatch http.proxy https://coding.com
```

### 全局配置

选项：`--global`。

通过此选项设置或获取全局配置。如果全局配置文件不存在而 `$XDG_CONFIG_HOME/git/config` 文件存在，则写入该文件，读取时也会读取此文件。

### 系统配置

选项：`--system`。

读取或设置系统配置 `$(prefix)/etc/gitconfig` 文件。

### 存储库配置

选项：`--local`。

读取或设置存储库配置 `.git/config` 文件，这也是默认的行为。

### 工作树配置

选项：`--worktree`。

如果 `extensions.worktreeConfig` 存在，则读取或写入配置到 `.git/config.worktree` 中。如果不存在，它与 `--local` 效果相同。

### 指定配置文件

选项：`--file` / `-f`。

使用给定的配置文件，而不是 GIT_CONFIG 指定的配置文件。

```bash
$ cat config.gitconfig
[user]
    name = Kisstar

# 相对路径以执行命令的目录为基准
$ git config -f config.gitconfig user.name
Kisstar
```

### 指定 blob 文件

选项：`--blob`。

与 `--file` 类似，但给定是 `blob` 路径而不是文件路径。例如，您可以使用 `master:.gitmodules`，从 `master` 分支中的文件 `.gitmodules` 中读取配置值。

### 移除配置项

选项：`--remove-section`。

```bash
# 只能指定节和子节，不能包含变量名
git config --remove-section user
```

### 重命名配置项

选项：`--rename-section`。

重命名指定的配置项。

```bash
git config --rename-section user.name user.email
```

### 移除指定配置

选项：`--unset`。

从配置文件中删除与给定键匹配的行。

```bash
# 必须包含变量名，只给定一个节会报错，匹配上节和字节什么也不做
git config --unset user.name
```

### 移除所有匹配配置

选项：`--unset-all`。

与 `--unset` 类似，但会移除所有与给定键匹配的行。

```bash
git config --unset-all user.name
```

### 列出所有配置

选项：`--list` / `-l`。

列出配置文件（包括系统和全局的）中设置的所有变量及其值。

```bash
git config -l
```

### 定值

选项：`--fixed-value`。

在使用 value-pattern 时添加此选项将会让 value-pattern 表现得像一个普通字符串而不是正则表达式。

### 指定类型

选项：`--type <type>`。

确保任何输入或输出在给定类型约束下都是有效的，并最终以 `<type>` 的规范形式规范化输出值。合法的 `<type>` 包括：

- bool（--bool）: 将值规范化为“true”或“false”。
- int（--int）: 将值规范化为简单的十进制数。
- bool-or-int（--bool-or-int）: 如上所述，根据 bool 或 int 规范化。
- path（--path）: 通过以规范化的形式，在值前添加前缀 `~` 来指向用户的家目录。设置值时，此说明符无效。
- expiry-date（--expiry-date）: 通过以规范化的形式，将固定或相对固定的日期字符串转换为时间戳。设置值时，此说明符无效。
- color: 获取值时，通过转换为 ANSI 颜色转义序列进行规范化。设置值时，将执行完整性检查以确保给定值可以作为 ANSI 颜色进行规范化，但它按原样编写。

### 取消类型规范

选项：`--no-type`。

取消设置先前设置的类型说明符（如果先前已设置）。

```bash
$ cat .git/config
[user]
        name =

$ git config --bool user.name
false

# 空字符，不会被转换为 bool 值
$ git config --bool --no-type user.name
```

### 使用空字符替代结束的换行符

选项：`--null` / `-z`。

对于所有输出值或键的选项，始终使用 null 字符（而不是换行符）作为结束值。

```bash
$ cat .git/config
[user]
        name = Kisstar
        name = Sharon

$ git config --get-all --null user.name
Kisstar^@Sharon^@
```

### 仅输出配置变量名称

选项：`--name-only`。

仅输出 `--list` 或 `--get-regexp` 的配置变量名称。

```bash
$ git config --list --name-only
user.name
# ...
```

### 显示配置来源

选项：`--show-origin`。

### 显示配置作用域

选项：`--show-scope`。

### 查找名称的颜色设置

选项：`--get-colorbool name [stdout-is-tty]`。

查找名称的颜色设置（例如，color.diff）并输出“true”或“false”。stdout is tty 应该是“true”或“false”，并且在配置显示“auto”时将其考虑在内。

如果 stdout 为 tty，则检查命令本身的标准输出，如果要使用颜色，则以状态 0 退出，否则以状态 1 退出。当名称的颜色设置未定义时，该命令使用 `color.ui` 作为回退。

### 找到为名称配置的颜色

选项：`--get-color name [default]`。

找到为名称配置的颜色（例如 color.diff.new），并将其作为 ANSI 颜色转义序列输出到标准输出。如果没有为名称配置颜色，则使用可选的默认参数。

`--type=color [--default=<default>]` 优先于 `--get-color`（但请注意 --get-color 将省略 --type=color 打印的尾随换行符）。

### 编辑配置文件

选项：`--edit` / `-e`。

打开编辑器以修改指定的配置文件；系统、全局或存储库（默认）。

### 开启或关闭 include 指令

选项：`--[no-]includes`。

当查找所有的配置文件时该指令默认是开启的，当在指定文件（如 --file, --global 等）中查找时默认是关闭的。

```bash
$ cat .git/config
[include]
        path = ../config.gitconfig

$ cat config.gitconfig
[user]
    name = Kisstar

$ git config user.name
Kisstar

# 指定文件（这里是存储库的配置）后，将关闭 includes 指令，所以不会有输出
$ git config --local user.name

$ git config --local --includes user.name
Kisstar
```

### 添加缺省值

选项：`--default <value>`。

使用 `--get` 时，如果找不到请求的变量，就返回默认值，其行为就像 `<value>` 是赋给该变量的值。

```bash
$ git config user.nothing

$ git config --default Kisstar user.nothing
Kisstar
```

## 变量
