---
author: PhilipTKC
title: Dual Monitor Setup in Deepin v20
date: 2020-12-19T00:00:00.001Z
summary: After my initial thoughts of Deepin v20 on release, I was rather disapointed and reverted back to 15.11. After several patches and updates. Deepin v20 is now my daily driver. It's far from perfect, however, It's undeniably beautiful. I digress.
category: DeepinLinux
published: true
---

After my initial thoughts of Deepin v20 on release, I was rather disapointed and reverted back to 15.11. 

After several patches and updates. Deepin v20 is now my daily driver. It's undeniably beautiful. I digress.

Back to the issue.

I have two monitors at two different resolutions. They are vertically centered on a single monitor stand.

1. 1920x1080
2. 3440x1440

In this case I'd like to place monitor 1 in the top center of monitor 2 and that's where my problem started. Monitor 1 would snap either to the top left or right and that was not ideal.

::: flex justify-center
![Dual Monitor Setup](./assets/images/screen-displays-01.png)
:::

Fortunately, I found ARandR, and all my problems vanished.

::: flex justify-center
![Dual Monitor Setup](./assets/images/screen-displays-02.png)
:::

Unfortunately that wasn't the case and while ARandR addresses the issue with monitor placement it does not address the DPI differences between monitors.

## Applying on Startup

Create a file in ~/.config/autostart called `monitors.desktop` with the following content

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

## Final Notes

Hopefully [LittleBigMouse](https://github.com/mgth/LittleBigMouse) will make it's way to Linux.

While my current solution is far from perfect it'll have to do for now.