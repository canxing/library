# table 函数

## concat(list, [,sep[,i[,j]]])

提供一个列表，其所有元素都是字符串或数字，返回字符串 list[i]..sep..list[i+1]..sep..list[j]

```lua
local l = {1, 2, 3, 4, 5, 6, 7, 'a', 'b', 'c', 'd', 'e'};
print(table.concat(l));  --> 1234567abcde
l = {1, 2, 3, 4, 5, 6, 7, 'a', 'b', 'c', 'd', 'e'};
print(table.concat(l, '-')); --> 1-2-3-4-5-6-7-a-b-c-d-e

l = {a=1, b=2, c=3, d=4, e=5, f=6}; --> 
print(table.concat(l));
```

## insert

insert(list, [pos,] value) 在 list 的位置 pos 出插入元素 value

```lua
local l2 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
table.insert(l2, 'a');
print(table.concat(l2)); --> 12345678910a

table.insert(l2, 4, 'a');
print(table.concat(l2)); --> 123a45678910a
```

## remove(list [, post])

```lua
local l3 = {1, 2, 3, 4, 5, 6, 7, 8, 9};
print(table.concat(l3)); --> 123456789
table.remove(l3, 4);
print(table.concat(l3)); --> 12356789
```

## sort(list [,comp])

对 list 进行排序，如果提供了 comp，它必须是一个可以接受两个参数的函数。

```lua
local l4 = {1, 3, 2, 5, 6, 8, 4, 7, -1};
table.sort(l4);
--> print(table.concat(l4, ','));
table.sort(l4, function(item1, item2) 
        return item1 < item2;
    end
);
print(table.concat(l4, ',')); --> -1,1,2,3,4,5,6,7,8
table.sort(l4, function(item1, item2) 
        return item1 > item2;
    end
);
print(table.concat(l4, ',')); --> 8,7,6,5,4,3,2,1,-1
```
