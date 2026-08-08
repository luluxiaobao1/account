# 360智汇云 - 账号管理后台密钥管理

Next.js 14 实现的账号管理后台密钥管理界面原型。

## 功能特性

- 密钥列表展示，支持多接口路径折行显示
- 密钥状态管理（启用/停用）
- IP 白名单管理
- 响应式设计，支持移动端

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 http://localhost:3000 查看效果。

## 在线预览

### 部署到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Import Project"
3. 导入 GitHub 仓库：`https://github.com/luluxiaobao1/account`
4. Vercel 会自动检测 Next.js 项目并完成部署
5. 部署完成后获得可访问的在线链接

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/luluxiaobao1/account)

## 项目结构

```
├── app/                    # Next.js App Router 目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页（跳转到密钥管理）
├── accountadmin/          # 密钥管理页面
│   └── page.tsx           # 密钥列表主页面
├── lib/                   # 工具函数和数据
│   ├── packages-api.ts    # 套餐 API
│   └── packages-data.ts   # 套餐数据
└── public/                # 静态资源
```

## 主要更新

- 修复密钥列表中"对接接口"列与"状态"列重叠问题
- 对接接口列支持多行展示，长路径自动换行
- 优化表格响应式布局

## License

MIT
