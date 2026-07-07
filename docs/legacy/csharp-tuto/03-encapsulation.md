---
title: （三）-封装
date: 2022-01-23 20:45:22
tags:
- csharp
- hfc
categories: csharp读书笔记
---
## 封装

- 封装保证类中一些数据是私有的
- 私有字段、方法只能在类内部访问，使用关键字`private`
- 封装可以避免不必要的错误

### 属性

- 属性对于其他对象来说就是[[Csharp读书笔记（一）-对象与引用#^52e61c|字段]]
- 可以通过属性获取或设置一个后备字段
- 属性首字母大写，后备字段应小写
- **属性的好处：在获取或设置时可以执行一些语句（比如设置一些有关的字段），防止直接更改字段导致逻辑计算错误**
- 获取`get`
- 设置`set`
- 每个`set`都有一个名为`value`的参数，获取的是设置的值
- 可以只设置`get`或`set`中的一个
- 举例：

```csharp
private int numberOfComputers;//这是一个后备字段
private int displays;//这是另一个字段
public int NumberOfComputers//这是一个属性
{
 get
 {
  return numberOfComputers;
 }
 set
 {
  numberOfComputers = value;//设置后备字段
  displays = value*2;
  /*举例，每台电脑需要2个显示器，
  *这样封装可以防止直接从外部
  *修改displays，
  *而外部代码可能发生错误导致dispalys不是2倍
  *这就避免了不必要的错误
  */
 }
}
```

- 在窗体应用执行`Console.WriteLine()`时，输出显示在`output`窗口
- 输入`prop`，再按下tab，会向代码中添加一个自动属性

### 构造函数

- 构造函数会在类创建时执行
- 构造函数没有返回值
- 添加构造函数时，需要添加一个与类同名的方法，但是没有返回值
- 构造函数可以用来在创建[[Csharp读书笔记（一）-对象与引用#^be690f|实例]]时为私有变量指定值
- 当然也可以做更多事情

### 知识拓展

- 方法的第一行包含存取修饰符、返回值、名字和参数，这些称之为签名
- 属性也有签名
