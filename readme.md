## 整理高德的行政区域数据

### 使用前提
注册高德开发者账号，新建web服务的key。复制`config.example.js`文件，将key填入，把文件重命名为`config.js`

### 使用方法
```bash
# 1.安装依赖
yarn install

# 2.整理数据
# 带街道数据
yarn start --street=true
# 不带街道数据
yarn start --street=false

# 3.数据将写入到dist文件夹中,文件按时间命名
```