# 1. 使用 Node.js 18 (适合你的 React 版本)
FROM node:18-alpine

# 2. 设置工作目录
WORKDIR /app

# 3. 复制依赖清单并安装
COPY package*.json ./
RUN npm install

# 4. 复制所有代码
COPY . .

# 5. 🟢 关键步骤：构建 (Build)
# 这步会执行 'vite build'，把你的代码打包进 'dist' 文件夹
# 注意：如果你的代码里有明显的 TypeScript 错误，这里可能会报错停止
RUN npm run build

# 6. 🟢 关键步骤：安装静态文件服务器
# 因为 Vite 打包后只是文件，我们需要这个工具来'播放'它
RUN npm install -g serve

# 7. 暴露端口
ENV PORT=8080

# 8. 启动服务
# 命令解释：用 serve 工具，把 dist 文件夹发布出去，监听 8080 端口
CMD ["serve", "-s", "dist", "-l", "8080"]
