# 云顶艺墅装修管理系统

## Project info

**URL**: https://lovable.dev/projects/9b2e3aba-a0df-4dff-bd2a-fa187f756bfe

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9b2e3aba-a0df-4dff-bd2a-fa187f756bfe) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 技术栈

本项目基于：

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 最近变更摘要（将随PR提交）

- 新增：项目列表卡片展示“付款节点摘要”和进度条，免进入详情
- 新增：在“编辑项目”弹窗中集成“付款节点”页签，可直接增删改付款节点
- 新增：`payment_nodes` 实时订阅，前端新增/修改后自动刷新列表摘要
- 修复：`Dashboard.tsx` 残留 JSX 语法错误
- 清理：删除临时调试脚本 `src/utils/testSupabase.ts`

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
