---
title: （二）-数组
date: 2022-01-22 20:45:08
tags:
- csharp
- hfc
categories: csharp读书笔记
---
## 数组

- 数组是一组变量，可以存储和修改多个数据
- 创建数组时，需要指定类型、名称和元素数量
- 可以为[[Csharp读书笔记（一）-对象与引用#引用|引用]]创建数组，但是创建时只会创建引用变量，不会创建实例
- 必须分别为每一个对象创建实例
- 数组的索引是从0开始的
- 比如，创建一个元素数量为6的int数组，`int[] numbers=new int[6]`，此时访问`numbers[5]`，这时获取的元素为第6个
- `Random`类可以随机生成数字
- 使用时，先创建实例，再使用`Next()`方法，举例：调用`GetRandom()`时，以下代码会返回一个9到100间的随机整数

  ```csharp
  public Random Randomizer;
  public int GetRandom()
  {
    return(Randomizer.Next(9,100));
  }
  ```

- 对价格使用decimal类型时，要在值后面加上M
