### Go to project folder
```
cd D:\Mone\Projects\svsdevastanam\sourcecode\srivenkatasai-website_v3
```
-----------------------------------------------------------------------------------------------
### Install frontend dependencies
```
cd frontend && npm install
```
-----------------------------------------------------------------------------------------------
### Install backend dependencies
```
cd ../backend && npm install
```
-----------------------------------------------------------------------------------------------
### Start Docker Services - Start PostgreSQL and MinIO before running migrations or the backend.

#### MinIO auto-creates the `svs-devastanam-media` bucket as public on first start.

```
cd D:\Mone\Projects\svsdevastanam\sourcecode\srivenkatasai-website_v3\docker
docker compose -f docker-compose.dev.yml stop postgres minio minio-init
docker compose -f docker-compose.dev.yml up postgres minio minio-init -d
docker compose -f docker-compose.dev.yml stop backend frontend
```
-----------------------------------------------------------------------------------------------
### Start Database
```
cd D:\Mone\Projects\svsdevastanam\sourcecode\srivenkatasai-website_v3\backend
```

### Generate Prisma client to generate local database
```
npx prisma generate
```

### (Optional) - Run migrations to add initial test data
```
npx prisma migrate dev --name init
```

### (Optional) Seed initial data
```
npx ts-node src/prisma/seed.ts
```

### (Optional) Open Prisma Studio
```
npx prisma studio
```
-----------------------------------------------------------------------------------------------
### Run the Application

#### Terminal 1: Backend API (port 4000)
```
cd D:\Mone\Projects\svsdevastanam\sourcecode\srivenkatasai-website_v3\backend && npm run start:dev
```

#### Terminal 2: Frontend (port 3000)
```
cd D:\Mone\Projects\svsdevastanam\sourcecode\srivenkatasai-website_v3\frontend && npm run dev
```
-----------------------------------------------------------------------------------------------
### Public website								- http://localhost:3000

### Admin login									- http://localhost:3000/auth/login

### Swagger API docs 							- http://localhost:4000/api/docs

### MinIO Console (`minioadmin` / `minioadmin`)	- http://localhost:9001
-----------------------------------------------------------------------------------------------
### If not using postgres then use mongod as below

```
mongod --dbpath D:\\Mone\\installations\\mongodb-win32-x86_64-windows-8.2.5\\data\\db --port 27017 --logpath D:\\Mone\\installations\\mongodb-win32-x86_64-windows-8.2.5\\logs\\mongod.log
```