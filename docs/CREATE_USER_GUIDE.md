# 创建用户账号指南

## 用户信息
- **邮箱**: tongkai@qusvip.cn
- **密码**: 12345678
- **姓名**: Tong Kai

## 方法一：通过 Supabase Dashboard（推荐）

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目（cozy-casa-planner）
3. 在左侧菜单中点击 **Authentication**
4. 点击 **Users** 标签
5. 点击右上角的 **Add user** 按钮
6. 填写以下信息：
   - Email: `tongkai@qusvip.cn`
   - Password: `12345678`
   - Auto Confirm Email: ✅ 勾选
7. 点击 **Create user**

## 方法二：使用 Shell 脚本

1. 获取 Service Role Key：
   - 登录 [Supabase Dashboard](https://supabase.com/dashboard)
   - 进入 Settings > API
   - 复制 `service_role` key（注意：不是 `anon` key）

2. 运行创建脚本：
   ```bash
   cd scripts
   ./create-user.sh
   ```

3. 当提示时，粘贴你的 Service Role Key

## 方法三：使用 TypeScript 脚本

1. 创建 `.env.local` 文件：
   ```env
   VITE_SUPABASE_URL=https://fidhrsooqigtxiidlqeu.supabase.co
   SUPABASE_SERVICE_KEY=你的_service_role_key
   ```

2. 安装依赖并运行脚本：
   ```bash
   npm install
   npx tsx scripts/createUser.ts
   ```

## 方法四：直接使用 API

使用 curl 或任何 HTTP 客户端：

```bash
curl -X POST \
  'https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/admin/users' \
  -H 'apikey: YOUR_SERVICE_KEY' \
  -H 'Authorization: Bearer YOUR_SERVICE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "tongkai@qusvip.cn",
    "password": "12345678",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Tong Kai",
      "username": "tongkai"
    }
  }'
```

## 验证登录

创建用户后，可以在应用的登录页面使用以下凭证进行登录：
- 邮箱：`tongkai@qusvip.cn`
- 密码：`12345678`

## 注意事项

- Service Role Key 拥有管理员权限，请勿泄露或提交到版本控制
- 建议在生产环境中要求用户更改初始密码
- 如需设置用户角色（如管理员），请在创建用户后通过 SQL 编辑器设置