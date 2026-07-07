---
title: 手把手 Flexbox
description: 本篇教程深入讲解Flexbox布局的核心概念，重点介绍弹性容器的三大关键属性：flex-grow（控制伸展比例）、flex-shrink（控制收缩比例）和flex-basis（设置基准尺寸）。通过生动示例演示了主轴与交叉轴的方向控制（flex-direction）、元素对齐方式（justify-content/align-items）以及自动换行（flex-wrap）的实现原理。教程采用"奶奶级"易懂方式，配合动态图示展示不同属性值的效果差异，为后续JavaScript学习打下CSS基础。
---

[上一篇](https://blog.samhou.moe/coding-with-grandma-box-model/)讲了盒子模型，今天我们要涉及的主题是 Flexbox。

先来点顾名思义，Flex，折叠；box，盒子。可以折叠的盒子，也称作弹性盒子，就是可以根据可用的空间进行缩放的网页元素。

既然是盒子，那么肯定有容器，又有容器内部的元素。

那么具体怎么缩放呢？我们通过几个例子来看看 Flex 的基本用法……

## 伸展、收缩和基准

Flex 的缩放，影响的是容器内部的元素。

要用 Flex，首先得把容器设置为 Flex。

可以通过设置容器 `display: flex;` 轻易做到这一点。

好了，现在容器变成弹性盒子了，里面的元素会如何布局呢？

让我们看看下面的示例：

```html
<div class="container">
  <div class="content">This is an item</div>
  <div class="content">This is an item</div>
  <div class="content">This is an item</div>
</div>
```

我们还没有增加任何 CSS，这时候，网页元素按照上一篇里面说的正常布局流显示，也就是从上到下。

![正常布局](https://img.samhou.top/1749972914229.png)

那么我们先把它变成弹性盒子试试：

```css
.container{
  display: flex;
}
.content{
  border: 1px solid red;
}
```

是的，现在它们变成了横向堆叠。（方向的问题之后再解释）

![横向堆叠](https://img.samhou.top/1749973020952.png)

现在，我们尝试把可视范围压缩下，当横向没有空间时，会发生什么？

![让我们折叠！](https://img.samhou.top/1749973975452.gif)

可以看到，当横向空间不足，整个元素自动横向收缩。由于字必须显示，因此换行到了第二行。只有一行只有一个单词的时候，才会溢出（因为不能截断单词）

这种行为由 `flex` 属性控制，它是以下三个属性的缩写：

- flex-grow（控制放大）
- flex-shrink（控制收缩）
- flex-basis（控制元素的基础大小）

默认情况下，设置为 `flex: 0 1 auto`

也就是说，上面的代码，与下面都是等效的。

```css
.content{
  border: 1px solid red;
  flex: 0 1 auto;
}
/* 或者，和下面也是等效的 */
.content{
  border: 1px solid red;
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
}
```

我知道你很急，但你先别急。接下来我们就来看看这三个属性。

### flex-grow/shrink

这个元素控制了元素是否伸展，以及不同元素之间的伸展比例。

试一试，把上面值从 0 改成 1。

![伸展的元素](https://img.samhou.top/1749974564473.gif)

发现了吗？现在，元素自动占满了整个空间。也就是说，设定为 0，就是不伸展，非 0，就是允许伸展。

为什么说*非 0* 呢？

因为这个数字表示比例。

也就是说，如果你给不同元素设定不同数字，那么它们就会按照不同的**比例**进行缩放。

比如……

```css
.content1{
  flex-grow: 1;
}
.content2{
  flex-grow: 2;
}
.content3{
  flex-grow: 3;
}
```

自己试一试，你会发现它们按照 1：2：3 进行放大。

也就是说，设定为 100：100 和 1：1 的效果是**完全一致**的。

收缩也同理啦。0 不允许收缩。其它数字就是收缩比例。

### flex-basis

你有没有发现，我们上面都在讨论**缩放**。

当我们谈到缩放时，是对原先就有的东西，进行缩小和放大。

而 flex-basis，就是定义这个“缩放基准”。默认情况下，会根据你的文字长度自动决定，也就是 auto。

现在我们先把放大关掉，然后尝试改变窗口大小：

```css
.content{
  border: 1px solid red;
  flex: 0 1 200px;
}
```

![定义缩放基准](https://img.samhou.top/1749975305927.gif)

看到了吗？当达到 200px 的时候，不再放大，因为不允许放大。200px 为一个基准。

*实际上，使用 width 也可以达到同样的效果。但是，flex-basis 的优先级更高，并且方向会随着 flex 方向改变。*

下面，我们就来聊聊 flex 的方向。

## flex 的轴

看完了放缩，是时候看看 flex 布局元素的方向了！

flex 有两根轴，分别称作*主轴*和*交叉轴*。

在默认情况下，它们如下排列：

![水平堆叠示意图](https://img.samhou.top/1749976220778.png)

元素沿着主轴堆叠。

但是，你也可以手动更改。

用到的属性是 `flex-direction`。写在容器里面。上面的默认值为 `row`。现在我们改成 `column` 试试。

```css
.container{
  display: flex;
  flex-direction: column;
}
.content{
  border: 1px solid red;
}
```

![垂直堆叠](https://img.samhou.top/1749976383064.png)

是的，它变成了垂直堆叠。

现在，变成这样：

![垂直堆叠示意图](https://img.samhou.top/1749976476705.png)

还记得上面我们提到的 flex-basis 吗？

它表示元素在主轴上面的基准，也就是说，如果再次加上上面的基准……

```css
.content{
  border: 1px solid red;
  flex: 0 1 200px;
}
```

![设置基准](https://img.samhou.top/1749976667942.png)

没错，基准的方向是主轴！

**注意了，在设置为 column 时，即使 flex-grow 为 1，也不会自动放大占满屏幕哦。这是因为，你并没有指定容器的高度，因此不会自动拉长。**

你也许注意到了，上面的例子里面，水平方向是占满的。没错，水平方向是会自动占满屏幕的。这和 html 有关，元素默认就有宽度。

## 调整元素布局

要想调整元素的布局，有 3 个重要属性，一定要记住。

### justify-content

这个属性，指定了容器该如何在主轴上面排列元素。

可选的常用值有：

- space-between，容器内子元素间均分空隙，但是元素和两边没有空隙
- space-around，上面的+元素两边也有空隙
- center，元素居中紧密排列
- flex-start，元素排列在主轴开头
- flex-end，元素排列在主轴末尾
速通一下：

```css
.container1,.container2,.container3{
  display: flex;
  margin: 20px 0px;
}
.content{
  border: 1px solid red;
  flex: 0 1 100px;
}
.container1{
  justify-content: flex-end;
}
.container2{
  justify-content: space-between;
}
.container3{
  justify-content: space-around;
}
```

![示例](https://img.samhou.top/1749977442094.png)

其它的几个，请自行探索~

另外注意，可以设置 gap 属性，控制元素间的距离哦。请自行尝试~

### align-item

控制子元素在交叉轴上面的排列。

可选值：

- flex-start/end 同上
- center 同上
- stretch 拉伸占满空间

再来个速通例子：

```css
.container1,.container2,.container3{
  display: flex;
  margin: 20px 0px;
  justify-content: center;
}
.content{
  border: 1px solid red;
  flex: 0 1 100px;
}
.container1{
  align-items: flex-start;
}
.container2{
  align-items: center;
}
.container3{
  align-items: flex-end;
}
```

html 部分有所改动：

```html
  <div class="content" style="height: 50px;">This is an item</div>
  <div class="content" style="height: 30px;">This is an item</div>
  <div class="content" style="height: 20px;">This is an item</div>
```

给加上了高度限定。

效果：

![align-items](https://img.samhou.top/1749977870860.png)

很好理解，这里不再赘述。

最重要的是，这个 stretch。

去掉每个元素的死高度限制，改下代码：

```css
.container1{
  display: flex;
  margin: 20px 0px;
  justify-content: center;
  align-items: stretch;
  height: 100px;
}
```

![示例拉伸](https://img.samhou.top/1749978036813.png)

看到了吗，它拉伸了。

另外，你也可以对于单个元素设置 align-self，改变它在交叉轴上的排列方式。这里不再演示，自己试试就好啦。

### 自动换行

如果主轴上显示不下，你可以设置自动换行。自动换行会根据 flex-basis 进行计算。

设定 flex-warp 即可换行。

```css
.container1{
  display: flex;
  margin: 20px 0px;
  justify-content: center;
  flex-wrap: wrap;
}
.content{
  border: 1px solid red;
  flex: 1 1 200px;
}
```

当元素达到 200px 时，换行标准满足，此时不再收缩，而是直接换行。直到换行仍然无法显示，再进行收缩。也就是说，flex-basis 像是一种建议，浏览器会尽力满足这种建议：

![自动换行](https://img.samhou.top/1749978488338.gif)

注意了，换行后，我们就存在了多根主轴。

既然 align-items 在交叉轴上对齐元素，那么主轴的对齐怎么办？

此时就有了新的属性。

### align-content

~~排列组合~~

改下代码，指定一个容器高度：

```css
.container1{
  display: flex;
  margin: 20px 0px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  align-content: center;/* 把多个主轴在交叉轴上居中在容器内 */
  height: 200px;
}
```

换行后，效果是这样的（注意这个截图不完整，实际上是布局在 200px 正中间的）：

![center](https://img.samhou.top/1749978719605.png)

但是，如果我们改成 space-between。

![space-between](https://img.samhou.top/1749978846184.png)

是的，和前面两个的逻辑完全一样，只不过是改变了对象，涉及主轴的排列罢了。

![直接上示意图！](https://img.samhou.top/1749979428974.png)

## 结语

flexbox 为我们的网页布局提供了非常多的可能性，允许我们创建可缩放的网页。搞清楚这些属性之后，flex 也就不难了。

基础 css 讲完了，下一篇我们将涉及 javascript，同样是简明易懂的奶奶级教程，敬请期待哦。
