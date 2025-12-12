# 1. 使用 Node.js 环境 (相当于请了个懂 TypeScript 的厨师)
FROM node:18-alpine

# 2. 设置工作目录
WORKDIR /app

# 3. 复制你的“食材清单” (package.json)
COPY package*.json ./

# 4. 安装依赖 (按照清单买菜)
# 如果你用的是 yarn，这里会自动识别，但在 Docker 里推荐统一用 npm install
RUN npm install

# 5. 复制所有代码到容器里
COPY . .

# 6. 打包构建 (切菜、备菜)
# 这里会执行你 package.json 里的 "build" 命令
RUN npm run build

# 7. 暴露端口
ENV PORT=8080

# 8. 启动服务 (开始营业)
# ⚠️ 注意：这里假设你的启动命令是 "npm start"
# 如果部署失败，很可能是因为你的启动命令不一样（详见下文）
CMD ["npm", "start"]
