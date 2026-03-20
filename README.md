# Pet Adoption App 🐾

一个基于 **Expo (React Native)** 和 **Supabase** 构建的宠物领养小程序。

## 项目特点

- 🌟 **精美界面**：现代化的 UI 设计，流畅的用户体验。
- 🐶 **宠物展示**：从 Supabase 实时获取待领养宠物列表。
- 📑 **领养申请**：用户可以直接在 App 内提交领养意向。
- 📂 **分类浏览**：按类型浏览不同种类的宠物。

## 技术栈

- **前端**: React Native, Expo
- **导航**: React Navigation (Native Stack, Bottom Tabs)
- **后端**: Supabase (Database & Auth)
- **存储**: AsyncStorage
- **图标**: Expo Vector Icons

## 如何开始

### 1. 克隆项目
```bash
git clone https://github.com/susie070505-hash/pet-adoption-app.git
cd pet-adoption-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
项目根目录下需要一个 `.env` 文件，包含你的 Supabase 配置：
```env
EXPO_PUBLIC_SUPABASE_URL=你的_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

### 4. 启动项目
```bash
npm start
```
使用 Expo Go 扫描 QR 码即可在手机上预览。

---

## 项目结构
- `screens/`: 各个主界面（首页、详情页、表单页等）。
- `components/`: 可复用的 UI 组件。
- `supabase.js`: Supabase 客户端配置。
- `context/`: 全局状态管理。
- `navigation/`: 路由配置。
