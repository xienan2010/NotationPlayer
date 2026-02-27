# NotationPlayer - 五线谱识谱练习

一个基于 Web 的五线谱识谱练习工具。支持高低音谱号切换、多种键盘映射方案，并支持 MIDI 设备输入。

## 功能特点

- **实时渲染**：使用 VexFlow 库高清渲染五线谱音符。
- **多种输入**：
  - **电脑键盘**：支持两种映射方案（按音名或钢琴布局）。
  - **MIDI 支持**：连接 MIDI 键盘即可进行练习。
- **统计反馈**：实时统计正确数、错误数及准确率，提供即时视觉和听觉反馈。
- **谱号切换**：支持高音谱号 (Treble) 和低音谱号 (Bass) 练习。

## 如何运行

1. 下载或克隆本项目。
2. 在浏览器中打开 `index.html` 即可开始使用。

## 技术栈

- HTML5 / CSS3
- JavaScript (Vanilla JS)
- [VexFlow](https://www.vexflow.com/) - 音乐符号渲染
- Web Audio API - 音效播放
- Web MIDI API - MIDI 设备支持

## 键盘映射说明

- **方案 A**: A-G 键对应音名 C, D, E, F, G, A, B。
- **方案 B (钢琴布局)**: A, S, D, F, G, H, J 对应 C, D, E, F, G, A, B。
