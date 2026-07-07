---
title: C# Winform 窗口拖动详解
---
## 代码实现

- 首先，在设计器里双击增加以下三个方法，然后填入以下代码

```csharp
        private Point mouseLocation;//表示鼠标对于窗口左上角的坐标的负数
  private bool isDragging;//标识鼠标是否按下
        private void MainWindow_MouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                mouseLocation = new Point(-e.X, -e.Y);
                //表示鼠标当前位置相对于窗口左上角的坐标，
                //并取负数,这里的e是参数，
                //可以获取鼠标位置
                isDragging = true;//标识鼠标已经按下
            }
        }

        private void MainWindow_MouseMove(object sender, MouseEventArgs e)
        {
            if (isDragging)
            {
                Point newMouseLocation = MousePosition;
                //获取鼠标当前位置
                newMouseLocation.Offset(mouseLocation.X, mouseLocation.Y);
                //用鼠标当前位置加上鼠标相较于窗体左上角的
                //坐标的负数，也就获取到了新的窗体左上角位置
                Location = newMouseLocation;//设置新的窗体左上角位置
            }
        }

        private void MainWindow_MouseUp(object sender, MouseEventArgs e)
        {
            if (isDragging)
            {
                isDragging = false;//鼠标已抬起，标识为false
            }
        }
```

## 详解

- 鼠标在窗体上按下时，窗体跟随鼠标，鼠标抬起时，窗体停止移动
- 窗体的Location属性为**左上角**的坐标
- 为了实现拖动，需要获取2个坐标：鼠标相较于窗体左上角的位置，以及鼠标现在的坐标
- 举个例子：按下鼠标时，鼠标位置(300,400)，获取鼠标相较于窗体左上角位置为(150,100)，那么此时窗体位置是(150,300)，鼠标移动到(300,401)，那么此时窗体位置应该是(150,301)。也就是说，新的窗体位置就是新的鼠标位置减去一开始鼠标相较于窗体左上角位置
- 调用.OffSet()，就是把前面的坐标加上括号里的坐标，比如上面的例子，newMouseLocation是(300,401)，mouseLocation把鼠标相较于窗体左上角位置作为负数存储，mouseLocation是(-150,-100)，那么新的newMouseLocation就是(150,301)了~
