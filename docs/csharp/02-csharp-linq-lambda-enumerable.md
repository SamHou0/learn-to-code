---
title: LINQ、 Lambda 和 IEnumerable
description: 本文深入讲解 C# 中 LINQ 与 Lambda 表达式，介绍如何将声明式查询转换为方法链调用，详细拆解 Where、OrderBy、GroupBy 和 Join 等关键操作。最后通过实现 IEnumerable 接口与 yield return 机制，揭示 LINQ 查询的底层迭代原理。
---

[上一篇](./01-csharp-linq-guide.md)，我们讲了 LINQ 的入门知识，了解了方法和声明式查询这两种形式，但是对于将声明式查询的一部分，转换为方法，还没有深入了解。

这一篇，我们将从 Lambda 表达式开始，一步一步带你走进 LINQ 方法的世界，最终自己实现 IEnumerable！

让我们开始吧。

## Lambda 表达式

在阅读 C# 代码的时候，你一定时常碰见这个 `=>`。

比如：

```csharp
public override string ToString() => "String";
```

上面的例子非常直观，你一定能猜到它是怎么工作的：让这个方法的返回值为 `"String"`。

`=>` 这个小符号，定义的就是一个 *Lambda 表达式*。它声明了一个*匿名函数*（没有名字的方法），我们可以把它的语法总结为：

```csharp
(参数类型 参数1, 参数类型 参数2 ...) => 表达式;
```

括号内部的，是匿名函数的参数列表；表达式表示的值，就是这个匿名函数的*返回值*。

也就是说，我们可以把很多单个 return 的方法，借助 lambda 表达式，直接简化为一行！

```csharp
static class AwesomeClass
{
    public static string Shout(string s) => "OHHHHHHHHHHH THIS IS SIMPLE";
    public static bool IsOverHundred(int num) => num > 100;
}
```

第一个不再赘述，第二个的含义是，接受 num，然后计算 => 后面的表达式，返回表达式的值（即，检测 num 是否大于100）

*等等*。你一定在思考一个问题：刚才提到说，lambda 表达式创建的是**匿名方法**，但是上面的示例代码里面，不还是有名字吗？？这个**匿名**，到底是什么意思呢？

欸，实际上，lambda 表达式定义的是**一段函数逻辑**，本身确实是**没有名字**的。

但是，它可以用在**任何需要一个函数体的地方**，包括上面的 `ToString` 和 `Shout`。正是因为你把这个匿名方法用到了一个有名字的类成员身上，所以才*看起来*有名字。

也就是说，上面代码中，涉及 lambda 和匿名函数的，只有：

```csharp
() => "String";
(string s) => "OHHHHHHHHHHH THIS IS SIMPLE";
// 也就是……
(输入) => 输出;
```

并不包含括号前面的那个名字。

那么问题来了，这和我们的 LINQ 又有什么关系呢？

## LINQ 中的 Lambda

### 入门：过滤 Where

让我们先回忆上一篇的一段声明式查询语句：

```csharp
var result = from num in numbers
             where num > 500
             orderby num
             select num + 1;
```

我们已经提到，声明式查询可以改写为方法串链。既然是直接在原来的集合上面调用，那么方法串链的形式不需要 from；那么，现在来试试输入 `Where()` 吧：

![智能提示](https://img.samhou.top/1770188472527.webp)

来了点奇怪的东西！IDE 告诉我们，Where 这个方法，需要一个 `Func<int,bool>` 作为参数……？

点进去看一下（反编译）：

```csharp
public delegate TResult Func<in T, out TResult>(T arg);
```

>*delegate*！这是一个*委托*。
> 关于委托，这并不在本文的讨论范围内。先用 LINQ 和 Lambda 的思维看看吧。

你可以简单理解为，这里**需要一个方法**，以 T 作为参数，TResult 作为结果。就这么个简单的 LINQ 查询，你肯定不想独立写一个方法出来——因此，是时候让匿名函数出手了：

```csharp
numbers.Where(num => num > 500)
```

`Func<int,bool>` 表示参数类型 int，返回值类型 bool。上面的查询中需要**一种逻辑**：

“如果通过参数传入的 int **满足某些条件**，那么返回 true 保留；否则，返回 false 丢掉。”

因此我们写了下面这样的 lambda 表达式，让这个匿名函数对于参数大于 500 的情况返回 True，否则返回 False。

```csharp
num => num > 500
```

我知道你一定又有问题了。

明明我们的 lambda 表达式应该是这样的：

```csharp
(参数类型 参数) => 表达式;
```

为什么括号没了，甚至参数类型也没了！？？

这是因为——如果这个 lambda 作为一个参数 (`Func<T,T>`) 传入另一个方法，那么这个匿名函数的*参数*和*返回值*的**类型**，是**确定已知**的，因此，**没有必要**去写参数的类型。

而又由于只有一个参数名称，所以括号是不必要的，可以删除，最终得到这样的简化式子：

```csharp
参数 => 表达式
```

要提醒的是，千万别忘了，lambda 的参数和方法一样，是要**自己命名的**，这里省略的是参数类型，不是参数名字本身！

因此，**当你看到 `Func<T,T>` 类型的参数的时候，请明白，这里需要一个处理逻辑，也就是一个 lambda 表达式**。

### 排序 Orderby

声明式查询的第二个子句，是 orderby。

```csharp
orderby num
```

现在我们在刚才的 Where 后面，串接上 orderby：

```csharp
numbers.Where((int num) => num > 500)
    .OrderBy(num=>num);
```

来自己试试吧！把鼠标悬浮在 orderby 上面，你会发现它需要的是 `Func<int,TKey>` 类型的一个参数。

TKey 是啥？看看注释：

```text
... in ascending order according to a key.
```

哦！我们知道了，我们需要一种逻辑，传入一个列表元素，返回一个可以排序的东西（叫做 key）。然后 orderby 会根据这个 key，排序原始传入的列表元素。

在我们的情况下，由于数据源是 int 类型列表，所以传入的对象是 int。

仔细想想之后，会发现——我们**就是要根据这个 int 类型的列表元素本身**，来进行排序！

所以根本就不需要进行任何处理，直接返回 num 本身不就好了？

所以……

```csharp
num => num
```

我知道这个看起来多此一举，但是总不能什么都不填……这个 lambda 的含义是，接收到参数命名为 num，按照原样返回 num！

实际开发中肯定不是排序数字列表这么简单，再给你举一个不那么“多此一举”的例子（继续拿上一篇中的 User 类）：

```csharp
enum Status
{
    Offline,
    Online
}
class User
{
    public int Id { get; set; }
    public Status Status { get; set; }
}
```

如果有个 User 列表，就能这么写：

```csharp
users.OrderBy(user=>user.Id)
```

这里的含义是，把 users 列表，按照其每个 User 类实例（命名为 user）的 Id 排序。

我们把其等价声明式查询拿出来——

```csharp
from user in users orderby user.Id select user
```

比对一下吧！把每个部分这么一对应，是不是声明式查询和方法查询都变得十分清晰了呢？

### 分组 Group

还记得上一篇文章里面介绍的分组吗？现在也来介绍一下吧！

我们先拿出

```csharp
User[] users = new User[]
{
    new User { Id = 1, Status = Status.Online },
    new User { Id = 2, Status = Status.Online },
    new User { Id = 3, Status = Status.Offline },
    new User { Id = 4, Status = Status.Online },
};
var result=from user in users orderby user.Id
           group user by user.Status into userGroup
           select userGroup;
foreach (var group in result)
{
    Console.WriteLine("Group " + group.Key);
    foreach (var item in group)
    {
        Console.WriteLine("User ID #" + item.Id
            + " Status: " + item.Status);
    }
}
```

先自己尝试一下吧！先按照上面的讲解写出 OrderBy()，然后输入 GroupBy()，把鼠标放上去查看它需要接受一个怎样的参数。

答案是：

```csharp
var result = users.OrderBy(user => user.Id)
    .GroupBy(user => user.Status);
```

写出来了吗？

现在来拆解一下：

GroupBy 接受一个 `Func<User,TKey>` 参数，含义是输入一个 User，根据 lambda 中匿名函数返回的 TKey 类型的数据来分组。相同的 TKey 类型分到一组。因此，我们这里是根据 user.Status 进行分组，TKey 这个泛型就变成了 Status enum。

好了，不啰嗦了。Group 和 Orderby 实在非常相似，自己对照一下，相信你一定可以明白。

### 合并 Join

上一篇，我们写了这样一个用户留言板程序，生成了匿名类型：

```csharp
class User // 这个类没有改
{
    public int Id { get; set; }
    public Status Status { get; set; }
}
class Message // 表示用户发送的一条信息
{
    // 发送者 ID
    public int SenderId {  get; set; }
    // 发送内容
    public string Text { get; set; } = "";
}
```

```csharp
User[] users = new User[] // 不变
{
    new User { Id = 1, Status = Status.Online },
    new User { Id = 2, Status = Status.Online },
    new User { Id = 3, Status = Status.Offline },
    new User { Id = 4, Status = Status.Online },
};
Message[] messages = new Message[] // 来构造一个示例消息列表
{
    new Message {SenderId= 1,Text="I love this."},
    new Message {SenderId= 2,Text="No wayyyyy we can leave message" },
    new Message{SenderId=3,Text="OMG this is crazy"},
    new Message{SenderId=3,Text="Great work!"},
    new Message{SenderId=4,Text="Can I delete my message???"}
};
var result = from message in messages
             join user in users
             on message.SenderId equals user.Id
             select new
             {
                 SenderId = message.SenderId,
                 Text = message.Text,
                 UserStatus = user.Status,
             };
foreach (var item in result)
{
    Console.WriteLine("Message [" + item.Text +
        "] from user #" + item.SenderId +
        " whose status is " + item.UserStatus);
}
```

现在我们来看这个 Join——来试试输入吧！

```csharp
messages.Join( // 试着打这些
```

IDE 里面智能提示太长了放不下！我们去 [Microsoft Learn](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.join) 查一下这个方法（阅读文档是一种非常好的学习方式）。

> Correlates the elements of two sequences based on matching keys.

由于这是一个*扩展方法*（此处不展开），所以带着 this 的参数直接忽略，它表示 .Join 前面的那个对象。

还剩下 4 个参数：

```csharp
System.Collections.Generic.IEnumerable<TInner> inner,
Func<TOuter,TKey> outerKeySelector, 
Func<TInner,TKey> innerKeySelector, 
Func<TOuter,TInner,TResult> resultSelector
```

> Inner: The sequence to join to the first sequence.

也就是说，第一个参数是需要拼接到目标对象的序列。我们的情境下，是 `users` 序列。

下面的两个参数是：

> A function to extract the join key from each element of the first sequence.
> A function to extract the join key from each element of the second sequence.

哦~理解了，就是给两个序列，分别写两个 lambda 表达式，返回两个属性，会判断它们是否匹配！也就是：

```csharp
on message.SenderId equals user.Id
```

那么，我们写出这样的 lambda 表达式就行了：

```csharp
message=>message.SenderId
user=>user.Id
```

最后当然就是 select 啦，我们就在这里创建新的匿名类型：

> A function to create a result element from two matching elements.

**注意了！由于我们有两个序列，所以需要 2 个参数的匿名方法。两个参数就不可以省略括号了。**

```csharp
(message, user) => new
    {
        SenderId = user.Id,
        Text = message.Text,
        UserStatus = user.Status,
    }
```

完美！现在让我们展示一下最终的结果。

```csharp
var result = messages.Join(users, message => message.SenderId,
    user => user.Id, (message, user) => new
    {
        SenderId = user.Id,
        Text = message.Text,
        UserStatus = user.Status,
    });
```

你觉得哪种，声明式，还是直接写方法比较舒服呢？其实这取决于你自己——写出来的代码只要清晰易懂即可。

## 实现 IEnumerable

### 手写实现接口

对于 LINQ，现在你已经有相当深入的了解了。但是，你还记得我在上一篇开头的地方，给你留的小剧透吗？

> 在本文的后半，会介绍怎么自己实现这个接口，不过现在我们先记住这个前提，然后来用一下 LINQ 感受一下吧！

对于数据查询，你已经几乎离不开 LINQ 了不是吗？

因此，你当然希望你的数据——我是指，你自己创建的类，也应该能够实现 LINQ 查询对吧。

现在让我们来探索这个接口。

比如，我们来创建一个自定义的用户列表 UserList 类型！

键入下面的 class 语句：

```csharp
class UserList : IEnumerable<User>
```

现在在波浪线的地方按下 alt + enter，选中“实现接口”。

```csharp
class UserList : IEnumerable<User>
{
    public IEnumerator<User> GetEnumerator()
    {
        throw new NotImplementedException();
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

现在你知道这个接口必须实现这两个方法。那么问题来了，IDE 生成的这个 `IEnumerator<User>` 接口（更通用地，是 `IEnumerator<T>`），又是什么？？？

从名字上理解，这个叫做**枚举器**，也就是把一个集合里面的东西**一个个枚举出来**的方法。

> 如果你看过《[奶奶都能看懂的 C++ —— vector 与迭代器](https://blog.samhou.moe/cpp-vector-iterator-guide/)》这篇文章或者你是 C++ 高手，一个很好的方法就是，把枚举器看成 C++ 迭代器，但是不需要解引用。（没看过也没关系！下面会从零开始详细解释枚举器）

我们不妨来创建一个类，来让 IDE 实现这个接口：

```csharp
class UserListEnumerator : IEnumerator<User>
{
    public User Current => throw new NotImplementedException();
    object IEnumerator.Current => Current;
    public void Dispose()
    {
        throw new NotImplementedException();
    }
    public bool MoveNext()
    {
        throw new NotImplementedException();
    }
    public void Reset()
    {
        throw new NotImplementedException();
    }
}
```

WOW，出来了一堆方法！

我们来结合含义讲解一下。

- Current、Move、Reset，看得出来，好像有什么在移动
- 没错，这个接口表示的就是一个**枚举器**，会从序列开头移动到末尾
- Current 返回枚举器当前指向的对象
- MoveNext 把枚举器移到下一位，如果移位后 Current 指向的对象有效，那么返回 ture；如果已经越过列表末尾了，那么返回 false
- Reset 重置枚举器
- Dispose 会释放枚举器使用的资源（此处略去，不在讨论范围内）

现在让我们来实现！

但是，我们的 UserList 明明自称是一个可枚举的列表，里面却没有数据。由于这个程序只是一个演示用途，因此，我们通过构造函数传入，来初始化这个列表：

```csharp
class UserList : IEnumerable<User>
{
    User[] _users;
    public UserList(User[] users)
    {
        // 传入！
        _users = users;
    }
    public IEnumerator<User> GetEnumerator()
    {
        // 根据现有数据生成枚举器！
        return new UserListEnumerator(_users);
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

再来手动实现枚举器的逻辑——注意，**第一次迭代**的时候就会调用 MoveNext，因此下标从 -1 开始：

```csharp
class UserListEnumerator : IEnumerator<User>
{
    private readonly User[] _users;
    int _index = -1; // 从 -1 开始！
    public UserListEnumerator(User[] users)
    {
        _users = users;
    }
    public User Current => _users[_index]; // 当前的元素
    object IEnumerator.Current => Current;
    public void Dispose()
    {
    // 略去。
    }
    public bool MoveNext()
    {
        // 移到下一位
        _index++;
        // 检查移位之后，当前的 Current 是否有效
        return _index < _users.Length;
    }
    public void Reset()
    {
        _index = -1;
    }
}
```

确实，手动写这么一大堆东西，头都大了，有什么更加简单方便的方法来实现枚举器吗？

### yield return

当然！隆重介绍 `yield return`！它可以全自动地生成一个枚举器，请看示例代码——

```csharp
class UserList : IEnumerable<User>
{
    User[] _users;
    public UserList(User[] users)
    {
        _users = users;
    }
    public IEnumerator<User> GetEnumerator()
    {
        for(int i = 0; i < _users.Length; i++)
        {
            yield return _users[i];
        }
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}
```

你可能已经发现，有一个类全部消失了！这就是 yield return，它可以全自动生成一个 `IEnumerator<User>`。

但是*等等*。

> 这到底是什么原理？我枚举这个列表的时候，代码究竟在怎么执行？为什么 yield return 可以返回一个枚举器？

其实，yield return 就是两句话：

- 枚举时，yield return 返回当前枚举的元素，然后保存这个执行状态
- 到下一次迭代时，从上一次 yield return 处，继续执行。

不妨来做个实验吧！我们把 yield return 上下改成这样：

```csharp
for(int i = 0; i < _users.Length; i++)
{
    Console.WriteLine("Start Yield return #"+(i+1));
    yield return _users[i];
    Console.WriteLine("End Yield return #"+(i+1));
}
```

然后写一个 foreach 方法（没错，实现了 IEnumerable 就能用 foreach 了）

```csharp
UserList userList=new(users);
foreach (User user in userList)
{
    Console.WriteLine("Getting user #" + user.Id);
}
```

试试看吧！

```text
Start Yield return #1
Getting user #1
End Yield return #1
Start Yield return #2
Getting user #2
End Yield return #2
Start Yield return #3
Getting user #3
End Yield return #3
Start Yield return #4
Getting user #4
End Yield return #4
```

看到了吗？枚举的时候发生了这样的事情：

- 获取第一个元素，执行到第一次 yield return，中断
- 获取第二个元素，从上次中断处继续执行，直到遇到下一次 yield return
- ……

因此，返回的不是一个东西，而是一组：yield return 允许你创建一个**全自动管理的**枚举器，不需要手写，会根据需要执行——每一次 yield return，都会吐出一个元素，都是一次**中断与恢复**的过程。

## 结语

对于 LINQ，我们已经进行了非常深入的讲解，还涉及到了 lambda 表达式，以及 yield return 的核心原理。希望你有所收获！
