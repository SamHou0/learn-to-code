---
title: 手把手 CSS 盒子模型
description: 这篇教程详细讲解了CSS盒子模型的基础知识，包括外边距、内边距和边框的概念，以及外边距重叠的规则。还介绍了两种盒子类型（content-box和border-box）的区别，以及行内元素、块元素和inline-block元素的布局特性。适合零基础学习者掌握CSS排版基础。
---

[上一篇](https://blog.samhou.moe/coding-with-grandma-css-basic/)我们讨论了 CSS 基础，把基础 CSS 概念搞清楚了。这篇我们开始学习 CSS 排版。从最基本的盒子模型开始。

## 盒式模型

什么是盒式模型？

顾名思义，就是把元素看作盒子。

先来直观感受下，比如说这是我的博客网站，我们打开开发者工具，然后用 CSS 给每个元素加上 2px 的边框……

![加点边框试试……](https://img.samhou.top/1749528877390.png)

注意到了吗？开发者工具右下角出现了盒子模型。

从内到外，有三条……

1. `padding`，内边距，即元素内容和它的边框之间的距离
2. `border`，边框，包裹在元素外部的框
3. `margin`，外边距，即元素与它的母容器间的距离
现在，我们来搞点简单示例代码看看。

```html
<div class="container">
  <p class="para">Readme</p>
</div>
```

```css
.container {
  background-color: red;
  margin: 50px;
  padding: 30px;
  border: 50px solid blue;
}
.para {
  background-color: white;
  color: green;
  margin: 50px;
}
```

结果是这样的：

![Result](https://img.samhou.top/1749529648587.png)

我们从外面到内部依次解释：

- 由于设定了外边距大小，因此整个界面没有被填满，而是存在留白。可以看到，margin 50px，左右两边存在白色空白。
- 蓝色的部分是容器边框。容器边框设置为了 50px，蓝色。
- 红色部分，可以分成两部分。
    1. 外部容器的内边距。内边距设定为了 30px，因此将内容物向内推动 30px
    2. 内部 p 的外边距。由于内部设定了50px 的外边距，所以和外部容器内边距叠加
- 白色部分，包括 p 元素的文本和边框（因为没有设定，所以看不见边框，为 0px）
- 绿色部分，即文本，是 p 的内容

这部分可以自己搞点代码尝试一下，相信你很快明白了。

## 外边距重叠问题

我们看看另外一个例子，如果我把上面的 html 复制一下，变成这样：

```html
<div class="container">
  <p class="para">Readme</p>
</div>
<div class="container">
  <p class="para">Readme</p>
</div>
```

那么，会是什么效果呢？

> 这不简单~不就是两个东西复制一遍嘛，有什么问题吗？

看起来确实如此：

![效果图](https://img.samhou.top/1749552947845.png)

但如果你观察比较仔细，你会发现，两个蓝色框之间的距离不太对劲。

回看下上面的 CSS：

```css
margin: 50px;
```

我们确实对两个容器都设定了外边距对吧！？那么，实际应该是 50+50=100px 的间距，现在为什么间距和左右侧相同？

这里就涉及到一个重要的知识：**外边距折叠 (Collapse)**

> 区块的上下外边距有时会合并（折叠）为单个边距，其大小为两个边距中的最大值（或如果它们相等，则仅为其中一个），这种行为称为**外边距折叠**。

说人话就是两个外边距撞了取更大的那一个。

但是还有个问题，如果边距为负，比如改一下两个容器的 CSS：

```css
.container1 {
  background-color: red;
  margin: 50px;
  padding: 30px;
  border: 50px solid blue;
}
.container2{
  background-color: red;
  margin: -40px;
  padding: 30px;
  border: 50px solid blue;
}
```

这种情况下，**负边距**出现了，此时我们看看这条缝隙：

![负边距](https://img.samhou.top/1749553408630.png)

是的，它收缩了。当出现正负边距时，取值为**正负相加**，而非较大的那一个。

还有种更加特殊的情况，当出现**双负边距**时，取值为最小的负边距的值。

总结一下：

**符号相同时，取绝对值最大的一方。符号不同时，两个带着符号相加。**

## 不同类型的盒子

接下来介绍两种不同的盒子。相信我，简单到不行。

盒子类型由 `box-sizing` 决定。顾名思义，盒子大小的计算方式。

默认的盒子模型叫 `content-box`，在这种情况下，宽高的设定应用于内容物。

而设定为 `border-box` 后，宽高的设定应用于边框。也就是说，宽度=内容物+两边内边距+两边边框宽度，高度同理。

我们看一个例子：

```html
<div class="default">This is a box with default sizing</div>
<div class="border">This is a box with border box.</div>
```

```css
div{
  background-color: blue;
  padding: 30px;
  margin: 20px;
  color: white;
  border: 10px solid red;
  width: 200px;
  height: 100px;
}
.default{
}
.border{
  box-sizing: border-box;
}
```

直接看图，一目了然。

![看个图就一目了然了](https://img.samhou.top/1749556126905.png)

## 元素的布局

好了，现在你已经知道盒子模型了，是时候来点不一样的了。

通常情况下，我们的元素都是按照 html 来布局的，遵循从上到下的原则。

但是有些时候可能打破这一规则。

display 就是其中一种。

### 行内元素和块元素

*注意：这两个概念有英语翻译过来，分别是  `inline` 和 `block`。是笔者自己翻译的，因为 MDN 的文档也没找到有相关翻译，你可能看到其它译名。*

display 可以拥有两个属性 `inline` 和 `block`。

顾名思义，inline 元素就是在同一行里面的，block 则是一块，自动换行。

还是来点例子吧：

```css
<p>This is an <span style="display:block;border: 1px solid red;">apple with block</span>. I don't like it.</p>

<p>This is an <span style="border: 1px solid red;">apple in the line</span>. I like it.</p>
```

提示：span 元素默认是行内元素。p 默认块元素。

![Block/Inline](https://img.samhou.top/1749554424335.png)

可以看到，块元素占满了整个行。

你可以自行上网查找那些元素默认行内。

### 折中方案？

还有一种折中的方案，叫做 block-inline。话不多说直接上代码：

```css
<p>This is an <span style="display:block;border: 1px solid red;">apple with block</span>. I don't like it.</p>

<p>This is an <span style="border: 1px solid red;padding:30px;">apple in the line</span>. I like it. Wooooosh~~~ More characters here... NOOOOO it's overflowing!!!</p>

<p>This is an <span style="display:inline-block;border: 1px solid red;padding:30px;">apple with inline-block</span>. I like it. Wooooosh~~~ More characters here... this time it's protected</p>
```

这次特地缩小窗口且增加了字符数量，让我们看看效果：

![inline-block](https://img.samhou.top/1749554942468.png)

可以看到，当整个元素过大时，设定为行内会使元素溢出到其它行。如果设置成 `inline-block`，就可以自动推动其他行，**确保该元素不会与其他行重叠**。

## 结语

盒子模型是基础排版的工具。这篇依旧是奶奶风格，手把手划重点，让我们再来梳理一下吧。

- 盒子模型包括外边距、内边距和边框
- 外边距重叠时，符号相同取绝对值最大一个，否则直接加起来
- box-sizing:border-box 允许你直接从边框设置盒子的大小
- 块元素相比于行内元素会换行，用行内元素时可以通过折中方案避免溢出

下一篇是弹性盒子！同样是奶奶级哦！
