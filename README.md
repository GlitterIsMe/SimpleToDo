# Daily Todo List - 可安装应用包

## 📦 文件说明

```
.
├── todo-list-pwa.tar.gz          # PWA 应用文件包（主应用）
├── 安装指南.md                    # 详细安装说明
├── 原生应用打包指南.md             # Windows/Android 原生应用打包
├── deploy.js                     # 快速部署脚本
└── README.md                     # 本文件
```

## 🚀 快速开始

### 1. 部署 PWA（推荐）

解压 `todo-list-pwa.tar.gz`，将 `dist` 文件夹部署到静态托管服务：

```bash
# 解压
tar -xzf todo-list-pwa.tar.gz

# 部署到 GitHub Pages
# 参考：安装指南.md

# 或使用快速部署脚本
node deploy.js
```

部署后访问网址，浏览器会提示安装应用。

### 2. 本地测试

```bash
cd dist
python3 -m http.server 8080
# 访问：http://localhost:8080
```

### 3. 生成原生安装包

#### Windows 可执行文件

**方法 1：使用 PWA Builder**（最简单）
1. 部署 PWA 后获得网址
2. 访问 https://www.pwabuilder.com
3. 输入网址，选择 Windows
4. 下载 MSIX 安装包

**方法 2：使用 Electron**
1. 按原生应用打包指南.md 配置
2. 运行 `npm run dist`
3. 生成 .exe 安装程序

#### Android APK

**方法 1：使用 PWA Builder**（最简单）
1. 部署 PWA 后获得网址
2. 访问 https://www.pwabuilder.com
3. 输入网址，选择 Android
4. 下载 APK 文件

**方法 2：使用 Bubblewrap**
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.json
bubblewrap build
```

---

## 📖 详细文档

- **安装指南.md** - PWA 安装、部署、使用说明
- **原生应用打包指南.md** - Windows/Android/iOS 原生应用打包完整教程

---

## ✨ 应用特性

- 📝 添加、编辑、删除任务
- 🎨 设置优先级（低/中/高）
- 📅 设置截止日期
- 🔴 过期提醒
- 📱 PWA 支持（可安装）
- 💾 数据本地存储
- 🌐 离线使用

---

## 🌐 在线演示

部署后访问你的 PWA 网址即可使用。

---

## 📞 技术支持

遇到问题请查看：
- 安装指南.md - 常见问题解答
- 原生应用打包指南.md - 打包问题

---

**祝你使用愉快！** 🎉
