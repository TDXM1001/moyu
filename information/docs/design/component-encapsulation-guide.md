# 租房系统 Uni-ui 二次封装与组件工程规划规范

为避免**重复造轮子**，同时保证 UI 视觉高度还原（暖橙/米白风格）与多端一致性，制定本套 **Uni-ui 二次封装与定制组件规划指南**。

---

## 1. 核心策略：Uni-ui 二次封装 vs 纯手写组件边界

| 类别 | 推荐选型 | 选用原则 / 封装目的 |
|---|---|---|
| **复杂逻辑/交互组件** | **二次封装 `uni-ui`** | 弹窗 (`uni-popup`)、搜索条 (`uni-search-bar`)、徽标 (`uni-badge`)、标签 (`uni-tag`)、下拉菜单等。利用官方底层的键盘弹起监听、无障碍支持、遮罩逻辑，仅重写外观样式。 |
| **高定制业务视觉组件** | **自建业务组件** | 房源卡片 (`rf-house-card`)、顶部金刚区/筛选条 (`rf-filter-bar`)、房源参数栏、房源底部操作条。业务特异性强，手写更轻量、更易精确还原设计稿。 |
| **图标与视觉资源** | **切图/精灵图封装** | 精灵图图标组件 (`rf-icon`)，统一管理 `rental-ui-assets` 中的图标定位。 |

> **命名规范**：所有二次封装与业务组件统一采用 `rf-`（Rental Frontend）前缀，并放置在 `src/components/rf-xxx/rf-xxx.vue` 目录下，利用 `pages.json` 的 `easycom` 实现全局按需自动加载。

---

## 2. 常用 Uni-ui 组件二次封装清单与样式覆盖方案

### 2.1 `rf-search-bar`（封装 `uni-search-bar`）
- **UI 差异**：
  - 原生默认：白底灰框，直角或固定小圆角。
  - 目标 UI：暖色调浅底（`#F2EFE9`）、大圆角（`36rpx` / 全圆角）、去除默认边框、支持左侧或右侧嵌入筛选入口。
- **封装方案**：
  - 内部集成 `uni-search-bar` 或基于原生 `input` 深度定制；
  - 封装统一的 `placeholder` 样式与防抖 `change/search` 事件。

### 2.2 `rf-tag`（封装 `uni-tag`）
- **UI 差异**：
  - 原生默认：高饱和度蓝/绿背景。
  - 目标 UI：米浅橙底（`#FFF5E6`）搭配暖橙字（`#F28A00`），或柔灰底（`#F2EFE9`）搭配沉稳字（`#505050`），圆角 `8rpx ~ 12rpx`。
- **封装方案**：
  - 提供 `theme` 属性（如 `primary` / `neutral` / `outline` / `gold`），根据设计稿直接映射到对应的背景与文字色。

### 2.3 `rf-popup`（封装 `uni-popup`）
- **UI 差异**：
  - 目标 UI：底部弹出层顶部双大圆角（`32rpx 32rpx 0 0`）、白色卡片底、带统一的头部标题栏与关闭叉号。
- **封装方案**：
  - 外层封装统一的标题、确认按钮和 SafeArea 底部安全区，简化页面使用。

### 2.4 `rf-badge`（封装 `uni-badge`）
- **UI 差异**：
  - 目标 UI：暖金橙色（`#E5A039`）或亮橙红（`#FF5E3A`），微小字号（`20rpx`）。

---

## 3. 业务组件库规划清单 (避免页面重复开发)

```text
src/components/
├── rf-icon/            # 精灵图/通用图标组件 (封装 utility-icons 精灵图切片)
├── rf-tag/             # 设计规范标签组件 (基于 uni-tag 二次封装)
├── rf-search-bar/      # 顶部搜索条 (集成筛选按钮入口)
├── rf-filter-bar/      # 房源筛选胶囊条 (区域/租金/户型/更多筛选)
├── rf-house-card/      # 核心房源卡片 (列表/收藏复用，包含图片、标签、价格)
├── rf-price/           # 价格格式化组件 (大字号金额 + 弱化单位 "¥3200 /月")
└── rf-bottom-bar/      # 详情页底部固定操作栏 (在线沟通/立即预约 + 收藏)
```

---

## 4. `pages.json` 中的 `easycom` 自动导入配置

在 `uniapp-shell/src/pages.json` 中配置：

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
      "^rf-(.*)": "@/components/rf-$1/rf-$1.vue"
    }
  }
}
```

配置后，在任意 `.vue` 页面中可直接使用 `<rf-house-card />`、`<rf-tag />`，无需手动 `import`。

---

## 5. 组件开发关键注意事项

1. **样式穿透规范**：
   - 当需要覆写 `uni-ui` 内部样式时，在 Vue 3 `<style lang="scss" scoped>` 中统一使用 `:deep(.uni-xxx)`。
2. **多端单位严格遵循 `rpx`**：
   - 组件内所有布局、内边距、字体等尺寸必须使用 `rpx`（如 `24rpx`、`32rpx`），严禁随意写固定像素导致平板或小屏变形。
3. **Props 扩展与透传**：
   - 二次封装组件需支持透传 `v-bind="$attrs"`，保留 `uni-ui` 原有的核心属性与事件。
