# VibeArcade - 游戏大厅

Made with ♥ by Lulu & Syuhoo

一个包含多款小游戏的合集站点。当前提供：

- **点连三角形**：在平面上连接点形成三角形的多人策略游戏（2~4 人）。
- **弹弹乐 Bumper Arena**：拖拽弹射对战，竞技场不断缩小，先把对手撞出界者得分。

## 游戏规则

- 2~4 名玩家轮流操作
- 每回合选择两个点画一条连线
- 连线不能与已有线条交叉
- 画线后形成新三角形可继续操作
- 完成三角形最后一笔的玩家获得归属权
- 拥有最多三角形的玩家获胜

## 功能特性

- 支持 2/3/4 人对战
- 可调节点数 (3-30)
- 提示功能（每玩家 2 次）
- 连线顺序查看（复盘）
- 深色/浅色主题切换
- 移动端触控适配
- 服务端打点统计 (DAU/MAU/PV)

## 项目结构

本项目是一个「游戏大厅 + 子游戏」结构。访问根域名即进入游戏大厅，可选择游玩不同游戏。

```
├── index.html                       # 游戏大厅（选择页）
├── games/
│   ├── triangle/
│   │   └── index.html               # 点连三角形（原游戏，含返回大厅按钮）
│   └── bumper-arena/
│       └── index.html               # 弹弹乐 Bumper Arena（含「大厅」返回按钮）
├── edge-functions/
│   └── api/
│       ├── track.js                 # 打点上报 API (POST)
│       └── stats.js                 # 统计查询 API (GET)
├── README.md
└── SPEC.md
```

> 打点统计（DAU/MAU/PV）目前仅服务「点连三角形」游戏。弹弹乐 Bumper Arena 为纯前端自包含游戏，暂未接入打点。

## 部署到 EdgeOne Pages

### 前提条件

- 拥有腾讯云账号
- 项目推送到 GitHub 仓库

### 部署步骤

1. **创建项目**：访问 [EdgeOne Pages](https://pages.edgeone.ai)，使用 GitHub 仓库创建项目
2. **申请 KV**：进入项目控制台 → KV Storage → Apply now → 填写使用场景（如"游戏数据统计"）
3. **创建命名空间**：KV Storage → 创建命名空间，名称填 `analytics`
4. **绑定 KV**：项目设置 → KV Storage → Bind Namespace → 选择 `analytics`，变量名填 `ANALYTICS_KV`
5. **部署完成**：访问分配的域名即可

### 免费额度

| 项目 | 免费额度 |
|------|---------|
| Edge Functions 请求 | 300万次/月 |
| KV 存储 | 1GB |
| 流量 | 不限 |
| 构建次数 | 500次/月 |

### 查看统计

部署后访问 `https://你的域名/api/stats` 即可看到 JSON 格式的统计数据：

```json
{
  "date": "2026-05-17",
  "month": "2026-05",
  "dau": 42,
  "mau": 128,
  "pv": 356,
  "events": {
    "visit": 356,
    "game_start": 89,
    "game_end": 76,
    "triangle_formed": 234
  },
  "trend": [
    { "date": "2026-05-11", "dau": 30, "pv": 200 },
    ...
  ]
}
```

## 本地开发

直接用浏览器打开 `index.html` 即可运行游戏。

> 注意：打点功能（`/api/track`、`/api/stats`）需要部署到 EdgeOne Pages 后才可用，本地运行时会静默跳过。

## 技术栈

- **前端**：原生 HTML5 Canvas + CSS + JavaScript
- **服务端**：EdgeOne Pages Edge Functions (Serverless)
- **存储**：EdgeOne KV（分布式键值存储）
