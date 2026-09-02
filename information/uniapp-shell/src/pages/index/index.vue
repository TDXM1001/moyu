<template>
  <view class="page-container">
    <!-- 1. 顶部全景 Hero 视觉区域 -->
    <view class="hero-header">
      <!-- 暖阳家居背景图 -->
      <image
        class="hero-bg-image"
        src="/static/images/hero-home-corner.png"
        mode="aspectFill"
      />
      
      <!-- 渐变光影蒙层 -->
      <view class="hero-lighting-overlay"></view>

      <!-- 前景内容容器 -->
      <view class="hero-foreground-content">
        <!-- 状态栏占位 -->
        <view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

        <!-- 城市选择 -->
        <view class="city-selector" @click="handleCityClick">
          <text class="city-name">{{ currentCity }}</text>
          <uni-icons type="bottom" size="14" color="#E67E22" />
        </view>

        <!-- 主标语与连笔爱心飘带 -->
        <view class="slogan-section">
          <view class="slogan-title-row">
            <text class="slogan-title">找个舒服的家</text>
            <!-- 连笔心形涂鸦 SVG -->
            <view class="heart-ribbon-box">
              <svg width="60" height="42" viewBox="0 0 60 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 28 C 16 18, 22 8, 28 8 C 34 8, 38 14, 38 20 C 38 27, 24 35, 15 37" stroke="#DE7722" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                <path d="M28 8 C 24 4, 18 4, 14 8 C 9 13, 10 22, 17 29 C 24 36, 38 38, 56 38" stroke="#DE7722" stroke-width="2.2" stroke-linecap="round" fill="none"/>
              </svg>
            </view>
          </view>
          <view class="slogan-subtitle-row">
            <text class="slogan-subtitle">可租房源</text>
            <view class="slogan-brush-line"></view>
          </view>
        </view>

        <!-- 搜索输入框 (使用 uni-search-bar) -->
        <view class="search-box-wrap">
          <uni-search-bar
            v-model="searchKeyword"
            placeholder="搜索小区、地铁、商圈"
            bgColor="#FFFFFF"
            radius="100"
            cancelButton="none"
            clearButton="auto"
            @confirm="handleSearch"
            @clear="handleClearSearch"
          />
        </view>

        <!-- 四个胶囊筛选按钮 -->
        <view class="filter-capsules-wrap">
          <view class="filter-tabs-row">
            <view
              v-for="item in filterTabs"
              :key="item.key"
              class="filter-tab-pill"
              :class="{ active: activeDropdownKey === item.key || isFilterActive(item.key) }"
              @click="handleFilterTabClick(item.key)"
            >
              <uni-icons :type="item.icon" size="15" :color="activeDropdownKey === item.key || isFilterActive(item.key) ? '#F28A00' : '#E67E22'" class="pill-icon" />
              <text class="pill-label">{{ getTabDisplayLabel(item) }}</text>
              <uni-icons
                type="bottom"
                size="11"
                :color="activeDropdownKey === item.key || isFilterActive(item.key) ? '#F28A00' : '#B0A8A0'"
                class="pill-arrow"
                :class="{ rotated: activeDropdownKey === item.key }"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 2. 下拉筛选抽屉 (使用 uni-popup) -->
    <uni-popup ref="filterPopup" type="top" :safe-area="false" @change="onPopupChange">
      <view class="filter-popup-content" :style="{ paddingTop: (statusBarHeight + 220) + 'px' }">
        <view class="dropdown-panel">
          <!-- 区域筛选 -->
          <view v-if="activeDropdownKey === 'district'" class="filter-options-grid">
            <view
              v-for="item in mockFilterConfig.districts"
              :key="item.value"
              class="option-pill"
              :class="{ selected: activeFilters.district === item.value }"
              @click="applyFilter('district', item.value)"
            >
              {{ item.label }}
            </view>
          </view>

          <!-- 户型筛选 -->
          <view v-if="activeDropdownKey === 'layout'" class="filter-options-grid">
            <view
              v-for="item in mockFilterConfig.layouts"
              :key="item.value"
              class="option-pill"
              :class="{ selected: activeFilters.layout === item.value }"
              @click="applyFilter('layout', item.value)"
            >
              {{ item.label }}
            </view>
          </view>

          <!-- 租金筛选 -->
          <view v-if="activeDropdownKey === 'priceRange'" class="filter-options-grid">
            <view
              v-for="item in mockFilterConfig.priceRanges"
              :key="item.value"
              class="option-pill"
              :class="{ selected: activeFilters.priceRange === item.value }"
              @click="applyFilter('priceRange', item.value)"
            >
              {{ item.label }}
            </view>
          </view>

          <!-- 更多筛选 -->
          <view v-if="activeDropdownKey === 'more'" class="filter-options-grid">
            <view
              v-for="item in mockFilterConfig.moreOptions"
              :key="item.value"
              class="option-pill"
              :class="{ selected: activeFilters.more === item.value }"
              @click="applyFilter('more', item.value)"
            >
              {{ item.label }}
            </view>
          </view>

          <view class="dropdown-footer">
            <button class="action-btn btn-reset" @click="resetCurrentFilter">重置</button>
            <button class="action-btn btn-confirm" @click="closeDropdown">确定</button>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- 3. 房源卡片列表区 -->
    <view class="house-list-section">
      <view
        v-for="house in filteredHouses"
        :key="house.id"
        class="house-card-item"
        @click="goToDetail(house)"
      >
        <!-- 左侧房源封面图 -->
        <view class="card-cover-box">
          <image
            class="card-cover"
            :src="house.coverImage"
            mode="aspectFill"
            :lazy-load="true"
          />
        </view>

        <!-- 右侧房源详细参数 -->
        <view class="card-info-box">
          <!-- 标题与右上角收藏 -->
          <view class="title-row">
            <text class="house-title">{{ house.title }}</text>
            <view class="favorite-wrap" @click.stop="toggleFavorite(house)">
              <uni-icons
                :type="house.isFavorite ? 'heart-filled' : 'heart'"
                size="19"
                :color="house.isFavorite ? '#F28A00' : '#B0A8A0'"
              />
            </view>
          </view>

          <!-- 规格行：户型 | 面积 | 朝向 -->
          <view class="specs-row">
            <uni-icons type="calendar" size="13" color="#8C847B" class="specs-icon" />
            <text class="specs-text">{{ house.layout }}</text>
            <text class="specs-divider">|</text>
            <text class="specs-text">{{ house.area }}m²</text>
            <text class="specs-divider">|</text>
            <text class="specs-text">{{ house.orientation }}</text>
          </view>

          <!-- 地址与地铁距离行 -->
          <view class="location-row">
            <uni-icons type="location-filled" size="12" color="#8C847B" class="loc-icon" />
            <text class="loc-text">{{ house.address }}</text>
          </view>

          <!-- 特色标签组 (配合 uni-tag 样式) -->
          <view class="tags-row">
            <view
              v-for="(tag, idx) in house.tags"
              :key="idx"
              class="tag-wrapper"
            >
              <uni-tag
                :text="tag.text || tag"
                size="small"
                :class="getTagThemeClass(tag.text || tag)"
              />
            </view>
          </view>

          <!-- 底部价格展示 -->
          <view class="price-row">
            <text class="price-symbol">¥</text>
            <text class="price-num">{{ house.priceFormatted || house.price }}</text>
            <text class="price-unit">/月</text>
          </view>
        </view>
      </view>

      <!-- 搜索/筛选无结果空状态 -->
      <view v-if="filteredHouses.length === 0" class="empty-state">
        <uni-icons type="info" size="48" color="#CCCCCC" class="empty-icon" />
        <text class="empty-title">暂无符合条件的房源</text>
        <text class="empty-desc">尝试调整筛选条件或搜索其他关键词</text>
        <button class="btn-clear-filter" @click="resetAllFilters">清除全部筛选</button>
      </view>
    </view>

    <!-- 4. 底部主导航 TabBar -->
    <view class="custom-tabbar">
      <view class="tab-item active" @click="switchTab('home')">
        <uni-icons type="home-filled" size="24" color="#F28A00" class="tab-icon" />
        <text class="tab-text active">房源</text>
      </view>
      <view class="tab-item" @click="switchTab('mine')">
        <uni-icons type="person" size="24" color="#747474" class="tab-icon" />
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockHouses, mockFilterConfig } from '@/mock/houses.js'

// 状态栏高度适配
const statusBarHeight = ref(20)

onMounted(() => {
  try {
    const sys = uni.getSystemInfoSync()
    if (sys.statusBarHeight) {
      statusBarHeight.value = sys.statusBarHeight
    }
  } catch (e) {
    statusBarHeight.value = 20
  }
})

// 城市
const currentCity = ref('深圳')
const handleCityClick = () => {
  uni.showToast({ title: '当前仅开放深圳房源', icon: 'none' })
}

// 搜索
const searchKeyword = ref('')
const handleSearch = (res) => {
  const val = typeof res === 'string' ? res : res?.value || ''
  searchKeyword.value = val
}
const handleClearSearch = () => {
  searchKeyword.value = ''
}

// 筛选标签定义
const filterTabs = [
  { key: 'district', label: '区域', icon: 'location' },
  { key: 'layout', label: '户型', icon: 'home' },
  { key: 'priceRange', label: '租金', icon: 'wallet' },
  { key: 'more', label: '更多', icon: 'tune' }
]

const filterPopup = ref(null)
const activeDropdownKey = ref('')
const activeFilters = ref({
  district: 'all',
  layout: 'all',
  priceRange: 'all',
  more: 'all'
})

const isFilterActive = (key) => {
  const val = activeFilters.value[key]
  return val && val !== 'all'
}

const getTabDisplayLabel = (item) => {
  const activeVal = activeFilters.value[item.key]
  if (activeVal && activeVal !== 'all') {
    if (item.key === 'district') {
      const match = mockFilterConfig.districts.find(d => d.value === activeVal)
      return match ? match.label : activeVal
    }
    if (item.key === 'layout') {
      const match = mockFilterConfig.layouts.find(l => l.value === activeVal)
      return match ? match.label : activeVal
    }
    if (item.key === 'priceRange') {
      const match = mockFilterConfig.priceRanges.find(p => p.value === activeVal)
      return match ? match.label : activeVal
    }
    if (item.key === 'more') {
      const match = mockFilterConfig.moreOptions.find(m => m.value === activeVal)
      return match ? match.label : activeVal
    }
  }
  return item.label
}

const handleFilterTabClick = (key) => {
  if (activeDropdownKey.value === key) {
    closeDropdown()
  } else {
    activeDropdownKey.value = key
    filterPopup.value?.open()
  }
}

const closeDropdown = () => {
  filterPopup.value?.close()
  activeDropdownKey.value = ''
}

const onPopupChange = (e) => {
  if (!e.show) {
    activeDropdownKey.value = ''
  }
}

const applyFilter = (type, val) => {
  activeFilters.value[type] = val
}

const resetCurrentFilter = () => {
  if (activeDropdownKey.value) {
    activeFilters.value[activeDropdownKey.value] = 'all'
  }
}

const resetAllFilters = () => {
  searchKeyword.value = ''
  activeFilters.value = {
    district: 'all',
    layout: 'all',
    priceRange: 'all',
    more: 'all'
  }
}

// 房源数据与过滤
const houseList = ref([...mockHouses])

const filteredHouses = computed(() => {
  return houseList.value.filter(item => {
    if (searchKeyword.value.trim()) {
      const kw = searchKeyword.value.trim().toLowerCase()
      const inTitle = item.title.toLowerCase().includes(kw)
      const inAddr = item.address.toLowerCase().includes(kw)
      const inLayout = item.layout.toLowerCase().includes(kw)
      if (!inTitle && !inAddr && !inLayout) return false
    }

    if (activeFilters.value.district !== 'all') {
      if (!item.district.includes(activeFilters.value.district)) return false
    }

    if (activeFilters.value.layout !== 'all') {
      if (item.layout !== activeFilters.value.layout) return false
    }

    if (activeFilters.value.priceRange !== 'all') {
      const p = item.price
      if (activeFilters.value.priceRange === '0-4000' && p > 4000) return false
      if (activeFilters.value.priceRange === '4000-6000' && (p < 4000 || p > 6000)) return false
      if (activeFilters.value.priceRange === '6000-8000' && (p < 6000 || p > 8000)) return false
      if (activeFilters.value.priceRange === '8000-999999' && p < 8000) return false
    }

    if (activeFilters.value.more !== 'all') {
      const moreVal = activeFilters.value.more
      if (moreVal === 'near_subway' && !item.tags.some(t => (t.text || t).includes('地铁'))) return false
      if (moreVal === 'fine_decoration' && !item.tags.some(t => (t.text || t).includes('装修'))) return false
      if (moreVal === 'ready_to_move' && !item.tags.some(t => (t.text || t).includes('入住'))) return false
    }

    return true
  })
})

const getTagThemeClass = (text) => {
  if (text.includes('地铁')) return 'uni-tag-metro'
  if (text.includes('装修')) return 'uni-tag-deco'
  if (text.includes('入住')) return 'uni-tag-ready'
  return 'uni-tag-metro'
}

// 交互操作
const toggleFavorite = (house) => {
  house.isFavorite = !house.isFavorite
  uni.showToast({
    title: house.isFavorite ? '已加入收藏' : '已取消收藏',
    icon: 'none'
  })
}

const goToDetail = (house) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${house.id}`
  })
}

const switchTab = (tab) => {
  if (tab === 'mine') {
    uni.showToast({
      title: '“我的”功能开发中',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
// 页面基础配置
page {
  background-color: #F8F6F2;
}
</style>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #F8F6F2;
  position: relative;
  padding-bottom: 120rpx;
  box-sizing: border-box;
}

// 1. 顶部全景 Hero 视觉区域
.hero-header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #FDE6CE 0%, #FDF1E2 60%, #F8F6F2 100%);
  padding: 0 32rpx 28rpx;
  box-sizing: border-box;

  .hero-bg-image {
    position: absolute;
    right: -40rpx;
    top: 0;
    width: 620rpx;
    height: 440rpx;
    opacity: 0.95;
    pointer-events: none;
    z-index: 1;
  }

  .hero-lighting-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(253, 230, 206, 0.98) 0%, rgba(253, 230, 206, 0.75) 45%, rgba(253, 230, 206, 0.1) 85%);
    pointer-events: none;
    z-index: 2;
  }

  .hero-foreground-content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;

    .status-bar-placeholder {
      width: 100%;
    }

    .city-selector {
      display: inline-flex;
      align-items: center;
      padding-top: 14rpx;
      margin-bottom: 20rpx;
      align-self: flex-start;
      cursor: pointer;

      .city-name {
        font-size: 34rpx;
        font-weight: 700;
        color: #26211D;
        margin-right: 8rpx;
      }
    }

    .slogan-section {
      margin-bottom: 24rpx;

      .slogan-title-row {
        display: flex;
        align-items: center;
        margin-bottom: 6rpx;

        .slogan-title {
          font-size: 46rpx;
          font-weight: 800;
          color: #201D1A;
          letter-spacing: 0.5rpx;
        }

        .heart-ribbon-box {
          margin-left: 10rpx;
          display: flex;
          align-items: center;
        }
      }

      .slogan-subtitle-row {
        position: relative;
        display: inline-flex;
        align-items: center;

        .slogan-subtitle {
          font-size: 30rpx;
          font-weight: 600;
          color: #201D1A;
          position: relative;
          z-index: 2;
        }

        .slogan-brush-line {
          position: absolute;
          left: 130rpx;
          width: 220rpx;
          height: 6rpx;
          background: linear-gradient(90deg, #F28A00 0%, rgba(242, 138, 0, 0.15) 100%);
          border-radius: 999rpx;
          z-index: 1;
        }
      }
    }

    // 针对 uni-search-bar 进行贴合设计图的微调
    .search-box-wrap {
      margin-bottom: 20rpx;

      :deep(.uni-searchbar) {
        padding: 0;
        background-color: transparent !important;
      }

      :deep(.uni-searchbar__box) {
        height: 84rpx !important;
        border: 1px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 4rpx 16rpx rgba(220, 180, 140, 0.14);
        padding: 0 24rpx;
      }

      :deep(.uni-searchbar__text-placeholder) {
        font-size: 28rpx;
        color: #9E968E;
      }

      :deep(.uni-input-input) {
        font-size: 28rpx;
        color: #202020;
      }
    }

    .filter-capsules-wrap {
      margin-bottom: 8rpx;

      .filter-tabs-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 16rpx;

        .filter-tab-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 64rpx;
          background-color: #FFFFFF;
          border-radius: 999rpx;
          padding: 0 12rpx;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(235, 230, 223, 0.7);
          cursor: pointer;
          transition: all 0.2s ease;

          .pill-icon {
            margin-right: 6rpx;
          }

          .pill-label {
            font-size: 25rpx;
            color: #2E2822;
            font-weight: 500;
            white-space: nowrap;
          }

          .pill-arrow {
            margin-left: 6rpx;
            transition: transform 0.2s ease;

            &.rotated {
              transform: rotate(180deg);
            }
          }

          &.active {
            background-color: #FFF6EC;
            border-color: #F28A00;

            .pill-label {
              color: #F28A00;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}

// 2. uni-popup 抽屉面板内容
.filter-popup-content {
  background-color: rgba(0, 0, 0, 0.35);
  min-height: 100vh;
  box-sizing: border-box;

  .dropdown-panel {
    background-color: #FFFFFF;
    border-radius: 0 0 32rpx 32rpx;
    padding: 32rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);

    .filter-options-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16rpx;
      margin-bottom: 32rpx;

      .option-pill {
        padding: 16rpx 0;
        text-align: center;
        background-color: #F2EFE9;
        color: #505050;
        font-size: 26rpx;
        border-radius: 12rpx;
        font-weight: 500;
        transition: all 0.15s ease;

        &.selected {
          background-color: #FFF5E6;
          color: #F28A00;
          font-weight: 600;
          border: 1px solid #F28A00;
        }
      }
    }

    .dropdown-footer {
      display: flex;
      gap: 20rpx;

      .action-btn {
        flex: 1;
        height: 76rpx;
        line-height: 76rpx;
        border-radius: 999rpx;
        font-size: 28rpx;
        font-weight: 600;

        &.btn-reset {
          background-color: #F2EFE9;
          color: #505050;
          border: none;
        }

        &.btn-confirm {
          background: linear-gradient(135deg, #F28A00 0%, #E5A039 100%);
          color: #FFFFFF;
          border: none;
        }
      }
    }
  }
}

// 3. 房源卡片列表区
.house-list-section {
  padding: 16rpx 32rpx 0;

  .house-card-item {
    position: relative;
    background-color: #FFFFFF;
    border-radius: 28rpx;
    padding: 22rpx 20rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: row;
    align-items: stretch;
    border: 1px solid rgba(235, 230, 223, 0.5);
    box-sizing: border-box;

    &:active {
      background-color: #FAF8F5;
    }

    .card-cover-box {
      width: 236rpx;
      height: 236rpx;
      flex-shrink: 0;
      border-radius: 20rpx;
      overflow: hidden;
      background-color: #F0EDE8;

      .card-cover {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    .card-info-box {
      flex: 1;
      min-width: 0;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8rpx;

        .house-title {
          font-size: 32rpx;
          font-weight: 700;
          color: #202020;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .favorite-wrap {
          padding: 4rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }

      .specs-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;

        .specs-icon {
          margin-right: 8rpx;
        }

        .specs-text {
          font-size: 24rpx;
          color: #404040;
          font-weight: 500;
          line-height: 1.2;
        }

        .specs-divider {
          font-size: 20rpx;
          color: #B0AAA2;
          margin: 0 10rpx;
        }
      }

      .location-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .loc-icon {
          margin-right: 6rpx;
        }

        .loc-text {
          font-size: 21rpx;
          color: #747474;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
      }

      .tags-row {
        display: flex;
        flex-wrap: nowrap;
        gap: 10rpx;
        margin-bottom: 10rpx;

        .tag-wrapper {
          :deep(.uni-tag) {
            border-radius: 6rpx;
            padding: 4rpx 10rpx;
            font-size: 20rpx;
            line-height: 1.2;
            border: none !important;
          }

          :deep(.uni-tag-metro) {
            background-color: #EDF6EE !important;
            color: #4B8E55 !important;
          }

          :deep(.uni-tag-deco) {
            background-color: #FDF1EA !important;
            color: #DC6B38 !important;
          }

          :deep(.uni-tag-ready) {
            background-color: #EFF5EC !important;
            color: #558A48 !important;
          }
        }
      }

      .price-row {
        display: flex;
        align-items: baseline;

        .price-symbol {
          font-size: 28rpx;
          font-weight: 700;
          color: #E67E22;
          margin-right: 4rpx;
        }

        .price-num {
          font-size: 38rpx;
          font-weight: 800;
          color: #E67E22;
          line-height: 1;
        }

        .price-unit {
          font-size: 22rpx;
          color: #E67E22;
          margin-left: 2rpx;
        }
      }
    }
  }

  .empty-state {
    padding: 80rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .empty-icon {
      margin-bottom: 20rpx;
    }

    .empty-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #202020;
      margin-bottom: 8rpx;
    }

    .empty-desc {
      font-size: 24rpx;
      color: #A6A6A6;
      margin-bottom: 32rpx;
    }

    .btn-clear-filter {
      padding: 0 40rpx;
      height: 68rpx;
      line-height: 68rpx;
      background-color: #FFF5E6;
      color: #F28A00;
      font-size: 26rpx;
      border-radius: 999rpx;
      border: 1px solid #F28A00;
    }
  }
}

// 4. TabBar 导航
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  height: 106rpx;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #FFFFFF;
  box-shadow: 0 -2rpx 16rpx rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
  border-top: 1px solid rgba(235, 230, 223, 0.4);

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 6rpx 0;

    .tab-icon {
      margin-bottom: 4rpx;
    }

    .tab-text {
      font-size: 22rpx;
      color: #747474;
      font-weight: 500;

      &.active {
        color: #F28A00;
        font-weight: 600;
      }
    }
  }
}
</style>
