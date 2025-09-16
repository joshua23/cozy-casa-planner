#!/bin/bash

# 用户创建脚本 - 通过 Supabase Admin API 创建用户
# 使用方法: ./create-user.sh

# Supabase 项目配置
SUPABASE_URL="https://fidhrsooqigtxiidlqeu.supabase.co"

# 需要从 Supabase Dashboard 获取 Service Role Key
# 1. 登录 https://supabase.com/dashboard
# 2. 选择你的项目
# 3. 进入 Settings > API
# 4. 复制 service_role key (不是 anon key)
echo "请输入你的 Supabase Service Role Key:"
read -s SERVICE_KEY

if [ -z "$SERVICE_KEY" ]; then
    echo "错误: Service Role Key 不能为空"
    exit 1
fi

# 用户信息
EMAIL="tongkai@qusvip.cn"
PASSWORD="12345678"
FULL_NAME="Tong Kai"
USERNAME="tongkai"

echo "正在创建用户: $EMAIL"

# 调用 Supabase Admin API 创建用户
response=$(curl -s -X POST \
  "${SUPABASE_URL}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\",
    \"email_confirm\": true,
    \"user_metadata\": {
      \"full_name\": \"${FULL_NAME}\",
      \"username\": \"${USERNAME}\"
    }
  }")

# 检查响应
if echo "$response" | grep -q '"id"'; then
    echo "✅ 用户创建成功！"
    echo "用户可以使用以下凭证登录："
    echo "邮箱: $EMAIL"
    echo "密码: $PASSWORD"
    echo ""
    echo "响应详情:"
    echo "$response" | python3 -m json.tool
else
    echo "❌ 用户创建失败"
    echo "错误信息:"
    echo "$response" | python3 -m json.tool
fi