---
title: C# 强制设置系统焦点(前台窗口)
---

## 系统焦点

在Windows中，系统的焦点就是当前处于前台的窗口。通过设置焦点，可以控制用户正在使用的应用程序。这里以winform应用为例。

## Api调用

C#需要调用Win32 Api才可以控制焦点，这里用到的是user32.dll中的SetForegroundWindow()函数

在微软提供的文档中[1]，可以看到C++里的用法：

```Cpp
BOOL SetForegroundWindow(
  [in] HWND hWnd//窗口句柄
);
```

C#里没有HWND类型，与之对应的是IntPtr类型，所以可以这样导入Api[2]

```Csharp
using System.Runtime.InteropServices;//这是调用所必须的
[DllImport("user32.dll")]//调用dll
public static extern bool SetForegroundWindow(IntPtr handle);//这个函数签名必须和文档一模一样
```

下面来调用导入的内容（以设置edge浏览器为例子）

```Csharp
Process[] processes = Process.GetProcessesByName("msedge");//查找edge浏览器进程
IntPtr handle = processes[0].MainWindowHandle;//获取主窗口句柄
SetForegroundWindow(handle);
```

但是，文档上指出这样设置需要满足几个条件中的任意一个：

>此过程是前台进程。/进程由前台进程启动。/进程收到了最后一个输入事件。/没有前台进程。/正在调试该过程。/前台进程不是新式应用程序或“开始”屏幕。/前台未锁定， (请参阅 [LockSetForegroundWindow](https://learn.microsoft.com/zh-cn/windows/desktop/api/winuser/nf-winuser-locksetforegroundwindow)) 。/前台锁定超时已过期， (在 [SystemParametersInfo](https://learn.microsoft.com/zh-cn/windows/desktop/api/winuser/nf-winuser-systemparametersinfoa)) 中看到**SPI_GETFOREGROUNDLOCKTIMEOUT**。/没有活动菜单。/当用户使用另一个窗口时，应用程序无法强制将窗口强制到前台。 相反，Windows 会闪烁窗口的任务栏按钮以通知用户。

这样就不能说是强制设置了（注意，调试程序时系统允许强制设置，但只要离开调试器，就不行了），所以下面给出一个特别的方法。

## 强制设置

Windows中，只要是新启动的窗口，总是能够获得系统的焦点。所以只要让程序重新启动，就能拿到焦点，变成前台进程，此时就可以设置焦点，达到强制的效果。

这里还用到了另一个Api `GetForegroundWindow()`用于获取当前焦点[3]，调用方式同上，此处不再解释。

```Csharp
[DllImport("user32.dll")]
public static extern IntPtr GetForegroundWindow();
...
Process[] processes = Process.GetProcessesByName("msedge");
IntPtr handle = processes[0].MainWindowHandle;
SetForegroundWindow(handle);
if (handle!=GetForegroundWindow())
{
     Process.Start(Application.ExecutablePath);
     Environment.Exit(0);//重启
}
```

注意，该方法仅30%成功率，若连续10次重启仍未获得焦点，建议放弃(

## 参考文献

https://learn.microsoft.com/zh-cn/windows/win32/api/winuser/nf-winuser-setforegroundwindow

https://www.cnblogs.com/code1992/p/5965997.html

https://learn.microsoft.com/zh-cn/windows/win32/api/winuser/nf-winuser-getforegroundwindow
