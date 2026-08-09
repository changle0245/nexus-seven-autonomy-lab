# 验证矩阵

最后一次本地完整验证基于 Node.js 22、Next.js 16.3.0、Chromium 151。

## 自动质量门

| 门 | 覆盖 | 当前结果 |
| --- | --- | --- |
| ESLint | 全仓库，0 warnings | 通过 |
| TypeScript | 应用、配置、测试 | 通过 |
| Vitest | 3 个文件、16 项领域/API 测试 | 16/16 通过 |
| Next.js build | TypeScript、静态生成、Route Handlers | 7 个静态页面与 4 个动态 API 成功 |
| Playwright | 6 条生产模式全故事旅程 | 6/6 通过 |
| npm audit | 389 个包 | 0 vulnerabilities |

## Playwright 用户旅程

1. 安全响应头、健康 API、畸形 JSON 和超大请求拒绝。
2. 创建、接管、解决事件并在刷新后验证持久化。
3. NEXUS AI 关联部署风险、跨视图导航并执行可逆回滚模拟。
4. 中英文、明暗主题、密度持久化；错误 schema 拒绝；审计 CSV 下载。
5. 390×844 移动导航、遮罩、选中后自动关闭与可访问名称。
6. Service Worker 获得控制后离线重新启动生产 shell。

## 人工探索式浏览器验证

| 区域 | 验证内容 | 结果 |
| --- | --- | --- |
| 指挥中心 | 指标、图表、拓扑、事件和两种主题视觉层级 | 通过 |
| 命令面板 | `⌘/Ctrl + K`、筛选、Enter 导航 | 通过 |
| 事件 API | UI → POST → 201 → reducer → LocalStorage → reload | 通过 |
| 工作流 | 运行次数与最新时间更新 | 通过 |
| 部署 | 选择 warning 版本、确认弹窗、回滚状态 | 通过 |
| 成本情景 | 滑杆边界、重算、保存提示 | 通过 |
| 数据可移植性 | CSV 实际落盘、非法 JSON/schema 错误 | 通过 |
| 网络 | 在线/离线状态、服务器停止后的缓存重载 | 通过 |
| 响应式 | 1440px、390px、移动菜单与长页面 | 通过 |
| 浏览器错误 | Console、page errors、Next error overlay | 0 应用错误 |
| 性能抽样 | Dev TTFB 52.4ms、FCP 104ms、LCP 248ms、CLS 0 | 通过；本地样本非 SLA |

## 负向 API 结果

| 请求 | 预期/实测 |
| --- | --- |
| 非法 JSON | 400 `INVALID_JSON` |
| 字段/枚举非法 | 422 `VALIDATION_ERROR` |
| 请求体 > 4 KB | 413 `PAYLOAD_TOO_LARGE` |
| 空 AI prompt | 422 `VALIDATION_ERROR` |
| 未实现的 DELETE | 405 |

## 测试期间发现并修复

1. TypeScript 7 与当前 ESLint 生态不兼容：锁定到 TypeScript 6.0.3，恢复零警告质量门。
2. Open Graph 生成缺少 `metadataBase`：建立动态站点 URL 解析，正式构建不再报警。
3. Blob URL 同步释放导致部分无头浏览器无法接管下载：改为挂载临时锚点并延迟释放。
4. 移动侧栏选择页面后不关闭：增加自动关闭逻辑与可点击遮罩。
5. 收起侧栏仍暴露在可访问性树，窄屏 AI 按钮无名称：增加 visibility/pointer 边界与 ARIA 标签。
6. 首轮 E2E 的两个失败来自测试编码/宽泛匹配：修正原始字节请求和精确定位后 6/6 通过。

## 尚未声称通过的生产门

- 真实身份/RBAC 渗透测试；
- 真实数据库迁移、恢复演练和并发冲突；
- 真实支付、邮件、第三方 webhook 与供应商沙盒；
- 高并发负载、跨区域容灾和长期 soak test；
- 外部专业安全审计与合规认证。
