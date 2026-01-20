#!/usr/bin/env node

/**
 * Daily Todo List - PWA 快速部署脚本
 * 
 * 支持部署到：
 * - GitHub Pages
 * - Vercel
 * - Netlify
 * - 本地服务器
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDistFolder() {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    log('❌ 错误：找不到 dist 文件夹，请先运行 npm run build', 'red');
    process.exit(1);
  }
}

function deployToGitHubPages() {
  log('\n🚀 部署到 GitHub Pages...', 'cyan');
  
  try {
    // 检查 git 状态
    execSync('git status', { stdio: 'pipe' });
  } catch (error) {
    log('❌ 错误：当前目录不是 git 仓库', 'red');
    log('请先运行：git init', 'yellow');
    return;
  }

  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // 添加 homepage 字段
    packageJson.homepage = 'https://your-username.github.io/your-repo-name';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    log('✅ 已更新 package.json 中的 homepage 字段', 'green');
    log('请修改 homepage 为你的 GitHub Pages 地址', 'yellow');
  }

  log('\n📋 后续步骤：', 'magenta');
  log('1. 修改 package.json 中的 homepage 字段为你的 GitHub Pages 地址');
  log('2. 运行：npm install --save-dev gh-pages');
  log('3. 在 package.json 的 scripts 中添加：');
  log('   "deploy": "npm run build && gh-pages -d dist"');
  log('4. 运行：npm run deploy');
  log('5. 在 GitHub 仓库设置中启用 GitHub Pages');
}

function deployToVercel() {
  log('\n🚀 部署到 Vercel...', 'cyan');
  
  log('\n📋 部署步骤：', 'magenta');
  log('方法 1 - 使用 Vercel CLI：');
  log('  1. 安装：npm i -g vercel');
  log('  2. 运行：vercel --prod');
  log('  3. 按提示登录并部署');
  
  log('\n方法 2 - 拖拽部署：');
  log('  1. 访问 https://vercel.com');
  log('  2. 注册/登录账号');
  log('  3. 拖拽 dist 文件夹到网页');
  log('  4. 自动部署完成');
}

function deployToNetlify() {
  log('\n🚀 部署到 Netlify...', 'cyan');
  
  log('\n📋 部署步骤：', 'magenta');
  log('方法 1 - 使用 Netlify CLI：');
  log('  1. 安装：npm i -g netlify-cli');
  log('  2. 运行：netlify deploy --prod --dir=dist');
  log('  3. 按提示登录并部署');
  
  log('\n方法 2 - 拖拽部署：');
  log('  1. 访问 https://netlify.com');
  log('  2. 注册/登录账号');
  log('  3. 点击 "Add new site" → "Deploy manually"');
  log('  4. 拖拽 dist 文件夹到网页');
  log('  5. 自动部署完成');
}

function startLocalServer() {
  log('\n🚀 启动本地服务器...', 'cyan');
  
  const distPath = path.join(__dirname, 'dist');
  
  // 检查 Python
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    log('\n📋 使用 Python 启动：', 'magenta');
    log(`python3 -m http.server 8080`);
    log('访问：http://localhost:8080');
    return;
  } catch (e) {}
  
  // 检查 Node.js
  try {
    execSync('npx http-server --version', { stdio: 'pipe' });
    log('\n📋 使用 Node.js 启动：', 'magenta');
    log(`npx http-server dist -p 8080`);
    log('访问：http://localhost:8080');
    return;
  } catch (e) {}
  
  log('\n❌ 未找到合适的工具', 'red');
  log('推荐安装：npm install -g http-server', 'yellow');
}

function showMenu() {
  log('\n' + '='.repeat(50), 'blue');
  log('  Daily Todo List - PWA 部署工具', 'bright');
  log('='.repeat(50), 'blue');
  
  log('\n请选择部署方式：\n', 'cyan');
  log('1. GitHub Pages (免费，推荐)', 'green');
  log('2. Vercel (免费，快速)', 'green');
  log('3. Netlify (免费，稳定)', 'green');
  log('4. 本地服务器 (离线使用)', 'yellow');
  log('5. 退出\n', 'red');
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('请输入选项 (1-5): ', (answer) => {
    switch (answer) {
      case '1':
        deployToGitHubPages();
        break;
      case '2':
        deployToVercel();
        break;
      case '3':
        deployToNetlify();
        break;
      case '4':
        startLocalServer();
        break;
      case '5':
        log('\n👋 再见！', 'green');
        break;
      default:
        log('\n❌ 无效选项', 'red');
    }
    rl.close();
  });
}

// 主程序
function main() {
  checkDistFolder();
  
  // 如果有命令行参数
  const arg = process.argv[2];
  
  switch (arg) {
    case 'github':
      deployToGitHubPages();
      break;
    case 'vercel':
      deployToVercel();
      break;
    case 'netlify':
      deployToNetlify();
      break;
    case 'local':
      startLocalServer();
      break;
    default:
      showMenu();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  deployToGitHubPages,
  deployToVercel,
  deployToNetlify,
  startLocalServer
};
