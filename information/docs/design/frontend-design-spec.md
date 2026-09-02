# 租房小程序/H5 前端设计与工程开发规范

本规范基于当前产品视觉原型（`image-ui/` 暖橙与奶油白质感）与切图资产库（`rental-ui-assets/`）制定，旨在统一 **视觉设计语言、Token 变量体系、组件规范、布局排版、交互动效与代码开发标准**。

---

## 1. 核心设计基准与视觉基调

### 1.1 设计画布与单位
- **设计基准宽度**：750 px（基于移动端标准 Retina 视网膜屏设计）。
- **Uni-app 尺寸单位**：页面样式中优先使用 `rpx` 进行自适应排版；小尺寸边框、细线条或固定小元素可使用 `px`（例如 `1px solid ...`）。
- **H5 最大视口约束**：在 H5 端容器最大宽度建议限制为 `600px` 并居中展示，保证大屏浏览的舒适度。

### 1.2 视觉调性 (Design Tone)
- **暖橙与暖木色调**：以温暖、可靠、明亮的橙黄为核心，营造温馨归属感。
- **奶油米白大背景**：告别纯冷灰（#F5F5F5），采用柔和的浅米白/暖沙色作为底色。
- **大圆角与通透卡片**：所有卡片容器统一采用 `16rpx ~ 32rpx` 大圆角，配以轻柔漫反射投影，营造层级与亲和力。

---

## 2. 设计系统 Tokens (Design Tokens)

### 2.1 色彩规范 (Color System)

| Token 名称 | 变量名 (`SCSS`) | 色值 | 适用场景说明 |
|---|---|---|---|
| **品牌主色 (Primary)** | `$color-primary` | `#F28A00` | 主按钮、高亮选中态、核心价格、核心强调 |
| **品牌主色浅态 (Light)** | `$color-primary-light` | `#FFF5E6` | 标签背景、选中态浅底、胶囊激活背景 |
| **辅助金橙 (Secondary)** | `$color-secondary` | `#E5A039` | 渐变辅色、次级强调色、活动角标 |
| **主标题/正文字 (Text Dark)**| `$color-text-main` | `#202020` | 一级大标题、房源名称、核心数字 |
| **次级说明字 (Text Regular)**| `$color-text-regular` | `#505050` | 房源描述、标签文字、二级说明 |
| **弱化/辅助字 (Text Muted)** | `$color-text-muted` | `#747474` | 地址、次要元数据、未激活 TabBar 文字 |
| **占位符文字 (Text Placeholder)**| `$color-text-placeholder` | `#A6A6A6` | 搜索框占位符、禁用提示 |
| **页面主背景 (Bg Base)** | `$color-bg-page` | `#F8F6F2` | 暖米白页面背景 |
| **卡片背景 (Bg Card)** | `$color-bg-card` | `#FFFFFF` | 房源卡片、浮层弹窗、白色底板 |
| **次级背景 (Bg Sub)** | `$color-bg-sub` | `#F2EFE9` | 搜索框底色、筛选栏未选中底色 |
| **分割线/描边 (Border)** | `$color-border` | `#EBE6DF` | 极细边框、卡片描边、列表分割线 |

### 2.2 字体与排版层级 (Typography)

| 层级 | 尺寸 (`rpx`) | 字重 (`font-weight`) | 行高 (`line-height`) | 典型应用场景 |
|---|---|---|---|---|
| **Display / Hero** | `48rpx` | 700 (Bold) | 1.2 | 首页顶部大标语、详情页大价格 |
| **Title 1 (一级标题)** | `36rpx` | 600 (Semi-bold) | 1.3 | 房源卡片主标题、弹窗主标题 |
| **Title 2 (二级标题)** | `30rpx` | 600 (Semi-bold) | 1.4 | 模块标题（如“精选房源”、“周边配套”） |
| **Body (正文)** | `28rpx` | 400 (Regular) | 1.5 | 列表房源户型/面积、正文介绍段落 |
| **Caption (次要/说明)** | `24rpx` | 400 (Regular) | 1.4 | 房源标签、地铁距离、TabBar 文本 |
| **Micro (极小标签)** | `20rpx` | 500 (Medium) | 1.2 | 促销角标、单位符号 (如“/月”) |

### 2.3 圆角系统 (Border Radius)

- **超大圆角 (`$radius-xl: 32rpx`)**：房源大卡片、底部浮动面板 (ActionSheet/Modal)
- **标准圆角 (`$radius-lg: 20rpx`)**：房源列表图、搜索输入框、主要按钮
- **次级圆角 (`$radius-md: 12rpx`)**：筛选胶囊、房源标签 (Tag)、小徽标
- **全圆角 (`$radius-full: 999rpx`)**：胶囊按钮、圆形操作图标 (悬浮客服/收藏)

### 2.4 阴影系统 (Shadows)

- **轻柔浮层 (`$shadow-sm`)**：`0 4rpx 12rpx rgba(0, 0, 0, 0.04)` —— 普通卡片默认
- **焦点/悬浮 (`$shadow-md`)**：`0 8rpx 24rpx rgba(242, 138, 0, 0.12)` —— 橙色主题按钮、激活卡片
- **底部 TabBar 投影 (`$shadow-tab`)**：`0 -4rpx 20rpx rgba(0, 0, 0, 0.05)` —— 底部导航固定条

---

## 3. 核心组件开发规范

### 3.1 底部导航栏 (TabBar)
- **高度**：`100rpx` + 底部安全区 (`env(safe-area-inset-bottom)`)。
- **图标规范**：
  - 采用标准 2x 图标（`static/tabbar/` 下的 `tab-*-81.png` 或自定义 SVG/PNG）。
  - 图标盒尺寸：`48rpx × 48rpx`。
- **文字与色彩**：
  - 默认态：`#757575`，字号 `22rpx`。
  - 激活态：`#F28A00`，字重 `600`。

### 3.2 房源列表卡片 (House Card)
- **布局结构**：
  - 顶部/左侧房源大图（宽高比 4:3 或 16:9，圆角 `20rpx`），右上角可附带“精选/整租”标签。
  - 标题行：单行/双行截断（`text-overflow: ellipsis`），字体 `32rpx`，加粗。
  - 属性标签栏：采用 Flex 横向排布，间距 `12rpx`，背景为 `$color-primary-light` 或柔灰底。
  - 底部价格栏：金额数字使用专用加大字体（如 `38rpx` 加粗，橙色 `#F28A00`），单位“/月”采用弱化字体（`22rpx`）。

### 3.3 搜索与筛选条 (Search & Filter)
- **搜索条**：高度 `72rpx`，米白底色 `#F2EFE9`，左侧放置搜索图标（`utility-icons` 灰），右侧带清除/筛选触发器。
- **筛选胶囊 (Filter Chips)**：
  - 默认：浅色底 `#FFFFFF`，浅描边 `#EBE6DF`，文字 `#505050`。
  - 激活/选中：浅橙底 `#FFF5E6`，橙色描边 `#F28A00`，文字 `#F28A00`。

### 3.4 操作按钮 (Buttons)
- **主操作按钮 (Primary Button)**：
  - 渐变橙色：`linear-gradient(135deg, #F28A00 0%, #E5A039 100%)`。
  - 文字白色、字重加粗、圆角 `full` 或 `20rpx`。
- **次级按钮 (Secondary Button)**：
  - 白底 / 浅橙底，边框 `1px solid #F28A00`，文字 `#F28A00`。

---

## 4. 目录结构与代码组织规范

Uni-app 统一代码规范推荐如下模块划分：

```text
uniapp-shell/src/
├── api/                  # 后端接口请求定义
├── components/           # 业务公共组件 (遵循 easycom 规范)
│   ├── house-card/       # 房源卡片组件
│   ├── filter-bar/       # 顶部筛选条组件
│   └── search-box/       # 搜索框组件
├── pages/                # 页面目录
│   ├── index/            # 首页 (房源列表)
│   ├── detail/           # 房源详情页
│   └── mine/             # 我的个人中心
├── static/               # 静态图片、图标与精灵图资源
│   ├── images/           # 大图资产
│   └── tabbar/           # 底部导航图标
├── styles/               # 全局样式与 Token 定义
│   ├── variables.scss    # 全局色彩与尺寸变量
│   └── mixins.scss       # 通用文本截断、Flex 居中等 Mixin
├── uni.scss              # uni-app 全局注入变量
├── App.vue               # 应用入口与全局通用类
└── pages.json            # 路由与原生窗口/TabBar 配置
```

---

## 5. 前端编码与性能规范

1. **组合式 API (Vue 3 Composition API)**：
   - 统一采用 `<script setup>` 语法，保证类型与逻辑的高内聚。
2. **图片优化与懒加载**：
   - 房源列表大图统一开启 `<image :lazy-load="true" mode="aspectFill" />`。
   - 关键首屏背景图与大图合理压缩，避免包体积膨胀。
3. **安全区域适配**：
   - 底部固定操作条与 TabBar 必须包含 `padding-bottom: constant(safe-area-inset-bottom); padding-bottom: env(safe-area-inset-bottom);`。
4. **CSS 变量与主题拓展性**：
   - 样式中严禁直接硬编码 `#F28A00` 等魔法值，必须统一引用 `$color-primary` 或统一定义的 SCSS 变量。
