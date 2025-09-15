# 使用 Node.js 最新版作为构建环境
FROM node:latest AS builder
 
# 设置工作目录
WORKDIR /app
 
# 复制依赖定义文件
COPY package*.json ./
 
# 安装依赖（推荐使用 npm ci）
RUN npm ci
 
# 复制项目文件
COPY . .
 
# 构建项目
RUN npm run build
 
# 使用 Nginx 作为生产环境服务器
FROM nginx:latest

# 复制自定义 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
# 复制构建产物到 Nginx 默认路径
COPY --from=builder /app/dist /usr/share/nginx/html
 
# 暴露端口
EXPOSE 80
 
# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]