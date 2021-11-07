# Git

作为顶级的命令，在使用任何一个 Git 提供的命令时都会以此开头，通过它你可以查看或设置 Git 的相关信息。

## 选项

### 版本号

选项：`--version`。

打印 Git 程序的版本号。

```bash
$ git --version
git version 2.29.2
```

### 帮助信息

选项：`--help`。

打印概要和最常用命令的列表。如果给出了选项 `——all` 或 `-a`，那么将打印所有可用的命令。如果指定了子命令，那么将打印子命令的使用手册。

```bash
git --help config # 等价于 git help config
```

### 工作目录

选项：`-C <path>`

指定 Git 命令的工作目录。当给出多个 -C 选项时，每个后续的非绝对路径都会相对于前面的路径进行解释。如果指定了的路径存在但为空，例如 `-C ""`，则当前工作目录保持不变。

```bash
git -C ~/workspace/git-handbook status
```

此选项还会影响设置路径名的选项，如 `--git-dir` 和 `--work-tree`，因为它们对路径名的解释是相对于由 -C 选项指定的工作目录进行的。

### 配置参数

选项：`-c <name>=<value>`

向命令传递配置参数，给定的值将覆盖配置文件中的值。其中 `<name>` 的格式应该与 `git config` 中列出的格式相同(子键用点分隔)。

```bash
$ git config user.name
zhangsan
$ git -c user.name=lisi commit # 本次提交将会使用 lisi 替代设置的 zhangsan 作为用户名
```

设置时，省略等号后面的内容将会被解析为空字符串。如果直接连等号也省略掉的话，将会被解析为 true。

### 配置变量参数

选项：`--config-env=<name>=<envvar>`

与 `-c <name>=<value>` 类似，将会给配置变量 `<name>` 一个值，其中 `<envvar>` 是环境变量的名称。

需要注意的是，不支持直接将值设置为空字符串的快捷方式。相反，如果环境中不存在 `<envvar>`，则会出现错误。而且，`<envvar>` 不能包含等号以避免歧义。

### 执行路径

选项：`--exec-path[=<path>]`

指定 Git 到哪找它的子程序，这也可以通过设置 GIT_EXEC_PATH 环境变量来控制。如果没有指定路径，Git 将打印当前设置，然后退出。

```bash
$ git --exec-path
/usr/local/Cellar/git/2.29.2/libexec/git-core
```

### HTML 文档路径

选项：`--html-path`。

输出安装 Git HTML 文档的路径(不带斜杠)并退出。

### 手册路径

选项：`--man-path`。

输出此版本 Git 的手册页的手册路径并退出。

### 信息文件路径

选项：`--info-path`。

打印记录此版本 Git 的信息文件的安装路径并退出。

### 分页

选项：`--paginate` / `-p`。

如果标准输出是终端，则将所有输出导入 `less`（如果设置了 `$PAGER` 则使用该环境变量指定的值）。这将覆盖 `pager.<cmd>` 配置选项。

### 关闭分页

选项：`--no-pager` / `-P`。

不要将 Git 的输出管道输送到分页器中。

```bash
git -P log
```

### 存储库的路径

选项：`--git-dir=<path>`。

设置存储库（.git）的路径。这也可以通过设置环境变量 GIT_DIR 来控制。它可以是当前工作目录的绝对路径或相对路径。

如果这个没有设置， Git 会自动查找存储库：按照目录树逐层向上尝试查找带有“.git”子目录的目录，直到到达 `~` 或 `/`。

使用此选项（或 GIT_DIR 环境变量）指定“.git”目录的位置后将关闭存储库查找。如果您不在工作树的顶级目录下，那么应该通过指定工作树的路径来告诉 Git 工作树的顶级目录在哪里。

```bash
# 如果你的存储库目录名为 example.git 而不是默认的 .git
git --git-dir=example.git status
```

### 工作树的路径

选项：`--work-tree=<path>`。

设置工作树的路径（当前工作目录）。它可以是绝对路径，也可以是相对于当前工作目录的路径。这也可以通过设置环境变量 GIT_WORK_TREE 和 `core.worktree` 配置变量来控制。

通常我们的存储库目录就是在工作目录下的 `.git` 目录，通过该配置项结合上面的存储库设置，我们的存储库和工作目录可以在不同的位置。

### 命名空间

选项：`--namespace=<path>`。

设置 Git 命名空间，相当于设置 GIT_NAMESPACE 环境变量。

### 前缀

选项：`--super-prefix=<path>`。

设置一个前缀（目前仅供内部使用），该前缀提供从存储库上方到其根目录的路径。一个用途是给出调用它的超级项目的子模块上下文。

### 裸存储库

选项：`--bare`。

将存储库视为裸存储库。如果未设置 GIT_DIR 环境变量，则将其设置为当前工作目录。

```bash
# 初始化为一个裸仓库
git init --bare
```

裸仓库只保存 Git 历史提交的版本信息，而不允许用户在上面进行任何操作。通常，远程仓库会采用裸仓库。

### 禁止替换对象

选项：`--no-replace-objects`。

不要使用替换参考来替换 Git 对象。

### 关闭路径通配符和字面路径

选项：`--literal-pathspecs`。

按字面意思对待 pathspecs（指你在 Git 中如何指定路径），这相当于将 GIT_LITERAL_PATHSPECS 环境变量设置为 1，此时通配符将不能用，前缀覆盖也不能用。。

### 路径通配符

选项：`--glob-pathspecs`。

将“glob”模式应用在 pathspecs（默认的）。这相当于将 GIT_GLOB_PATHSPECS 环境变量设置为 1。

```bash
$ ll
*.txt
a.txt
b.c.txt
# 下面的命令将会把以上三个文件都添加到暂存区中
$ git add *.txt
```

### 字面路径

选项：`--noglob-pathspecs`。

意思是 `*.c` 只会匹配文件名是 `*.c` 的文件，而不是以 `.c` 结尾的文件。

### 忽略路径大小写

选项：`--icase-pathspecs`。

忽略路径的大小写。

```bash
# 此命令并不会添加以大写的 A 为名的文件
git add a
# 忽略大小写之后就可以了
git --icase-pathspecs add a
```

### 关闭锁定的可选操作

选项：`--no-optional-locks`。

不要执行需要锁定的可选操作。这相当于将环境变量 GIT_OPTIONAL_LOCKS 设置为 0。

## 配置机制

Git 使用简单的文本格式存储每个存储库和每个用户的定制。这样的配置文件可能如下所示：

```txt
#
# A '#' or ';' character indicates a comment.
#

; core variables
[core]
        ; Don't trust file modes
        filemode = false

; user identity
[user]
        name = "Junio C Hamano"
        email = "gitster@pobox.com"
```

使用时，Git 会从配置文件中读取各种命令，并相应地调整其操作。
