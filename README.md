# NEXUS-7 Autonomous Operations Lab

一个公开可体验、无需登录、全合成数据的 Level 7 全栈网站实验。它把事件响应、自动化工作流、发布治理、成本与风险建模、审计、可解释 AI、离线恢复和多端交互放进同一个运营控制面。

> 这是高保真工程实验，不连接真实基础设施，不包含真实用户、凭据、账单或生产变更能力。所有“执行”“回滚”和“AI 决策”都被限定为可逆的合成模拟。

在线体验：[nexus-seven-autonomy-lab.vercel.app](https://nexus-seven-autonomy-lab.vercel.app)

## 为什么称为 Level 7

NEXUS-7 不只是页面集合，而是一条可以重复运行的交付故事：

- 浏览器操作通过经过验证的 API 创建事件，再进入版本化客户端状态。
- 人工接管、恢复、工作流执行和回滚模拟会形成统一审计证据。
- 确定性领域助手会关联事件、部署、成本和工作流，并只给出允许范围内的导航或建议。
- 主题、语言、信息密度、功能开关和业务状态可本地持久化、导入、导出和恢复。
- PWA Service Worker 能在应用服务器不可达时从缓存启动完整控制面。
- 桌面与移动导航、键盘命令、错误边界、元数据、站点地图和安全响应头均包含在交付中。
- 16 项单元/API 测试与 6 条生产模式 Playwright 用户旅程可以在 GitHub Actions 中自动重跑。

## 能力地图

| 领域 | 可体验能力 | 安全边界 |
| --- | --- | --- |
| 指挥中心 | SLO、拓扑、事件、自动化台账、响应团队 | 只读合成遥测 |
| 事件响应 | 搜索、筛选、创建、接管、解决、时间线、持久化 | 4 KB API 上限；输入校验；不呼叫真实人员 |
| 工作流 | 触发器、决策门、动作、审批、执行历史 | 低风险模拟；凭据访问始终阻断 |
| 部署治理 | 环境矩阵、构建质量、金丝雀、回滚模拟 | 不触发真实部署；保留可逆路径 |
| 成本与风险 | 预算、情景滑杆、风险雷达、优化建议 | 不产生账单或采购动作 |
| 审计与设置 | 查询、CSV/JSON 导出、导入校验、重置、功能开关 | 版本化白名单状态；本地可恢复 |
| NEXUS AI | 确定性意图识别、证据解释、跨视图导航 | 无外部模型、无工具执行、无生产权限 |

## 技术栈

- Next.js 16 App Router、React 19、TypeScript 6
- Route Handlers 提供统一 API envelope、请求 ID、错误模型和输入边界
- `useReducer` 领域状态机 + schema v1 本地持久化
- Vitest 单元/API 契约测试
- Playwright 生产模式端到端测试
- GitHub Actions 持续质量门 + Dependabot 依赖维护
- Vercel 零配置部署与动态站点 URL 元数据

## 本地运行

要求 Node.js 22+。

```bash
npm ci
npm run dev
```

打开 `http://localhost:3000`。项目不需要数据库、第三方密钥或 `.env` 才能运行。

## 质量门

```bash
# Lint + 类型 + 16 项 Vitest + 正式构建
npm run check

# 首次需要 Playwright Chromium；CI 会自动安装
npx playwright install chromium
npm run test:e2e

# 全部质量门
npm run check:full
```

主要脚本：

| 命令 | 作用 |
| --- | --- |
| `npm run lint` | ESLint，警告也视为失败 |
| `npm run typecheck` | TypeScript 无输出检查 |
| `npm test` | 领域状态、AI 路由和 API 契约 |
| `npm run build` | Next.js 正式构建与静态生成 |
| `npm run test:e2e` | 6 条 Chromium 全故事验证 |
| `npm run check:full` | 完整本地质量门 |

## API

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务与合成数据健康状态 |
| `GET` | `/api/metrics` | 24 小时合成遥测序列 |
| `GET` | `/api/incidents?status=open` | 查询合成事件 |
| `POST` | `/api/incidents` | 创建经过校验的合成事件 |
| `POST` | `/api/copilot` | 调用确定性领域分析器 |

所有 API 返回统一的 `ok/data/error/meta` envelope；`meta` 包含请求 ID、生成时间与 `synthetic: true`。

## 工程文档

- [系统架构](docs/architecture.md)
- [验证矩阵](docs/test-matrix.md)
- [运行与发布手册](docs/runbook.md)
- [完整交付报告](docs/delivery-report.md)
- [安全策略](SECURITY.md)

## 从实验扩展到生产

生产化不应直接删除现有安全边界，而应逐层替换适配器：将本地状态替换为带租户隔离的数据库；将演示身份替换为真实 OIDC；将确定性助手包装成经过策略网关的模型调用；将合成动作替换为带审批、幂等键、审计和回滚的执行器。详细演进路线见 [系统架构](docs/architecture.md)。

## 当前边界

- 无真实身份认证、RBAC、数据库、支付、邮件或第三方生产连接。
- 无分布式锁、持久队列、跨区域数据库或真实多租户隔离验证。
- API 具备输入边界与安全响应头，但面向互联网的真实写入端点仍需速率限制、身份和滥用检测。
- 本仓库证明的是“复杂系统的自主构建与可验证交付能力”，不是对真实生产运营的认证。
