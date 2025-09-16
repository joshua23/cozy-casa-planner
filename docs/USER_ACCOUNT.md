# 用户账号信息

## 测试账号

项目已配置以下测试账号，可直接用于登录：

| 邮箱 | 密码 | 角色 | 备注 |
|------|------|------|------|
| tongkai@qusvip.cn | 12345678 | 用户 | 默认测试账号 |

## 账号管理脚本

项目提供了以下脚本用于账号管理：

### 1. 重置密码
```bash
./scripts/reset-user-password.sh
```
此脚本可以：
- 检查用户是否存在
- 重置现有用户密码
- 创建新用户（如果不存在）
- 自动验证登录

### 2. 测试登录
```bash
./scripts/test-login.sh
```
用于测试用户登录凭证是否有效。

### 3. 创建新用户
```bash
./scripts/create-user.sh
```
交互式脚本，需要输入 Service Role Key。

## 注意事项

1. **安全性**：生产环境中应要求用户首次登录后更改密码
2. **Service Key**：脚本中的 Service Role Key 仅供开发使用，生产环境应使用环境变量
3. **密码策略**：建议在生产环境中实施更强的密码策略

## 故障排除

如果登录失败，请按以下步骤排查：

1. 运行 `./scripts/test-login.sh` 验证账号
2. 如需重置密码，运行 `./scripts/reset-user-password.sh`
3. 检查 Supabase Dashboard 中的用户状态
4. 确保用户邮箱已验证（email_confirmed）