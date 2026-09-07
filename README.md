# 思花｜手机端交互作品

这是已经适配手机浏览器的 p5.js 静态项目，可以直接部署到 GitHub Pages。

## 上传方法

1. 在 GitHub 新建一个 **Public** 仓库。
2. 点击 **Add file → Upload files**。
3. 将本项目中的 `index.html`、`style.css`、`sketch.js` 和 `README.md` 一起上传到仓库根目录。
4. 点击 **Commit changes**。
5. 进入 **Settings → Pages**。
6. 在 **Build and deployment** 中选择 **Deploy from a branch**。
7. Branch 选择 **main**，目录选择 **/(root)**，然后点击 **Save**。

发布后的访问地址通常为：

```text
https://你的用户名.github.io/仓库名称/
```

首次发布或更新可能需要等待几分钟。

## 交互方式

- 手机：按住画面并滑动。
- 电脑：按住鼠标并拖动。

## 文件说明

- `index.html`：GitHub Pages 入口文件。
- `style.css`：手机全屏、刘海安全区与等比缩放适配。
- `sketch.js`：作品完整代码。

作品内部坐标仍然保持为 `800 × 1060`，原有构图和动画参数没有被修改。
