# Init

创建一个空的 Git 存储库或重新初始化现有的 Git 存储库。

## 概要

```bash
git init [-q | --quiet] [--bare] [--template=<template_directory>]
          [--separate-git-dir <git dir>] [--object-format=<format>]
          [-b <branch-name> | --initial-branch=<branch-name>]
          [--shared[=<permissions>]] [directory]
```

## 描述

此命令创建一个空的 Git 存储库：基本上是一个 `.git` 目录，其中包含 objects、refs/heads、refs/tags 和模板文件的子目录，然后创建一个没有任何提交的初始分支。

如果设置了 `$GIT_DIR` 环境变量，那么它将为存储库的基础指定一个路径，而不是使用 `.git`。

如果对象存储目录是通过 `$GIT_OBJECT_DIRECTORY` 环境变量指定的，则会在下面创建 sha1 目录，否则将使用默认的 `$GIT_DIR/objects` 目录。

在现有存储库中运行 `git init` 是安全的。它不会覆盖已经存在的内容。重新运行 git init 的主要原因是为了获取新添加的模板（或者如果给出了 --separate-git-dir，则将存储库移动到另一个地方）。

## 选项

### 静默输出

选项：`--quiet` / `-q`。

仅打印错误和警告消息，所有其他输出将被抑制。

### 裸库

选项：`--bare`。

创建一个裸存储库，如果未设置 GIT_DIR 环境，则将其设置为当前工作目录。

```bash
git init --bare
```

### 指定对象哈希算法

选项：`--object-format=<format>`。

指定存储库的给定对象格式（哈希算法）。有效值为 sha1 和（如果启用）sha256，sha1 是默认值。

### 指定模板目录

选项：`--template=<template_directory>`。

指定将从中使用模板的目录。

### 分离工作区和存储库目录

选项：`--separate-git-dir=<git dir>`。

不要将存储库初始化为 `$GIT_DIR` 或 `./.git/` 目录，而是创建一个包含实际存储库路径的文本文件，该文件充当到存储库的 Git 符号链接。

如果这是重新初始化，则存储库将移动到指定路径。

```bash
$ pwd
/Users/Kisstar/workspace/project

$ git init --separate-git-dir ../project.git

$ cat .git
gitdir: /Users/Kisstar/workspace/project.git
```

### 指定初始化分支

选项：`-b <branch-name>` / `--initial-branch=<branch-name>`。

指定新创建存储库中的初始分支使用的名称。如果未指定，则返回默认名称（当前为 master，但将来可能会更改；可以通过 init.defaultBranch 配置变量自定义名称）。

### 指定共享

选项：`--shared[=(false|true|umask|group|all|world|everybody|0xxx)]`。

指定 Git 存储库要在多个用户之间共享。这允许属于同一组的用户推入该存储库。指定后将设置配置变量“core.sharedepository”，以便使用请求的权限创建 `$GIT_DIR` 下的文件和目录。未指定时，Git 将使用 umask 报告的权限。

该选项可以具有以下值，如果未给定值，则默认为 group：

- `umask` (or false)：使用 umask 报告的权限，这也是未指定 `--shared` 时的默认值。
- `group` (or true)：使存储库组可写（和 g+sx，因为 git 组可能不是所有用户的主要组）。这用于解除其他安全 umask 值的权限。请注意，umask 仍适用于其他权限位（例如，如果 umask 为 0022，则使用组不会从其他（非组）用户删除读取权限）。
- `all` (or world or everybody)：与组相同，但使存储库可供所有用户阅读。
- `0xxx`：0xxx 是一个八进制数，每个文件将具有模式 0xxx。0xxx 将覆盖用户的 umask 值（并且不仅像 group 和 all 那样放松权限）。0640 将创建一个存储库，该存储库是组可读的，但不是组可写的或其他人可访问的。0660 将创建一个对当前用户和组可读写但对其他用户和组不可访问的回购。

默认情况下，在共享存储库中启用了配置标志 `receive.denynonfastfrowards`，因此您无法强制非快进推送。

如果您提供一个目录，则该命令将在其中运行。如果此目录不存在，将创建它。

## 模板目录

模板目录中名称不以点开头的文件和目录将在创建后复制到 `$GIT_DIR` 目录。

模板目录将是以下目录之一（按顺序）：

- 通过 `--template` 选项指定的参数；
- 环境变量 GIT_TEMPLATE_DIR 的值；
- 配置变量 `init.templateDir` 的值；
- 默认的模板目录：`/usr/share/git-core/templates`。

默认模板目录包括一些目录结构、建议的“exclude patterns”和示例钩子文件。

默认情况下，示例挂钩都处于禁用状态。要启用其中一个示例挂钩，请通过删除其 `.sample` 后缀对其进行重命名。
