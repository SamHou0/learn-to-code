---
title: 类、初始化、预处理和分离式编译
description: 本文以通俗语言讲解了C++类的基本概念、成员初始化方法、构造函数、模块化开发、预处理器、分离式编译及作用域运算符的用法，让初学者能轻松理解并避免常见错误，为后续学习面向对象打下基础。
---

[上一节](https://blog.samhou.moe/cpp-function-pointer-type/)，我们讲了函数指针。现在，我们来仔细聊聊类这个东西。

在 C++ 中，类是一种自定义的抽象数据结构，允许你把一组相关的数据存储到一起。什么叫**抽象**数据结构呢？其实就是给一个东西建模，让单个数据*代表*这个东西。

有了大体的概念，让我们来看看类到底是怎么玩的。

## 自定义数据类型

先来一段简单的代码：

```cpp
struct Person {
    string name;
    int age;
};
int main() {
    Person user;
    user.name = "SamHou";
    user.age = 114514;
    cout << user.name << ' ' << user.age << endl;
    // SamHou 114514
}
```

我们在此使用了 struct 关键字，来定义属于自己的类。`Person` 是这个类的**名字**，包含在名字后面大括号中的，称为类的**成员**。大括号外需要一个分号，表示这个类的结尾。

现在来看 main 函数。

首先，我们创建了一个 Person 类的**实例**（也叫**对象**），它的名字叫做 user。

那什么叫创建实例呢？你可以这么理解：类是一种**蓝图**，规定单个数据类型中，**应该有**哪些成员。当我们创建实例的时候，就是根据这个蓝图建了一个“房子”（也就是存在于内存中的独立对象）。

每个对象可以用自己的名字找到，也因此可以根据名字访问对象的成员。因此**修改不同对象的成员**，并**不会影响其它对象**（即使它们是由同一个蓝图建立的）。

在之前的文章中，我们已经用了很久这个 `.` 了。它表示的是，访问一个类的成员，称之为**成员运算符**。

因此，上面的代码表示，我们把 name 成员改成了 "SamHou" 这个字符串，然后把 age 改成了 114514；然后用同样的方法，再输出。

要注意的一点是，任何东西（包括类）都要遵循[名字作用域和对象生命周期规则](https://blog.samhou.moe/cpp-return-scope-life/#%E4%BD%9C%E7%94%A8%E5%9F%9F%E5%92%8C%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)。如果你忘了，可以复习一下。

基本用法很简单，不是吗？但我们得仔细再深入挖一下。

比如，这时候你可能就有个疑问了——创建一个类的实例的时候，里面的成员会怎样初始化呢？换句话说，那个 user 的 name 和 age 默认是什么呢？

这就要来讨论下初始化的问题了。

## 类成员的初始化

### 默认初始化

如果你**什么都不添加**，那么类会执行默认初始化。在这个过程中，**每个成员**都会执行其*自身*的**默认初始化**。

我们回看上面的程序：

```cpp
struct Person {
    string name;
    int age;
};
```

string 的默认初始化会创建空字符串。而 int 类型的默认初始化，则会变成一个不可预测的随机值（未定义的值）。

也就是说——你或许根本不知道会发生什么。如果你的类里面有指针类型，那就更麻烦了，未定义的指针谁也不知道指向了什么，这种行为是非常危险的。

因此，我们先来说说最简单的初始化——*类内初始值*。

### 类内初始值

类内初始值，和给变量初始化的语法就是一样的：

```cpp
struct Person {
    string name = "Example name";
    int age = 114;
};
int main() {
    Person user;
    cout << user.name << ' ' << user.age << endl;
    // Example name 114
}
```

我们通过直接写 = 的方式，给每个类的成员赋了初始值。

在上面的代码中，我们创建实例之后，并没有对这个实例做任何修改。因此，输出的就是默认值。

但是，有时候一行也太局限了，有没有一种更加灵活的方式，允许我们进行更加自定义的操作呢？

当然是有的——这叫做**构造函数**。

### 构造函数

顾名思义，构造函数就是类根据蓝图，创建实例时，**执行的初始化函数**。

```cpp
struct Person {
    string name = "Example name";
    int age = 114;
    int passKey;
    Person(string n, int a, int password) {
        name = n;
        age = a;
        passKey = age + password;
    }
};
```

构造函数是一个和**类同名**的**无返回值**函数，接受自定义的参数，然后执行自定义操作。可以直接在构造函数内，通过名字访问类的成员，不需要使用成员运算符（构造函数的作用域里也没有这个实例的名字）。

*实际上，这种访问类成员的行为和 this 指针有关。将在下一篇详细解读。*

在上面的代码中，我们接受了 n a password 三个值，然后把 n a 赋值给成员，再根据 age 和 password 生成 passKey。（注意：**这是一个构造函数示例。千万不要理解为任何密码生成方法**）

定义好构造函数后，创建实例时怎么调用呢？来看看吧：

```cpp
int main() {
    Person user("SamHou", 114514, 233);
    cout << user.name << ' ' << user.age << endl;
    // SamHou 114514
    cout << user.passKey << endl;
    // 114747
}
```

Great! 直接在名字后面带上参数列表，即可调用构造函数！

提示：**实际上，初始化和在函数体内赋值属于不同的操作。在下一小节内，我们会详细阐述这个问题。先留个基本印象。**

现在让我们回到构造函数。我们不禁在想：有那么多参数通常不需要执行自定义操作，而是直接赋值给类的成员，有没有什么更加简便的方法，来执行初始化呢？

C++ 设计者早就考虑到了。下面是一个等价的定义：

```cpp
struct Person {
    string name = "Example name";
    int age = 114;
    int passKey;
    Person(string n, int a, int password): name(n), age(a) {
        passKey = age + password;
    }
};
```

注意到了吗？我们直接在参数列表后，块之前用冒号加入了一个新的列表。这个列表通过初始化类成员的方式，为成员赋初始值，这叫作**构造函数初始化列表**。

另外也要注意优先级的问题。

永远记住，构造函数中的赋值操作优先级，高于构造函数初始化列表，最后才是类内初始值。为什么？你别急，看看下面就知道了。

### 合成的默认构造函数、初始化列表、重载

刚才我们讨论了自定义构造函数的情况。那么问题来了——如果构造函数不存在，那么会发生什么呢？

嗯，你肯定已经知道了，我们上面也提到过：会首先根据类内初始值。如果类内初始值不存在，那么就会对每个成员，执行默认初始化。

表象是这样的，但是探究一下本质。实际上，C++ 在没有构造函数的情况下，生成的是一个合成的**默认构造函数**。

这个函数的行为你也很清楚了，上面的“表象”刚刚说过。

正如其他函数一样，构造函数也可以重载，因此我们在自定义构造函数之外，用 default 可以把默认构造函数“找回来”：

```cpp
struct myClass{
    myClass() = default; // 执行默认行为，也就是允许 myClass mc;
    myClass(int a,...)...
}
```

好的，现在回到自定义构造函数。刚才我们提到了优先级问题，现在来看看构造函数初始化列表到底怎么工作的：

1. 如果构造函数初始化列表存在，那么忽略*对应的***类内初始值**，转而采用初始化列表对成员进行*初始化*。
2. 执行完此类初始化操作**后**，开始执行**构造函数体**。

哦，现在你知道问题所在了——**构造函数初始化列表**和**类内初始值**都属于**初始化操作**。但是函数体内的呢？是赋值操作。既然有这么个“初始化 - 赋值”的运行顺序，自然就表现出这种优先级了（后执行的，永远会取代旧的初始化）。

构造函数中的**赋值**操作 > 构造函数**初始化列表** > 类内**初始值**。

聪明的读者一定发现了，*初始化*和*赋值*这两个概念我们非常熟悉对吧？我们在 [const 限定符与指针](https://blog.samhou.moe/cpp-pointer-const-guide/)这一节中，重点提过它们的区别，可以复习一下。

之所以提 const，是因为一个非常重要的事情。

如果是顶层 const，则一旦初始化就不能改变。因此，这一类成员**仅仅可以通过构造函数初始化列表或类内初始值**进行初始化，不能在构造函数里面再赋新的值。

## 模块化开发

### 头文件和源文件

在此之前，我们所创建的所有类，都是把函数体写在类内的。但实际上，C++ 更加推荐的一种方式，是把一个类的函数*声明*放在**头文件**里面，把函数*定义*放在**源文件**里面。

我们在[函数与参数传递](https://blog.samhou.moe/cpp-func-arg-guide/#%E5%A3%B0%E6%98%8E%E5%92%8C%E5%AE%9A%E4%B9%89)这一节，曾经讲过声明和定义的区别，以及 `#include` 头文件即可直接使用的好处。

现在我们写的程序越来越长，于是不得不进行*模块化设计*（把负责不同工作的代码放到**不同文件**中），因此有必要说清楚以下概念的区别：

- 头文件：用于**声明**。类的所有成员声明应该放在这里，包括数据成员和函数成员
- 源文件：用于**定义**。必须实现声明中的所有函数成员，否则在调用时就会爆炸
- 它们一般是独立的文件。
- C++ `#include` 头文件后，即可直接使用
- 如果不把声明放在头文件里面，非常容易导致重复定义（声明可以多次、但是**定义只能一次**，下面会详细解释问题的根源）

来看例子，上面的程序如果进行模块化——

```cpp
// Person.h
#ifndef PERSON_INCLUDED
#define PERSON_INCLUDED
#include<string>
struct Person {
    std::string name = "Example name";
    int age = 114;
    int passKey;

    Person(std::string n, int a, int password);
};
#endif // PERSON_INCLUDED
```

```cpp
// Person.cpp
#include "Person.h"

Person::Person(std::string n, int a, int password) // 先记住这个 :: 我们会详细解释这是什么
    : name(n), age(a) {
    passKey = age + password;
}

```

Main 函数不发生改变：

```cpp
// main.cpp
#include <iostream>
#include <vector>
#include "Person.h"
using namespace std;
int main() {
    Person user("SamHou", 114514, 233);
    cout << user.name << ' ' << user.age << endl;
    cout << user.passKey << endl;
}

```

看到了吗？我们只在主程序中 include 了头文件，声明就已经完成了。C++ 编译了定义，然后自动拼接起来——因此不需要 include 源文件。

要注意的点是，数据成员和类内初始值应该放在头文件里面，构造函数的声明在头文件中不要包含初始化列表，而是要放在源文件定义中。

要想深入了解编译的细节，我们要知道代码真正变成程序的过程中到底发生了什么。实际上，有三个重要阶段：预处理、分离编译、链接，让我们从代码出发，一步步讲清楚。

### 预处理和分离式编译

你可能有个大疑问，这个 `#include` 到底是做什么的？为什么加上了，头文件里面的声明就能用了？

这就要提到编译之前的**预处理 (preprocessing)** 了。当你看到这个神奇的 # 号的时候，说明它是一个预处理命令，发生在实际的编译之前。

而 `#include` 这个预处理命令，就是把**紧随其后**的头文件，直接**复制**到这个源代码文件中。也就是说，编译只对处理过后的 .cpp 源代码生效，而头文件早已经被复制进去了。

啥意思？你的代码在你执行编译之前，其实变成了这个样子：

```cpp
// Person.cpp

// #include "Person.h" 现在不存在了！
// 内容被复制过来了！
#ifndef PERSON_INCLUDED
#define PERSON_INCLUDED
#include<string>
struct Person {
    std::string name = "Example name";
    int age = 114;
    int passKey;

    Person(std::string n, int a, int password);
};
#endif // PERSON_INCLUDED
Person::Person(std::string n, int a, int password) // 先记住这个 :: 我们会详细解释这是什么
    : name(n), age(a) {
    passKey = age + password;
}
```

```cpp
// main.cpp
// #include <iostream> 没错，这玩意也要复制
...
// #include <vector> 还有这个
...
// #include "Person.h"
// 内容被复制过来了！
#ifndef PERSON_INCLUDED
#define PERSON_INCLUDED
#include<string>
struct Person {
    std::string name = "Example name";
    int age = 114;
    int passKey;

    Person(std::string n, int a, int password);
};
#endif // PERSON_INCLUDED
using namespace std;
int main() {
    Person user("SamHou", 114514, 233);
    cout << user.name << ' ' << user.age << endl;
    cout << user.passKey << endl;
}
```

哦非常的厉害，`.h` 直接消失了！现在我们假装自己是编译器，分别编译这两个文件（没错，这就叫作*分离式编译*，每个文件分别编译然后链接起来变成程序）：

- 编译 `Person.cpp`
    - 声明 Person，包括其成员。
    - 用作用域运算符 `::`（下方介绍），定义 Person 的成员
- 编译 `main.cpp`
    - 声明 Person，包括其成员
    - 因为声明了，就可以直接使用，这在编译阶段没有任何问题

现在进行链接，把这些文件拼起来：

- 找到了 Person 的声明。对应的构造函数确实只在 `Person.cpp` 里面定义了一次，没问题！

了解了 `#include` 和分离式编译，现在我们来解答上面的问题——到底为啥不能把定义写进头文件？

### 重复定义问题

来看看这个例子（只是个让你明白为啥不能这么写的小例子，别太关注具体的内容）：

```cpp
// add.h
#ifndef ADD_INCLUDED
#define ADD_INCLUDED
int add(int a, int b)
{
    return a + b;
}
#endif // ADD_INCLUDED
```

```cpp
// main.cpp
#include <iostream>
#include "add.h"
using namespace std;
int main()
{
    cout << add(1, 2) << endl;
}
```

```cpp
// myMath.cpp
#include "add.h"
int sum(int a, int b, int c)
{
    return add(a, b) + c;
}
```

试着编译一下——

```text
D:\code\Cpp\test\add.h|3|multiple definition of `add(int, int)'; obj\Debug\main.o:D:/code/Cpp/test/add.h:3: first defined here|
```

果不其然，炸了。这个错误出现在链接阶段，因为经过预处理，编译阶段变成了这样：

```cpp
// main.cpp
#include <iostream>
#ifndef ADD_INCLUDED
#define ADD_INCLUDED
int add(int a, int b)
{
    return a + b;
}
#endif // ADD_INCLUDED
using namespace std;
int main()
{
    cout << add(1, 2) << endl;
}
```

```cpp
// myMath.cpp
#ifndef ADD_INCLUDED
#define ADD_INCLUDED
int add(int a, int b)
{
    return a + b;
}
#endif // ADD_INCLUDED
int sum(int a, int b, int c)
{
    return add(a, b) + c;
}
```

没有任何问题，但是当链接到一起的时候，问题来了——

**在两个源文件里面，都有 add 这个函数的定义！**

C++ 就不允许多次定义，所以直接报错了。

从上面的内容，我们可以得出下面的结论：

**如果你把定义写在头文件里，一旦多个源文件引用了这个头文件，那么相当于重复定义，这是会直接报错的。**

因此，请确保你在头文件里面只写声明！

一个小提示：你是不是在想：“为什么这里不拿上面的类来做例子呢”？这是因为如果直接在类内定义函数，那么这个函数就会默认变成 `inline` 的。inline 的函数是一个*特例*，它**允许重复定义，不过这些定义必须全部相同**。

### 作用域运算符

等等，上面还有一个十分神奇的符号：

```cpp
Person::Person(std::string n, int a, int password)
```

这是个啥？它叫作**作用域运算符**。让我们回忆一下之前的[作用域](https://blog.samhou.moe/cpp-return-scope-life/?highlight=%E4%BD%9C%E7%94%A8#%E5%90%8D%E5%AD%97%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F)一个小节中的内容……

 > 让名字具有意义的地方，就叫做作用域（起作用的地方）。
 > 在 C++ 中，名字的作用域，一般是一对花括号，也就是块（或者整个程序）。
 > 一旦在作用域中声明（不是定义）一个名字，那么它就在该声明语句到作用域末尾有效。

 哦，这下清楚了——我们在类的外面写函数的定义，那么处于类的定义域之外，当然就找不到对应的名字了。

作用域运算符，能够指定**名字所在作用域**。Person 这个类后面的大括号组成了块，属于独立的作用域。因此 `Person::Person()` 的含义，就是去 Person 这个名字对应的作用域里面，找一个名字为 Person 的函数。

我们来画个图：

![作用域示例](https://img.samhou.top/1774100618142.webp)

Person 这个类所在的有效区间是最大的，以红色框标识。因此，`Person::` 可以找到 Person 这个类。黄色框标识 Person 类内的一个作用域，`Person::` 把作用域限定在了这里面。然后，在黄色框中查找 `Person` 这个名字，找到对应的构造函数 `Person()`（蓝色框是它的有效区间，这里用不着，只是给你标出来而已）。

也就是说，这个 :: 可以转换作用域，让目标名字被我们所找到，在类外定义类的成员函数时，是必须的！

现在，你对类的工作方式和分离式编译已经有了一些基本了解了。下一节，我们将继续探索类中的一个重要概念，this 指针。然后进入面向对象的一个特征——封装，你将会学习对你的类进行访问控制。同样是通俗易懂的语言，下一篇再见！
