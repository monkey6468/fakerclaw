# Fakerclaw 自动签到

基于 GitHub Actions 的 Fakerclaw 平台自动签到工具。

## 功能特性

- ✅ **自动签到** - 定时自动执行签到任务，无需手动操作
- 🔔 **Telegram 通知** - 签到结果实时推送至 Telegram
- ⏰ **定时执行** - 每天多个时间点自动执行（00:00、06:00、12:00、18:00、22:00 UTC）
- 📊 **运行日志** - 所有执行记录可在 GitHub Actions 日志中查看
- 🔄 **仓库保活** - 定期提交空 commit 保持 GitHub 仓库活跃

## 配置指南

### 1. Fork 仓库

点击 GitHub 仓库右上角的 **Fork** 按钮，将仓库复制到你的账号下。

### 2. 配置 GitHub Secrets

在仓库页面依次点击 **Settings** → **Secrets and variables** → **Actions** → **New repository secret**，添加以下 secrets：

| Secret 名称 | 必填 | 说明 | 示例 |
|------------|------|------|------|
| `DOMAIN` | 否 | API 域名，默认使用 Fakerclaw 官方 | `https://api.fakerclaw.online` |
| `COOKIE` | 是 | 登录后的 session cookie | `session=MTc3NTc4NzMwNXx...` |
| `NEW_API_USER` | 否 | 用户 ID，默认 2382 | `2382` |
| `TG_TOKEN` | 否 | Telegram 机器人 Token | `123456:ABC-DEF...` |
| `TG_ID` | 否 | Telegram 用户 ID | `987654321` |

### 3. 启用 GitHub Actions

在仓库页面点击 **Actions** 标签，选择 **check-in-job** 工作流，点击 **Enable workflow** 启用。

### 4. 获取 COOKIE

1. 登录 [Fakerclaw](https://api.fakerclaw.online)
2. 打开浏览器开发者工具（F12）
3. 切换到 **Network** 标签
4. 进行一次签到操作
5. 在网络请求中找到 `checkin` 请求
6. 复制请求头中的 `cookie` 值

### 5. 获取 Telegram 配置（可选）

1. 在 Telegram 搜索 `@BotFather` 创建机器人
2. 获取机器人 Token
3. 搜索 `@userinfobot` 获取你的用户 ID

## 使用方法

### 手动触发

1. 进入仓库 **Actions** 页面
2. 选择 **check-in-job** 工作流
3. 点击 **Run workflow** → **Run workflow**
4. 选择分支并确认执行

### 查看运行日志

1. 进入仓库 **Actions** 页面
2. 点击对应的工作流运行记录
3. 查看详细的执行日志

## 定时任务

工作流默认执行时间（UTC）：

| 时间 | 北京时间 |
|------|----------|
| 00:00 | 08:00 |
| 06:00 | 14:00 |
| 12:00 | 20:00 |
| 18:00 | 次日 02:00 |
| 22:00 | 次日 06:00 |

如需调整执行时间，修改 [fetch.yml](fetch.yml) 中的 cron 表达式：

```yaml
on:
  schedule:
    - cron: '0 0,6,12,18,22 * * *'
```

## 项目结构

```
fakerclaw/
├── .gitignore          # Git 忽略规则
├── _worker.js          # 签到核心脚本
├── checkin.txt         # 原始签到请求参考
├── fetch.yml           # GitHub Actions 工作流配置
└── package.json        # Node.js 项目配置
```

## 注意事项

- ⚠️ 请确保 `COOKIE` 值有效，过期后需要重新获取并更新
- 🔒 敏感信息请勿明文填写，均通过 GitHub Secrets 管理
- 📝 Telegram 通知为可选功能，不配置则仅记录日志
- 🕐 工作流按 UTC 时间执行，请根据所在时区合理安排

## 常见问题

**Q: 签到失败了怎么办？**

A: 首先查看 Actions 页面的运行日志，常见原因包括：
- Cookie 已过期
- 网络请求失败
- API 地址变更

**Q: 如何确认签到成功？**

A: 如果配置了 Telegram，会收到签到成功的消息通知。也可在 Actions 日志中查看返回结果。

**Q: 可以修改执行频率吗？**

A: 可以，修改 `fetch.yml` 中的 cron 表达式。cron 表达式格式为：`分 时 日 月 周`

## 免责声明

本项目仅供学习交流使用，请勿用于任何商业或违法用途。使用本工具产生的任何问题由使用者自行承担。