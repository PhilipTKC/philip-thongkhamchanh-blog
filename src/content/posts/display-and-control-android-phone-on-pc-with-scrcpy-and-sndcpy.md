---
author: PhilipTKC
title: Display and Control Phone on PC with SCRCPY and SNDCPY
date: 2020-12-19T00:00:00.000Z
summary: This blog article will simply be a guide to installing Scrcpy and Sndcpy on a fresh install of Deepin v20. Scrcpy is an application that provides display and control of Android devices connected on USB.
category: Android
published: true
---

This blog article will simply be a guide to installing Scrcpy and Sndcpy on a fresh install of Deepin v20.

## Scrcpy

### What is Scrcpy?

Scrcpy is an application that provides display and control of Android devices connected on USB.


### The Problem

Installing Scrcpy from snapcraft without issue.

### The Steps

```
sudo apt update
sudo apt install snapd
sudo snap install core
sudo snap install scrcpy
```

```
snap run scrcpy
```

However that wasn't the case. I had run into the following problem.

::: text-sm
```
INFO: scrcpy 1.16 <https://github.com/Genymobile/scrcpy>
/usr/local/share/scrcpy/scrcpy-server: 1 file pushed. 11.6 MB/s (33622 bytes in 0.003s)
libGL error: No matching fbConfigs or visuals found
libGL error: failed to load driver: swrast
X Error:  GLXBadContext
  Request Major code 151 (GLX)
  Request Minor code 6 ()
  Error Serial #116
  Current Serial #115
s
```
:::

### Removing Scrcpy

```
snap disable scrcpy
snap remove scrcpy
```

### The Solution

After several failed google-fu attempts I finally found a solution that worked, albeit rather a bit tedious to get up and running.

Building the application from source!

### Requirements

Run the following in terminal.

```
# runtime dependencies
sudo apt install ffmpeg libsdl2-2.0-0 adb

# client build dependencies
sudo apt install gcc git pkg-config meson ninja-build \
                 libavcodec-dev libavformat-dev libavutil-dev \
                 libsdl2-dev

# server build dependencies
sudo apt install openjdk-8-jdk
```

### Android Studio

Download [Android Studio](https://developer.android.com/studio){target="_blank"} and extract the folder.

```
cd android-studio/bin
./studio.sh
```

Once Android Studio has finished installing, You can quit the application.

Next we'll need to accept the licenses.

```
yes | sudo ~/Android/Sdk/tools/bin/sdkmanager --licenses
```

### Preparing the Installation

Run the following in terminal.

```
export ANDROID_SDK_ROOT=~/Android/Sdk
```

Clone Scrcpy, if you haven't already you'll need to install Git.

```
sudo apt install git
```

Otherwise run the following.

```
git clone https://github.com/Genymobile/scrcpy
cd scrcpy

meson x --buildtype release --strip -Db_lto=true
ninja -Cx
```

### Installing

```
sudo ninja -Cx install 
```

### Running Scrcpy

Before running scrcpy, Make sure your phone has has the following Developer Options enabled.

- USB Debugging

You can now run the following in terminal.

```
scrcpy
```

If everything went OK, you should see your phone screen on your PC!

## Sndcpy

Unfortunately, Scrcpy only copies your screen and does not forward audio, that's where Sndcpy comes in.

### Requirements

- Android 10
- VLC

You can install VLC by running the following in terminal

```
sudo apt install vlc
```

### Download

You can download Sndcpy from the following page - [Sndcpy](https://github.com/rom1v/sndcpy/releases){target="_blank"}

### Running Sndcpy

Before running Sndcpy you will need to enable the following Developer Options

- Install via USB - Allow installing apps via USB
- USB Debugging (Security Settings) - Allow granting permissions and simulating input via USB debugging.

Extract sndcpy and run the following in terminal.

```
cd sndcpy
./sndcpy
```

You will be prompted to run Sndcpy on your device. Press "Start Now" and hit enter in terminal once authorized.

# Scrcpy + Sndcpy = <3

