---
title: （六）-枚举与集合
date: 2022-02-11 12:02:27
tags:
- csharp
- hfc
categories: csharp读书笔记
---

## 枚举

- 枚举只允许几个特定的值
- `enum`数据类型只允许某个数据取某些特定的值

```csharp
enum Computers{
 Computer1=1,//不仅可以指定名称，还可以指定值
 Computer2=2,
 Computer3=3,//这个逗号可以省略
}
```

- `enum`也是一种类型，每一项都可以当作参数传递，如`Computers.Computer1`这样传递
- 枚举中的每一项都必须有名称，但不一定需要指定一个值
- 可以使用`.ToString()`方法来获得任意一项的名称，使用强制转换获得其值
- 比如：`Computers.Computer1.ToString()`得到string`Computer1`,`(int)Computers.Computer1`得到int`1`
- 也可以把int转换回去，例如`Computers computer0=(Computers)3;`该代码会创建一个指向`Computer3`的[[Csharp读书笔记（一）-对象与引用|引用]]`computer0`（因为等号右边的数字是3，回到`Computers`中寻找值3，所对应的项为`Computer3`)，于是`computer0.ToString()`获得的就是string`Computer3`了
- 如果没有为项指定值，那么C#会自动按照顺序赋值，第一项为0，以此类推
- 可以用`:`指定所需要的类型，例如`enum Computers:long`这样就可以为其中的项指定非常大的值了

## 集合

### 列表与数组

- 每个[[Csharp读书笔记（二）-数组|数组]]都有一个长度，它是固定的，需要手动调整长度
- 不能直接移动数组的元素
- 可以使用集合来存储数据，就可以避免以上两个问题
- 常用的集合是`List<T>`，`<T>`表示类型，把类型放在尖括号中间
- 使用`.Add()`可以添加集合中的项目
- `List`没有大小限制，它会动态调整大小
- `List`有[[Csharp读书笔记（五）-接口与抽象类#^cffd9a|多态]]性，也就是可以添加接口、抽象类、基类等

### List的使用

- `.Contains()`可以检查是否有特定元素，括号内写上需要查找的元素
- `.IndexOf()`可以获取特定元素的索引，括号内写上需要查找的元素
- `.Remove()`可以删除元素，括号内写上需要删除的元素
- `.RemoveAt()`可以删除元素，括号内写上需要删除元素的索引号
- `List`本身也是一个对象

### `foreach`循环

- `foreach`可以对list中每个对象执行语句，[[Csharp读书笔记（二）-数组|数组]]也可以这么用
- 注意，使用`foreach`时不能修改这个集合，也就是不能使用该list对应的`.Remove()`等方法
- `.ToList()`可以创建副本并赋值给新的变量
- 使用foreach就是在使用`IEnumerable<T>`
- 以下代码实现的效果完全相同

```csharp

foreach (Duck duck in ducks)
 Console.WriteLine(duck);
//上下两种方式实现的效果完全相同
IEnumerator<Duck> enumerator = ducks.GetEnumerator();
while (enumerator.MoveNext())
 Console.WriteLine(enumerator.Current);

IDisposable disposable = enumerator as IDisposable;
if (disposable != null) disposable.Dispose();
```

### 集合初始化方法

- 可以用集合初始化方法来提供初始数据项列表
- 直接在创建列表后面添加大括号，各个初始项中使用逗号隔开
- 可以包含new创建的对象，还可以包含变量

### 集合的排序

- `.Sort()`可以使列表中的所有项重新有序排列，它已经知道如何重排大部分类型
- 有两种排序方法，分别是`CompareTo()`和实现`IComparer<T>`

#### 排序1：使用`CompareTo()`方法

- `.Sort()`知道如何对实现了`IComparable<T>`[[Csharp读书笔记（五）-接口与抽象类#接口|接口]]的类排序
- 该接口只有一个成员，是`CompareTo()`方法，传入一个要比较的对象
- `CompareTo()`方法会返回一个int值，该方法传入一个要比较的对象x，它把传入的对象与当前对象y（也就是该方法所在的对象）比较，如果x应排在y后面（也就是x>y）则返回正数，反之则返回负数。如果比较相同，则返回0。（如果你实现了正向排列，想要倒序排列，只需在调换正负数的位置即可）
- 实现接口后，直接使用`.Sort()`即可排序

#### 排序2：新建一个实现了`IComparable<T>`的类

- 可以向`.Sort()`传入一个实现了`IComparer<T>`接口的实例
- 该接口有一个`Compare()`方法，传入两个要比较的对象
- `Compare()`方法会返回一个int值，该方法传入两个要比较的对象（假设它们是x,y），它把传入的两个对象比较，如果x应排在y后面（x>y），则返回正数，反之则返回负数。如果比较相同，则返回0。（如果你实现了正向排列，想要倒序排列，只需在调换正负数的位置即可）
- 实现接口后，先实例化这个新比较类，然后调用list对象的`.Sort()`，把新的实例填到括号内，即可比较

#### 多种排序方式

- 可以用第二种方式写不同的比较类，只要填入不同排序类，就可以以不同的方式排序
- 注意，以上两种方法可以共存。共存时，`.Sort()`括号内可以不写，也可以填入比较类，此时会执行比较类中的方法（不会执行CompareTo）
- 也就是说，第二种方式有更大的灵活性！

### ToString()方法

- 每一个[[Csharp读书笔记（一）-对象与引用#对象|对象]]都有一个ToString()方法，把对象转换为一个字符串
- 使用+操作符会自动调用该方法，调试工具中的监视也用到了这个方法
- 它默认返回类名，但是我们可以覆盖它，让它返回不同的内容

### 列表的向上强制转换

- 列表的向上强制转换称作协变
- 实现了`IEnumerable<T>`接口的类才可以向上强制转换
- 使用该接口引用即可转换`IEnumerable<BaseClass> upcastBaseClasses = subclasses`，这里subclasses即子类的列表，这个子类实现了IEnumerable
- 强制转换后，可以用`AddRange`把内容添加到另一个列表中

### 重载

- 重载即有多个参数不同的同名方法
- 直接写两个同名方法，即可使用重载

### IEnumerable

- 这个接口表示实现了任何集合，不止是List或数组
- 用于[[Csharp读书笔记（六）-枚举与集合#列表的向上强制转换|强制转换]]、[[Csharp读书笔记（六）-枚举与集合#foreach 循环|foreach循环]]等

### 字典

- 字典可以将两个东西关联起来，形成一组
- 前一个叫键，后一个叫值
- 任何类型都可以！
- `.Add(key,value)`可以添加一个项目
- `.ContainKey(key)`可以返回是否有这个键
- `dict[key]`可以获得键对应的值
- `.Remove(key)`可以移除一项
- `foreach(string key in myDict.Keys)`可以遍历键
- `.Count()`可以获得项目数量

### 更多集合类型——按顺序处理

- 常用的按照顺序处理的集合是queue和stack
- queue类型表示先处理早提交的对象
- stack则相反，先处理最后提交的对象

#### queue

- `.Enqueue()`向queue中添加一项
- `.Peek()`允许查看第一项
- `.Dequeue()`允许取出第一项，将后面的对象上移到空出来的位置
- `.Count`,`.Clear()`与[[Csharp读书笔记（六）-枚举与集合#List的使用|list]]类似

#### stack

- 可以推入、弹出对象
- 添加时用`.Push()`
- 取出时用`.Pop()`
- `.Peek()`类似queue

### 互相转换

- list,queue,stack可以相互转换
- 比如下面这样做

```csharp
Queue<string> myQueue=new Queue<string>(mystack);
```
