# 🐾 宠遇 (PetApp) - 宠物领养与关怀社区

[![React Native](https://img.shields.io/badge/Framework-React%20Native-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Platform-Expo-white?logo=expo&logoColor=black)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

**宠遇 (PetApp)** 是一款致力于为流浪小动物寻找温暖家庭的移动端应用。该项目采用工业级开发标准，融合了实时通信、地理位置服务与弹性认证机制，为用户提供流畅、温馨的领养体验。

---

## ✨ 核心特性

- **🚀 实时沟通系统 (Real-time Messaging)**：集成 Supabase Realtime，支持领养人与原主之间即时同步的聊天气泡对话，确保沟通零延迟。
- **🛡 弹性认证与访客模式 (Guest Mode)**：独特的“超级访客”方案。在未登录或后台服务受限时，用户仍可通过 AsyncStorage 实现本地收藏与基本浏览，确保应用始终可用。
- **🔍 智能过滤与推荐**：支持按城市、年龄、品种多维度筛选宠物。首页集成“精选画廊”与“发现新伙伴”横向滚动模块，极具视觉冲击力。
- **📍 地理位置感知**：通过 Expo Location 实现自动定位，并优先推送同城待领养宠物。
- **📝 动态领养申请**：完整的表单提交流程，支持在个人中心实时追踪申请进度。

---

## 🛠 技术栈

- **前端框架**: React Native (Expo SDK)
- **状态管理**: React Context API & Hooks
- **持久化存储**: AsyncStorage (用于本地收藏与访客数据)
- **后端服务**: Supabase (Database, Auth, Realtime)
- **UI 组件**: 矢量图标 (Ionicons), 响应式布局 (Auto-scaling Layout)
- **导航系统**: React Navigation (Stack & Bottom Tabs)

---

## 📂 项目结构

```text
├── components/         # 可复用的 UI 组件 (PetCard, ChatInput等)
├── context/            # AppContext.js 全局状态管理中心
├── navigation/         # Tab 与 Stack 路由配置中心
├── screens/            # 页面组件
│   ├── HomeScreen.js       # 发现与分类索引
│   ├── PetDetailScreen.js  # 细节展示与收藏逻辑
│   ├── ChatDetailScreen.js # 实时对话页面
│   └── ProfileScreen.js    # 个人数据与申请进度
├── supabase.js         # Supabase 客户端环境配置
└── App.js              # 应用入口
```

---

## 🚀 快速启动

1. **克隆项目**:
   ```bash
   git clone https://github.com/susie070505-hash/pet-adoption-app.git
   cd pet-adoption-app
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **配置 Supabase**:
   修改 `supabase.js` 中的 `supabaseUrl` 和 `supabaseAnonKey`。

4. **开始运行**:
   ```bash
   npx expo start
   ```

---

## 💼 作品集亮点 (Portfolio Highlights)

- **Optimistic UI Updates**: 收藏功能采用乐观看更新策略，确保交互瞬时响应。
- **Realtime Sync**: 深度处理了多端同步与 WebSocket 订阅生命周期管理。
- **Error Resilience**: 实现了完善的错误边界处理与 API 频率限制降级方案。

---

### 🐾 让每一份爱心都有迹可循。

GitHub: [susie070505-hash](https://github.com/susie070505-hash)
