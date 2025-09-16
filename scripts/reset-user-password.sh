#!/bin/bash

# 重置用户密码

SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGhyc29vcWlndHhpaWRscWV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY3Mzk2NSwiZXhwIjoyMDczMjQ5OTY1fQ.Wk02q3ASvINruGYKPohTJMQi6-0iN19awJafanfZmmQ"

echo "步骤1: 获取用户ID"
user_response=$(curl -s -X GET \
  "https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_KEY}")

user_id=$(echo "$user_response" | python3 -c "
import sys, json
users = json.load(sys.stdin).get('users', [])
for user in users:
    if user.get('email') == 'tongkai@qusvip.cn':
        print(user.get('id'))
        break
")

if [ -z "$user_id" ]; then
    echo "用户不存在，创建新用户..."
    curl -X POST \
      "https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/admin/users" \
      -H "apikey: ${SERVICE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "tongkai@qusvip.cn",
        "password": "12345678",
        "email_confirm": true,
        "user_metadata": {
          "full_name": "Tong Kai",
          "username": "tongkai"
        }
      }' | python3 -m json.tool
else
    echo "用户存在，ID: $user_id"
    echo "步骤2: 更新用户密码"

    update_response=$(curl -s -X PUT \
      "https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/admin/users/${user_id}" \
      -H "apikey: ${SERVICE_KEY}" \
      -H "Authorization: Bearer ${SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -d '{
        "password": "12345678",
        "email_confirm": true
      }')

    echo "密码更新响应："
    echo "$update_response" | python3 -m json.tool
fi

echo ""
echo "步骤3: 测试登录"
sleep 2

ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGhyc29vcWlndHhpaWRscWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NzM5NjUsImV4cCI6MjA3MzI0OTk2NX0.RXlQKfcvzfWS-OIzSFJoeSB-_3id-QVE3hsgosGct1A"

login_response=$(curl -s -X POST \
  "https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tongkai@qusvip.cn",
    "password": "12345678"
  }')

if echo "$login_response" | grep -q "access_token"; then
    echo "✅ 登录成功！"
    echo "用户可以使用以下凭证登录："
    echo "邮箱: tongkai@qusvip.cn"
    echo "密码: 12345678"
else
    echo "❌ 登录失败"
    echo "$login_response" | python3 -m json.tool
fi