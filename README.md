# AGI Printer

一个基于 Next.js 的个人资料卡片生成器，可以创建美观的可打印个人档案卡片。

## 功能特性

- **个性化设计** - 复古像素风格的个人资料卡片设计
- **头像支持** - 支持自定义头像和默认头像
- **便签功能** - 可拖拽的便签，支持自定义文本和位置
- **标签系统** - 支持添加多个技能/角色标签
- **打印优化** - A4 纸张尺寸优化，适合打印
- **响应式设计** - 适配不同屏幕尺寸
- **骨架屏** - 优雅的加载状态展示
- **API 集成** - 支持从外部 API 获取用户资料数据

## 技术栈

- **框架**: Next.js 15.3.3 (React 19)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: React Hooks + SWR
- **字体**: 自定义像素字体（Fusion Pixel、FindersKeepers、ChiKareGo）
- **图像处理**: Canvas API
- **工具**: ESLint, Bun

## 安装与运行

### 环境要求

- Node.js 18+ 或 Bun
- npm/yarn/pnpm/bun

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/your-username/AGIPrinter.git
cd AGIPrinter
```

2. **安装依赖**

```bash
# 使用 bun (推荐)
bun install

# 或使用 npm
npm install
```

3. **启动开发服务器**

```bash
# 使用 bun
bun dev

# 或使用 npm
npm run dev
```

4. **访问应用**
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

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

### ProfileCard

核心的个人资料卡片组件，包含：

- 用户头像和基本信息
- 技能/角色标签
- 个人描述
- 装饰性 UI 元素

### DraggableNote

可拖拽的便签组件，支持：

- 自由拖拽定位
- 实时文本编辑
- 删除功能

### ControlPanel

控制面板组件，提供：

- 用户资料输入
- 便签管理
- 打印功能

## API 接口

### `/api/canvas`

- **方法**: GET
- **功能**: 生成字体样式和 SVG 内容
- **返回**: SVG 格式的图形内容

### `/api/agi`

- **方法**: GET
- **功能**: 将 HTML 内容转换为 PNG 图片
- **返回**: PNG 格式的图片数据

## 自定义字体

项目使用了三种自定义字体：

- **Fusion Pixel**: 主要的像素字体，用于标题和正文
- **FindersKeepers**: 用于标签文本
- **ChiKareGo**: 用于特殊文本元素

字体文件位于 `public/` 目录，通过 CSS 引入。

## 使用说明

1. **输入用户信息**: 在控制面板中输入姓名、角色、地区等基本信息
2. **添加标签**: 设置技能或角色标签
3. **添加便签**: 点击添加便签按钮，可在卡片上添加可拖拽的便签
4. **编辑便签**: 双击便签文本进行编辑，拖拽调整位置
5. **打印**: 使用浏览器的打印功能或控制面板的打印按钮

## 开发指南

### 添加新组件

1. 在 `src/app/components/` 目录下创建新组件
2. 使用 TypeScript 编写，确保类型安全
3. 遵循现有的命名规范和代码风格

### 修改样式

- 使用 Tailwind CSS 类名
- 自定义样式请添加到 `globals.css`
- 保持响应式设计原则

### API 开发

- API 路由放在 `src/app/api/` 目录
- 使用 TypeScript 编写
- 添加适当的错误处理

## 测试

```bash
# 运行 ESLint 检查
bun run lint

# 构建项目
bun run build

# 启动生产环境
bun run start
```

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**享受创建你的个性化资料卡片吧！**
