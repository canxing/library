# Redis 学习记录

+ [什么是Redis](#什么是Redis)
+ [Redis的组织模型](#Redis的组织模型)
+ [如何创建数据库](#如何创建数据库)
+ [如何插入数据](#如何插入数据)
+ [如何查看数据库中的键](#如何查看数据库中的键)
+ [已知某个键如何查看该键的类型](#已知某个键如何查看该键的类型)
+ [如何判断是否存在相同名称的键](#如何判断是否存在相同名称的键)
+ [如何根据键删除键值对](#如何根据键删除键值对)
+ [字符串相关操作](#字符串相关操作)
  + [字符串类型数据的插入](#字符串类型数据的插入)
  + [如何一次插入多条数据](#如何一次插入多条数据)
  + [如何查看插入的数据](#如何查看插入的数据)
  + [如何修改数据](#如何修改数据)
  + [如何删除数据](#如何删除数据)
+ [哈希相关操作](#哈希相关操作)
  + [如何插入哈希类型的数据](#如何插入哈希类型的数据)
  + [如何删除一个键中的某个域](#如何删除一个键中的某个域)
+ [列表类型相关操作](#列表类型相关操作)
  + [如何插入列表类型](#如何插入列表类型)
  + [如何查看列表](#如何查看列表)
  + [如何修改列表值](#如何修改列表值)
  + [如何删除列表中的元素](#如何删除列表中的元素)
+ [集合相关操作](#集合相关操作)
  + [如何创建一个集合](#如何创建一个集合)
  + [如何查询已经插入的集合](#如何查询已经插入的集合)
  + [如何删除集合中的元素](#如何删除集合中的元素)
+ [有序集合](#有序集合)
  + [如何创建有序集合](#如何创建有序集合)
  + [如何查询有序集合](#如何查询有序集合)
  + [如何删除成员](#如何删除成员)
+ [期限](#期限)
  + [什么是期限](#什么是期限)
  + [如何设置期限](#如何设置期限)
  + [如何查看关键字的存活时间](#如何查看关键字的存活时间)
  + [如何取消关键字的存活时间](#如何取消关键字的存活时间)
+ [订阅和发布](#订阅和发布)
+ [附录](#附录)

## 什么是Redis

Redis 是一种非关系型内存数据库，存储读取等操作的速度非常快。

## Redis的组织模型

## Redis有什么数据结构

+ STRING
+ LIST
+ SET
+ HASH
+ ZSET

## 如何创建数据库

Redis 中的数据库简单的使用一个数字编号来辨认，默认数据库的数字编号是 0，想要切换不同的数据库使用 `select` 命令。

```Redis
select 1
```

想要切换回默认数据库使用 `select 0` 命令。

## 如何插入数据

Redis 没有 MySQL 的表格，也没有 MongoDB 的集合，有的只有 `键值对`，Redis 提供不同命令来表示插入的键值对的类型，比如使用 `set` 命令插入的数据就是字符串类型，使用 `rpush` 或者 `lpush` 操作的就是列表类型，使用 `hset` 插入的就是哈希类型，使用 `sadd` 插入的就是集合类型。

使用不同的操作符就会插入不同的类型，不管插入什么类型的数据，都需要有一个键。

## 如何查看数据库中的键

使用 `kyes` 可以查看数据库中的键集合。`keys` 返回所有匹配名称的键，如果要查看所有的键使用 '*' 即可。

```Redis
keys *
```

## 已知某个键如何查看该键的类型

查看已知键属于什么类型，需使用 `type` 命令，`type` 命令加上键名称返回该键的值属于什么数据类型。

```Redis
type <key-name>
```

## 如何判断是否存在相同名称的键

使用 `exists` 命令判断是否存在相同名称的键，如果存在返回 1, 不存在返回 0。

```Redis
exists mykey
```

## 如何根据键删除键值对

使用 `del` 命令可以根据键删除键值对，删除成功返回 1,删除失败返回 0。

```Redis
del <key-name>
```

## 字符串相关操作

### 字符串类型数据的插入

字符串数据类型的插入使用 `set` 命令，`set` 命令最少需要两个参数，第一个参数为键的名称，第二个为值。

```Redis
set tom jerry
```

`set` 的第二个参数可以用单引号，双引号包起来，也可以不包起来，不论哪种形式，在 Redis 中都表示为字符串。

### 如何一次插入多条数据

使用 `set` 命令一次只能插入一条数据，要想在一条命令中插入多条数据可以使用 `mset` 命令。

```Redis
mset tom jerry loumiou zhuliye liangshanbo zhuyingtai
```

上述命令中一共插入了三条数据，分别是: {tom:jerry}, {loumiou: zhuliye}, {liangshanbo: zhuyingtai}

### 如何查看插入的数据

想要查看已经插入的数据，需要知道插入数据的键名称，然后根据键名称去查询数据。查询数据使用 `get` 命令。

```Redis
get tom
```

想要一条命令获得多个键的值需要使用 `mget` 命令，`mget` 命令后面接要查询值的键。

```Redis
mget tom loumiou liangshanbo
```

### 如何修改数据

在 Redis 中，修改数据就相当于重新为键赋值，直接使用 `set` 命令即可覆盖原来的数据。

### 如何删除数据

如果是想删除键值对，上面已经有答案了。

如果是想将值该掉，上面也有答案了。

## 哈希相关操作

### 如何插入哈希类型的数据

插入哈希类型数据使用 `hset` 命令和 `hmset` 命令。

`hset` 和 `set` 命令不同的地方在于 `hset` 接收三个参数。第一个参数为键，第二个参数为域，第三个参数为值。哈希类型可以有多个域，每个域只有一个值。

```Redis
hset cat name tom
hset cat age 22
hset cat color blue
```

上述三条语句在 cat 键中插入了 3 个域，每个域对应了不同的值。表示为 {name: tom},{age: 22},{color: blue}

同样哈希类型也提供了可以在一条语句中插入多个域的命令，那就是 `hmset`。

```Redis
hmset mouse name jerry age 21 color yellow
```

上述语句表示为在 `mouse` 键中插入 {name: jerry}, {age: 21}, {color: yellow}

### 如何查看插入的哈希类型数据

Redis 提供了四条命令来访问哈希类型的数据，分别是 `hget`, `hmget`, `hvals` 和 `hgetall`。其中 `hget` 用于查询一个键中某个域的值，`hmget` 用于查询一个键中多个域的值，`hvals` 用于查询一个键中所有域的值，`hgetall` 不仅返回所有域的值，还返回这些域的名称。这些命令只适用于对哈希类型的数据进行操作。

```Redis
hget cat name
hmget cat name age
hvals cat
hgetall cat
```

### 如何删除一个键中的某个域

删除哈希类型中域使用 `hdel` 命令，`hdel` 命令接收两个参数，第一个参数为指定键，第二个参数为键中含有的域。

```Redis
hdel cat color
```

## 列表类型相关操作

### 如何插入列表类型

Redis 提供了多条命令来实现插入列表类型的数据，`linsert`, `lpush`, `lpushx`, `rpush` 和 `rpushx` 都可以列表。

其中 `linsert`, `lpushx` 和 `rpushx` 命令要求插入时列表存在。

`lpush` 和 `rpush` 不需要列表存在，也就是说，如果要创建并插入列表，就要使用这两个命令。

```Redis
lpush numbers 1 2 3 4 5 6 7 8 9 10 11
rpush colors red green yellow bule
```

`lpush` 和 `lpushx` 用于从左边压入数据。

`rpush` 和 `rpushx` 用于从右边压入数据。

`linsert` 可以在列表任意位置插入数据，该方法使用如下:

```Redis
linsert numbers before 1 12
```

上述语句表示为在 numbers 这个数据结构中的`元素` 1 的前面插入`元素` 12，注意，这里的 1 和 12 都不是索引而是元素，linsert 根据元素进行定位，`before` 表示在选定元素之前插入，也可以使用 `after` 表示在选定元素之后插入。

### 如何查看列表

Redis 提供了两个命令用来查看列表，`lindex` 和 `lrange`，`lindex` 根据索引返回索引位置上的元素，索引从 0 开始;`lrange` 根据开始索引和结束索引打印两个之间的所有元素，包括两个索引的元素都会打印。

```Redis
lindex numbers 2
lrange number 0 12
```

对于 `lrange` 来说，如果结束索引超过了列表长度，结束索引相当于列表长度的值。

### 如何修改列表值

使用 `lset` 来修改列表元素的值，`lset` 接收三个参数，第一个参数为键，第二个参数为索引（列表第一个元素的索引为0），第三个参数为修改的值。

```Redis
lset colors 2 black
```

### 如何删除列表中的元素

`lpop`, `lrem`, `ltrim` 和 `rpop` 可以用来删除列表中的元素。 `lpop` 和 `rpop` 分别用来从左边弹出第一个元素和从右边弹出第一个元素。

```Redis
lpop numbers
rpop numbers
```

`lrem` 用来删除多个相同的元素，`lrem` 接收三个参数，第一个参数为键 key，第二个参数为个数 count，个数可以为正数，负数和 0，第三个数为要删除的元素 value。

当个数大于 0 时，从左到右按顺序删除 count 个元素等于 value 的值。
当个数小于 0 时，从右到左按顺序删除 count 个元素等于 value 的值。
当个数等于 0 时，删除列表中所有元素等于 value 的值。

```Redis
lrem numbers 2 9
```

上述命令从左到右删除了两个值为 9 的元素。

`ltrim` 保留指定索引内的元素，开始索引和结束索引构成一个闭区间。

```Redis
ltrim numbers 1 4
```

## 集合相关操作

### 如何创建一个集合

`sadd` 用于创建一个集合，集合中的任何元素都是唯一的。

```Redis
sadd abc 1 2 3 4 5 1 2 3 4 5
```

### 如何查询已经插入的集合

`smembers` 用于返回集合中的所有元素

```Redis
smembers abc
```

### 如何删除集合中的元素

`srem`, `spop` 用于删除集合中的元素。

`srem` 用于删除集合中所有匹配的元素。

```Redis
srem abc 2 5
```

`spop` 用于随机删除集合中的指定个数的元素。

```Redis
spop abc 3
```

## 有序集合

### 如何创建有序集合

有序集合和集合很像不过有序集合可以按照 `score` 进行排序，`score` 可以是任意用于排序的数字，可以是年份，年龄，个数等等。因此有序集合比集合多维护了一个用于排序域。

Redis 提供了 `zadd` 命令来创建。

```Redis
zadd hackers 1940 'alan kay'
```

上述语句创建了一个有序集合，该集合用 `1940` 作为 `score` 来排序，下面来多插入一点数据。

```Redis
zadd hackers 1957 'sophie wilson' 1953 'richard stallman'
zadd hackers 1949 'anita borg' 1965 'yukihiro matsumoto'
```

### 如何查询有序集合

Redis 提供了多种命令来查询 `zrange`, `zrangebylex`, `zrangebyscore`, `zrevrange`, `zrevrangebylex`, `zrevrangebyscore`, `zscore`。

`zrange` 根据 `score` 来排序，排序是升序排序，输出排序后的开始索引和结束索引之间的元素。

```Redis
zrange hackers 0 12
```

`zrangebylex` 返回两个元素之间的所有元素

```Redis
127.0.0.1:6379> zrangebylex hackers ['alan kay' ['sophie wilson'
1) "alan kay"
2) "anita borg"
3) "richard stallman"
4) "sophie wilson"
127.0.0.1:6379> zrangebylex hackers ['alan kay' ('sophie wilson'
1) "alan kay"
2) "anita borg"
3) "richard stallman"
127.0.0.1:6379> zrangebylex hackers ('alan kay' ('sophie wilson'
1) "anita borg"
2) "richard stallman"
```

上述使用 `zrangebylex` 执行了三条语句，第一条语句为闭区间，第二条语句为左闭右开区间，第三条语句为开区间，每条语句下边跟的是语句的返回结果。

`zrangebyscore` 返回最小 `score` 和 最大 `score` 之间的所有元素，是一个闭区间

```Redis
zrangebyscore hackers 1940 1949
```

`zrevrange`, `zrevrangebylext` 和 `zrevrangebyscore` 三条命令和 `zrange`, `zrangebylext` 和 `zrangebyscore` 相似，不过前面三个命令是逆序输出。

`zscore` 根据名称获取 `score`

```Redis
zscore hackers 'alan kay'
```

### 如何删除成员

Redis 提供了 4 个命令来实现删除操作 `zrem`, `zremrangebylex`, `zremrangebyrank`, `zremrangebyscore`

`zrem` 根据成员名称删除成员

```Redis
zrem hackers 'alan kay'
```

`zremrangebylex` 和 `zrangebylex` 的用法一样，不过 `zremrangebylex` 会删除而 `zrangebylex` 会显示。

```Redis
zremrangebylex hackers ('anita borg' ('sophie wilson'
```

`zremrangebyrank` 删除所有在开始位置和结束位置之间的已排序数据。开始位置和结束位置构成一个闭区间。

```Redis
zremrangebyrank hackers 0 1
```

`zremrangebyscore` 删除在两个 `score` 之间的所有成员

```Redis
zremrangebyscore hackers 1953 1965
```

## 期限

### 什么是期限

Redis 可以对一个关键字设置使用期限，超过期限之后该关键字就会被删除，这是一个面对关键字的命令，不在乎关键字是什么类型。

### 如何设置期限

设置使用期限使用 `expire` 和 `expireat` 命令

`expire` 设置基于秒的存活时间。

```Redis
expire tom 10
```

`expireat` 设置一个基于 Unix 的绝对时间。

```Redis
expireat tom 1356933600
```

### 如何查看关键字的存活时间

Redis 使用 `ttl` 命令来查看关键字的存活时间。

```Redis
ttl tom
```

### 如何取消关键字的存活时间

Redis 允许撤销对关键字的期限，使用 `persist` 命令。

```Redis
persist tom
```

## 订阅和发布

订阅使用 `subscribe` 命令，发布使用 `publish` 命令。

订阅可以订阅一个频道，使用 `publish` 命令向一个频道推送消息的时候，已订阅频道的人可以受到消息。

```Redis
subscribe movie 订阅一个频道
```

```Redis
publish movie 'Tom And Jerry' 向一个频道推送消息
```

## 附录
