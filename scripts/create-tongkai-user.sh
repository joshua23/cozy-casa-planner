#!/bin/bash

# 创建用户账号 tongkai@qusvip.cn

SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZGhyc29vcWlndHhpaWRscWV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY3Mzk2NSwiZXhwIjoyMDczMjQ5OTY1fQ.Wk02q3ASvINruGYKPohTJMQi6-0iN19awJafanfZmmQ"

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
  }'