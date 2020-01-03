FROM node:12
RUN curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
RUN python get-pip.py
RUN pip install awscli
WORKDIR /app
RUN npm install -g express-generator
CMD ["npx", "nodemon", "app"]
