# AGI Printer

一个基于 Next.js 的个人资料卡片生成器，支持可拖拽便签和打印优化。

## 技术栈

| 类别     | 技术                      |
| -------- | ------------------------- |
| 框架     | Next.js 15.3.3 (React 19) |
| 语言     | TypeScript                |
| 样式     | Tailwind CSS 4            |
| 状态管理 | React Hooks + SWR         |
| 工具     | ESLint, Bun               |

## 快速开始

| 步骤        | 命令                                                        |
| ----------- | ----------------------------------------------------------- |
| 1. 克隆项目 | `git clone https://github.com/your-username/AGIPrinter.git` |
| 2. 安装依赖 | `bun install` 或 `npm install`                              |
| 3. 启动开发 | `bun dev` 或 `npm run dev`                                  |
| 4. 访问应用 | [http://localhost:3000](http://localhost:3000)              |

**环境要求**: Node.js 18+ 或 Bun

## 项目结构

```
src/
├── app/
│   ├── api/                   # API 路由
│   │   ├── agi/               # AGI 相关 API（已废弃）
│   │   └── canvas/            # Canvas 绘图 API（已废弃）
│   ├── components/            # React 组件
│   │   ├── ControlPanel.tsx   # 控制面板
│   │   ├── DraggableNote.tsx  # 可拖拽便签
│   │   ├── ProfileCard.tsx    # 主要的资料卡片组件
│   │   └── ...
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useNotes.ts       # 便签管理
│   │   ├── usePrint.ts       # 打印功能
│   │   └── usePageState.ts   # 页面状态管理
│   ├── type/                  # TypeScript 类型定义
│   │   └── profile.ts        # 用户资料类型
│   └── utils/                # 工具函数
public/
├── fonts/                     # 自定义字体文件
├── *.svg                     # SVG 图标和装饰元素
└── ...
```

## 主要组件

| 组件            | 功能                               |
| --------------- | ---------------------------------- |
| `ProfileCard`   | 核心资料卡片，包含头像、信息、标签 |
| `DraggableNote` | 可拖拽便签，支持编辑和删除         |
| `ControlPanel`  | 控制面板，管理资料和便签           |

## API 接口（已废弃）

| 端点          | 方法 | 功能              |
| ------------- | ---- | ----------------- |
| `/api/canvas` | GET  | 生成 SVG 字体样式 |
| `/api/agi`    | GET  | HTML 转 PNG 图片  |

---

**享受创建你的个性化资料卡片吧！**
