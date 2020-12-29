---
author: PhilipTKC
title: Dual Monitor Setup in Deepin v20
date: 2020-12-19T00:00:00.001Z
last_updated: 2020-12-29T00:00:00.001Z
summary: I have two monitors at two different resolutions. They are vertically centered on a single monitor stand.
category: DeepinLinux
published: true
---

I have two monitors at two different resolutions. They are vertically centered on a single monitor stand.

1. 1920x1080
2. 3440x1440

In this case I want to place monitor 1 on the top center of monitor 2, however Monitor 1 would snap either to the top left or right.

::: flex justify-center
![Dual Monitor Setup](./assets/images/screen-display-01.png)
:::

Fortunately, I found ARandR, and hoped all my problems would vanish, unfortunately that wasn't the case and while ARandR addresses the issue with monitor placement it does not address the DPI differences between monitors which causes the mouse placement to be misaligned when moving between screens.

## The Solution

ARandR does not apply the configuration on startup, fortunately we're able to execute shell scripts on load.

### Applying on Startup

Create a file in ~/.config/autostart called `monitors.desktop` with the following content.

Replace `Exec="path/to/script"`

```
[Desktop Entry]
Type=Application
Exec="~/.screenlayout/default.sh"
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Monitors
```

Running a single monitor with the script enabled on startup may cause scaling to be increased which is present on DeepinLinux v20. 

While my current solution is far from perfect it'll have to do for now.

Hopefully [LittleBigMouse](https://github.com/mgth/LittleBigMouse) will make it's way to Linux.