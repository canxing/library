# Shell 基础

> Shell 脚本的第一行用于指定该脚本用什么解释器执行。通过命令 `cat /etb/shells` 可以查看当前系统安装了哪些解释器，
> 然后在脚本第一行输入 `#! /bin/bash` 指定解释器，`/bin/bash` 是通过查看 `/etc/shells` 文件得到的，不同的机器上可能有不同的脚本

- [变量](#变量)
    - [定义变量](#定义变量)
    - [使用变量](#使用变量)
    - [只读变量](#只读变量)
    - [删除变量](#删除变量)
    - [变量类型](#变量类型)
    - [字符串变量](#字符串变量)
        - [获取字符串长度](#获取字符串长度)
        - [提取子字符串](#提取子字符串)
    - [数组变量](#数组变量)
- [传递参数](#传递参数)
- [运算符](#运算符)
    - [算数运算符](#算数运算符)
    - [关系运算符](#关系运算符)
    - [布尔运算符](#布尔运算符)
    - [逻辑运算符](#逻辑运算符)
    - [字符串运算符](#字符串运算符)
    - [文件测试运算符](#文件测试运算符)
- [控制流](#控制流)
    - [if-else](#if-else)
    - [for](#for)
    - [while](#while)
    - [until](#until)
- [函数](#函数)

## 变量

### 定义变量

在 Shell 中定义变量，不需要指定变量类型，也不需要修饰变量。直接使用 `变量名=值` 的形式即可对变量进行赋值。

```sh
your_name="canxinglook.cn"
```

*** 和其他编程语言不同的是，Shell 定义变量时，= 左右两边不能有空格 ***

### 使用变量

要使用一个定义过的变量，只要在变量前加 `$` 即可。

```sh
echo $your_name
echo "i am $your_name"
echo i am $your_name

echo ${your_name}
echo i am ${your_name}
echo "i am${your_name}"
```

变量名称外可以加花括号，加不加都行，但是在某些情况下，需要加花括号对变量边界加以限制

> 为了保持统一，建议使用变量都加上花括号

### 只读变量

Shell 提供了 `readonly` 关键字将一个变量声明为只读变量，声明之后的变量值将不能在改变。

### 删除变量

Shell 使用 `unset` 关键字删除一个变量，`unset` 关键字不能删除只读变量。删除之后的变量可以重新赋值。

```sh
your_name="canxinglook.cn"
echo $your_name
unset your_name
echo ${your_name}
your_name="tom"
echo ${your_name}
```

### 变量类型

运行 Shell 时，会存在三种变量:

1. 局部变量: 在脚本或命令中定义，仅在当前 Shell 实例中有效，其他 Shell 启动的程序不能访问
2. 环境变量: 所有程序，包括 Shell 启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。
3. Shell 变量: Shell 变量是由 Shell 程序设置的特殊变量。Shell 变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了 Shell 的正常运行。

### 字符串变量

字符串是 Shell 编程中最常用最有用的数据类型，字符串可以用单引号，也可以用双引号，也可以不用引号。虽然单引号和双引号都可以表示一个字符串，但是在使用上还存在一些不同。

单引号的限制:
+ 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的；
+ 单引号字串中不能出现单独一个的单引号（对单引号使用转义符后也不行），但可成对出现，作为字符串拼接使用。

在字符串定义上，尽量使用双引号不要使用单引号。

#### 获取字符串长度

使用 

```sh
${#<string>} 
```

即可获取字符串长度，其中 `<string>` 为字符串。

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

### 数组变量

Shell 中定义一个数组可以使用下面三种方式。

```sh
array_name=("abc" "defg" "1234")

array_name=(
"111"
"222"
"333"
)

array_name=()
array_name[0]="aaaaa"
array_name[1]="bbbbbb"
array_name[2]="ccccc"
array_name[3]="ddddddd"
```

Shell 使用一对括号 `()` 来定义一个数组，数组中的每个元素使用空格分割。数组元素下标由 0 开始编号。获取数组中的元素要利用下标，下标可以是整数或表达式，其值应该大于或等于 0。

获取数组元素使用 `{<array-name>[<index>]}`，其中 `<array-name>` 为一个数组变量，`<index>` 表示数组下标。

```sh
array_name=("aaaaaa", "bbbbb" "cccccc" "ddddddddd")
echo ${array_name[0]}
echo ${array_name[2]}
```

获取数组中的所有元素使用 `{<array-name>[@]}` 或者 `{<array-name>[*]}`

```sh
array_name=("aaaaaa", "bbbbb" "cccccc" "ddddddddd")
echo ${array_name[@]}
echo ${array_name[*]}
```

#### 获取数组长度

获取数组长度使用

```sh
${#<array-name>[@]}
${#<array-name>[*]}
```

其中 `<array-name>` 为数组变量

```sh
array_name=("aaaaaa", "bbbbb" "cccccc" "ddddddddd")
length=${#array_name[@]}
len=${#array_name[*]}
echo ${length}
echo ${len}
```

## 传递参数

在执行 Shell 脚本时，可以向脚本传递参数，脚本内获取参数的方式为 `$n`，n 代表一个数字，1 为执行脚本的第一个参数，2 为执行脚本的第二个参数，0 为执行脚本的名称。

```sh
echo "执行脚本的名称为 $0"
echo "执行脚本的第一个参数为 $1"
echo "执行脚本的第二个参数为 $2"
echo "执行脚本的第三个参数为 $3"
```

执行脚本命令 `./test 1 2 3`

输出为

```
执行脚本的名称为 ./test.sh
执行脚本的第一个参数为 1
执行脚本的第二个参数为 2
执行脚本的第三个参数为 3
```

另外 Shell 还有几个特殊字符用来处理参数

参数说明 | 说明
--- | ---
`$#` | 传递到脚本的参数个数
$* | 以一个单字符串显示所有向脚本传递的参数
$$ | 脚本运行的当前进程 ID
$! | 后台运行的最后一个进程的 ID
$@ | 与 `$*` 相同，但是使用时加引号，并在引号中返回每个参数。
$- | 现实 Shell 使用的当前选项，与 set 命令相同
$? | 显示最后命令的退出状态，0 表示没有错误，其他任何值表示有错误。

## 运算符

### 算数运算符

Shell 不支持原生的数学运算，但是可以通过其他命令来实现，最常用的就是 `expr`

运算符 | 说明
--- | ---
`expr $a + $b` | 加法运算
`expr $a - $b` | 减法运算
`expr $a \* $b` | 乘法运算
`expr $a / $b` | 除法运算
`expr $a % %b` | 取余运算

### 关系运算符

关系运算符只支持数字，不支持字符串，除非字符串的值是数字

运算符 | 说明 | 实例
--- | --- | ---
-eq | 相等返回 true，不相等返回 false | `[ $a -eq $b ]`
-ne | 不相等返回 true，相等返回 false | `[ $a -ne $b ]`
-gt | 大于返回 true，不大于返回 false | `[ $a -gt $b ]`
-lt | 小于返回 true，不小于返回 false | `[ $a -lt $b ]`
-ge | 大于等于返回 true，小于返回 false | `[ $a -ge $b ]`
-le | 小于等于返回 true，大于返回 false | `[ $a -le $b ]`

### 布尔运算符

运算符 | 说明 | 实例
--- | --- | ---
! | 非运算 | `[ !false ]`
-o | 或运算 | `[ $a -lt 200 -o $b -ge 10 ]`
-a | 与运算 | `[ $a -lt 200 -a $b -ge 10 ]`

### 逻辑运算符

运算符 | 说明 | 实例
--- | --- | ---
&& | and | `[[ $a -lt 200 && $b -ge 10 ]]`
_||_ | or | `[[ $a -lt 200 || $b -ge 10 ]]`

### 字符串运算符

运算符 | 说明 | 实例
--- | --- | ---
= | 相等返回 true，不相等返回 false | `[ $a = $b ]`
!= | 不相等返回 true，相等返回 false | `[ $a != $b ]`
-z | 字符串长度为 0 返回 true，不为 0 返回 false | `[ -z $a ]`
-n | 字符串长度不为 0 返回 true，为 0 返回 false | `[ -n $a ]`
str | 字符串不为空返回 true | `[ $a ]`

### 文件测试运算符

操作符 | 说明 |	举例
--- | --- | ---
-b  | 如果文件是块设备文件，返回 true。 | `[ -b $file ]` 返回 false。
-c  | 如果文件是字符设备文件，返回 true。 | `[ -c $file ]` 返回 false。
-d  | 如果文件是目录，返回 true。 | `[ -d $file ]` 返回 false。
-f  | 如果文件是普通文件，返回 true。 |	`[ -f $file ]` 返回 true。
-g  | 如果文件设置了SGID 位，返回 true。 `| [ -g $file ]` 返回 false。
-k  | 如果文件设置了粘着位，返回 true。 | `[ -k $file ]` 返回 false。
-p  | 如果文件是有名管道，返回 true。 |	`[ -p $file ]` 返回 false。
-u  | 如果文件设置了 SUID 位，返回 true。 |	`[ -u $file ]` 返回 false。
-r  | 如果文件可读，返回 true。 | `[ -r $file ]` 返回 true。
-w  | 如果文件可写，则返回 true。 | `[ -w $file ]` 返回 true。
-x  | 如果文件可执行，返回 true。 | `[ -x $file ]` 返回 true。
-s  | 如果文件不为空，返回 true。 | `[ -s $file ]` 返回 true。
-e  | 如果文件（包括目录）存在，返回 true。 | `[ -e $file ]` 返回 true。

## 控制流

> 和其他编程语言一样可以使用 break 和 continue 来跳出循环

### if-else

if 语句语法如下:

```sh
if condition1
then 
    command1
elif condition2
then
    command2
elif condition3
then
    command3
...
else
    command4
fi
```

if 语句以 `if condition1; then` 开始，`fi` 结束，`elif` 和 `else` 都是可选的。

### for

for 语句语法如下:

```sh
for <var> in item1 item2 item3 ... itemn
do
    command
done
```

遍历一个数组需要使用 `${array[@]}` 获取所有数组元素

```sh
array=('111' '222' '333')
for item in ${array[@]}
do
    echo ${item}
done
```

### while

while 语句语句如下:

```sh
while condition
do 
    command
done
```

实例如下

```sh
i=1
while [[ $i -le 5 ]]
do
    echo $i
    i=`expr $i + 1`
done
```
### until

until 语句执行一些语句直到条件为 true 时停止

until 语法如下:

```sh
until condition
do
    command
done
```

### case

case 语句为多选择语句，类似其他语句中的 switch 语句。case 语句语法如下:

```sh
case <val> in 
    <val1>)
        command1
        ;;
    <val2>)
        command2
        ;;
    <val3>)
        command3
        ;;
        ...
        *)
        commandn
        ;;
esac
```

## 函数

定义函数的语法如下:

```sh
[function] funname [()] {
    command
    [return value;]
}
```

其中带有 `[]` 都是可选的

要调用函数直接使用函数名称即可。

```sh
function func () {
    read num
    case ${num} in 
        1) echo "你选择了 1"
            ;;
        *) echo "${num}"
            ;;
    esac
}

func
```

如果要传递参数到函数中，只需要在函数名称后加上参数即可

```sh
function func () {
    //command
}
func 1 2 3 4 5
```

要从函数内部获取传入的参数，需要借助几个特殊字符。

参数说明 | 说明
--- | ---
$# | 传递到脚本的参数个数
$* | 以一个单字符串显示所有向脚本传递的参数
$$ | 脚本运行的当前进程 ID
$! | 后台运行的最后一个进程的 ID
$@ | 与 `$*` 相同，但是使用时加引号，并在引号中返回每个参数。
$- | 现实 Shell 使用的当前选项，与 set 命令相同
$? | 显示最后命令的退出状态，0 表示没有错误，其他任何值表示有错误。

