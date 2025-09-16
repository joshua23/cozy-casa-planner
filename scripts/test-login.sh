#!/bin/bash

# 测试用户登录

ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGhyc29vcWlndHhpaWRscWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NzM5NjUsImV4cCI6MjA3MzI0OTk2NX0.RXlQKfcvzfWS-OIzSFJoeSB-_3id-QVE3hsgosGct1A"

echo "测试用户登录: tongkai@qusvip.cn"

response=$(curl -s -X POST \
  "https://fidhrsooqigtxiidlqeu.supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tongkai@qusvip.cn",
    "password": "12345678"
  }')

echo "响应结果："
echo "$response" | python3 -m json.tool