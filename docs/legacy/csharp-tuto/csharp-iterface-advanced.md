---
title: Csharp接口进阶
---

在 Csharp读书笔记（五）-接口与抽象类 里，曾经讲解过C#接口的基本概念。掌握这些基本概念后，本文将补充一个进阶内容。

## 显式接口成员实现

- 该功能用于为同一个类中实现的不同接口创建不同的方法（方法名称相同）
- 语法：

```csharp
interface I1{void Method(string s);}
interface I2{void Method(string s);}
class MyClass:I1,I2
...
void I1.Method(string s){...}
void I2.Method(string s){...}
```

- 当以上面的方式来创建类中的方法时，仅能通过接口引用访问该方法，无法通过类的引用来访问，即使是同一个类中的方法也不行
- 针对以上问题，可以通过强制转换来进行，举个例子：`((I1)MyClass1).Method`
