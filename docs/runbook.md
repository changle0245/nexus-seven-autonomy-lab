# 运行与发布手册

## 本地启动

```bash
npm ci
npm run dev
```

检查：

```bash
curl -i http://localhost:3000/api/health
npm run check
```

健康响应应为 HTTP 200、`status: operational`，并包含 `X-Nexus-Synthetic: true`。

## 正式模式验证

```bash
npm run build
npm run start
```

正式模式用于验证安全响应头、元数据、Service Worker 和离线缓存。开发模式故意不注册 Service Worker，避免旧缓存干扰热更新。

## 发布前清单

1. `npm ci` 无锁文件漂移。
2. `npm run check:full` 全绿。
3. `npm audit --audit-level=high` 无高危漏洞。
4. 确认 `.env`、令牌和真实数据未进入 git。
5. 预览部署验证 `/`、`/api/health`、创建事件、AI 分析、移动导航和导出。
6. 提升到生产后重新检查 HTTP 状态、安全头、控制台和核心旅程。

对任意已部署 URL 重跑同一套浏览器旅程：

```bash
PLAYWRIGHT_BASE_URL=https://your-deployment.example npm run test:e2e
```

## Vercel 部署

项目不需要手工设置框架或构建命令；Vercel 会识别 Next.js。`VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` 会自动生成 canonical、sitemap 与 Open Graph 基础 URL。

若未来增加秘密：

- 只在 Vercel 环境变量中设置；
- 分离 Preview 与 Production；
- 轮换后触发重新部署；
- 永远不要把值复制进 issue、构建日志或仓库。

## 回滚

当前应用没有数据库迁移和外部写入，回滚只需把 Vercel Production Alias 指向前一个已验证 deployment。回滚后检查：

- `/api/health` 200；
- 首页标题与静态资源加载；
- 浏览器 Console 无异常；
- Service Worker 新版本是否激活。

如果未来加入状态迁移，必须把代码回滚和数据迁移回滚拆开，并在发布前定义前向修复策略。

## 故障排查

### 页面可开但 API 失败

检查 `/api/health`、Vercel Function 日志和 CSP `connect-src`。当前所有调用都必须同源。

### 离线页面版本过旧

确认 `/sw.js` 返回 `Cache-Control: public, max-age=0, must-revalidate`，然后在浏览器 Application 面板检查 active worker 和 `nexus-seven-shell-v1`。

### 状态无法导入

只接受 JSON 与 `schemaVersion: 1`。未知 schema 会有意失败；不要绕过版本检查。

### 移动侧栏遮挡内容

在 900px 以下检查 `.sidebar-is-collapsed`、遮罩按钮和菜单选择后的 reducer 状态。自动化旅程覆盖 390×844。

## 合成数据恢复

系统设置 → Reset lab data 会删除当前浏览器的实验变化并恢复内置 fixtures。该动作不会删除 GitHub、Vercel 或任何云端资源。
