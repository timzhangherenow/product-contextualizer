# 1. 使用官方 Python 环境 (瘦身版，体积小)
FROM python:3.9-slim

# 2. 设置工作目录
WORKDIR /app

# 3. ⚠️ 关键点：安装处理图片必须的系统库 (OpenCV 依赖)
# 如果你没用到 cv2，这几行删掉也没事，但加上通常比较保险
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. 复制依赖清单并安装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. 复制所有代码
COPY . .

# 6. 设置环境变量 (让 Python 输出直接打印到日志，方便调试)
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# 7. 启动命令
# 如果你用的是 Streamlit：
# CMD ["streamlit", "run", "app.py", "--server.port=8080", "--server.address=0.0.0.0"]
# 如果你用的是 Flask/FastAPI (假设入口文件叫 main.py)：
CMD ["python", "main.py"]
