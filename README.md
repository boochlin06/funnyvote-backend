# FunnyVote Firebase Backend

FunnyVote 雲端後端基礎設施與設定倉庫，基於 Google Firebase (Firestore, Authentication, Cloud Storage)。

## 目標專案
- **Firebase Project ID**: `funny-vote-2e6be`

## 目錄結構
- `firestore.rules`: 安全規則（一人一票純寫入防重複投票、路徑即密碼零信任機制）
- `firestore.indexes.json`: 複合索引（依熱門度、建立時間與 N-gram 陣列排序查詢）
- `storage.rules`: 儲存體安全規則（圖片格式與大小限制）
- `firebase.json`: Firebase 服務與 Local Emulator 配置
- `scripts/seed.js`: 資料庫種子初始化腳本

## 常用指令

### 1. 啟動本機模擬器 (Local Emulator)
```bash
npm run emulators
```
模擬器 UI 位於 `http://localhost:4000`：
- Auth Emulator: `localhost:9099`
- Firestore Emulator: `localhost:8080`
- Storage Emulator: `localhost:9199`

### 2. 部署到 Firebase (目標專案: funny-vote-2e6be)
```bash
# 部署全部規則與索引
npm run deploy

# 僅部署安全規則
npm run deploy:rules

# 僅部署複合索引
npm run deploy:indexes
```

### 3. 寫入種子資料
```bash
# 對本地模擬器寫入種子
FIRESTORE_EMULATOR_HOST="127.0.0.1:8080" npm run seed

# 對雲端真實環境寫入種子 (需設定 Google Application Credentials)
npm run seed
```
