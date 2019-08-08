# 字符串变量

- [获取字符串长度](#获取字符串长度)
- [提取子字符串](#提取子字符串)
- [索引](#索引)

<hr/>

字符串是 Shell 编程中最常用最有用的数据类型，字符串可以用单引号，也可以用双引号，也可以不用引号。虽然单引号和双引号都可以表示一个字符串，但是在使用上还存在一些不同。

单引号的限制:
+ 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的；
+ 单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用。

在字符串定义上，尽量使用双引号不要使用单引号。

#### 获取字符串长度

使用 `${#<string>}` 获取字符串长度，其中 `<string>` 为字符串。

```sh
your_name='abcdefg'
len=${#your_name}
echo ${len}
```

#### 提取子字符串

提取子字符串使用 `${<string>:<startIndex>:<offset>}` 从 string 的 startIndex 位置开始提取 offset 个字符返回。其中 `<string>` 为被提取的字符串;`<startIndex>` 为提取开始位置，字符串的第一个字符下标为 0; `<offset>` 为提取个数，包括开始位置的那个字符串。

```sh
your_name='abcdefg'
subStr=${your_name:1:2}
echo ${subStr}
```

#### 索引

使用 `expr index <string> <substr>` 查询 string 中第一次匹配到 substr 的下标。如果没有找到返回 0

```sh
your_name='abcdefg'
subStr='c'
echo `expr index $your_name $subStr`
```