<template>
  <view class="detail-container">
    <!-- 1. 自定义顶部导航栏 (使用 uni-nav-bar) -->
    <view class="nav-bar-wrapper" :style="{ paddingTop: statusBarHeight + 'px' }">
      <uni-nav-bar
        :border="false"
        :fixed="false"
        background-color="rgba(248, 246, 242, 0.96)"
        color="#201E1C"
        title="房源详情"
        @clickLeft="handleBack"
      >
        <template #left>
          <view class="nav-left-btn">
            <uni-icons type="left" size="22" color="#201E1C" />
          </view>
        </template>
        <template #right>
          <view class="nav-right-actions">
            <view class="nav-btn" @click="handleToggleFavorite">
              <uni-icons
                :type="houseDetail.isFavorite ? 'heart-filled' : 'heart'"
                size="22"
                :color="houseDetail.isFavorite ? '#F28A00' : '#201E1C'"
              />
            </view>
            <view class="nav-btn" @click="handleShare">
              <uni-icons type="redo" size="22" color="#201E1C" />
            </view>
          </view>
        </template>
      </uni-nav-bar>
    </view>

    <!-- 页面滚动内容区 -->
    <scroll-view scroll-y class="detail-scroll-view" :show-scrollbar="false">
      <!-- 2. 顶部轮播大图 (使用 uni-swiper-dot) -->
      <view class="banner-section">
        <uni-swiper-dot
          :info="bannerList"
          :current="currentBannerIndex"
          mode="dot"
          :dots-styles="{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            border: 'none',
            color: '#fff',
            selectedBackgroundColor: '#F28A00',
            selectedBorder: 'none'
          }"
        >
          <swiper
            class="banner-swiper"
            :autoplay="false"
            :interval="4000"
            :duration="300"
            :circular="true"
            @change="handleSwiperChange"
          >
            <swiper-item v-for="(img, idx) in bannerList" :key="idx">
              <image class="banner-img" :src="img" mode="aspectFill" @click="previewImage(idx)" />
            </swiper-item>
          </swiper>
        </uni-swiper-dot>

        <!-- 右下角角标 1/8 -->
        <view class="page-counter-badge">
          <text class="current">{{ currentBannerIndex + 1 }}</text>
          <text class="total">/{{ bannerList.length }}</text>
        </view>
      </view>

      <!-- 3. 房源核心主卡片 -->
      <view class="main-info-card">
        <!-- 价格与右侧胶囊收藏按钮 -->
        <view class="price-header-row">
          <view class="price-box">
            <text class="price-symbol">¥</text>
            <text class="price-number">{{ houseDetail.priceFormatted }}</text>
            <text class="price-unit">/月</text>
          </view>

          <!-- 收藏胶囊按钮 -->
          <view
            class="collect-capsule-btn"
            :class="{ favorited: houseDetail.isFavorite }"
            @click="handleToggleFavorite"
          >
            <uni-icons
              :type="houseDetail.isFavorite ? 'heart-filled' : 'heart'"
              size="16"
              :color="houseDetail.isFavorite ? '#FFFFFF' : '#8A8279'"
            />
            <text class="capsule-text">{{ houseDetail.isFavorite ? '已收藏' : '收藏' }}</text>
          </view>
        </view>

        <!-- 房源标题 -->
        <view class="house-main-title">
          {{ houseDetail.title }}
        </view>

        <!-- 房源三列核心属性 (户型 | 建筑面积 | 朝向) -->
        <view class="house-spec-grid">
          <view class="spec-col">
            <view class="spec-val-row">
              <uni-icons type="calendar" size="16" color="#332E29" />
              <text class="spec-val">{{ houseDetail.layout }}</text>
            </view>
            <text class="spec-label">户型</text>
          </view>
          <view class="spec-divider-line" />
          <view class="spec-col">
            <view class="spec-val-row">
              <text class="spec-val">{{ houseDetail.area }}㎡</text>
            </view>
            <text class="spec-label">建筑面积</text>
          </view>
          <view class="spec-divider-line" />
          <view class="spec-col">
            <view class="spec-val-row">
              <text class="spec-val">{{ houseDetail.orientation }}</text>
            </view>
            <text class="spec-label">朝向</text>
          </view>
        </view>

        <view class="card-inner-divider" />

        <!-- 位置与地铁距离 -->
        <view class="location-link-row" @click="handleOpenMap">
          <uni-icons type="location-filled" size="16" color="#F28A00" class="loc-pin-icon" />
          <text class="loc-text">{{ houseDetail.address }}</text>
          <uni-icons type="right" size="14" color="#A8A198" />
        </view>

        <!-- 房源标签组 (使用 uni-tag) -->
        <view class="tags-capsule-row">
          <view
            v-for="(tag, idx) in houseDetail.tags"
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
      </view>

      <!-- 4. 房源亮点卡片 -->
      <view class="highlights-card">
        <view class="section-title-row">
          <uni-icons type="star-filled" size="18" color="#F28A00" />
          <text class="section-title-text">房源亮点</text>
        </view>

        <view class="highlights-list">
          <view v-for="(h, idx) in houseDetail.highlights" :key="idx" class="highlight-item">
            <uni-icons type="checkbox-filled" size="16" color="#F28A00" />
            <text class="highlight-desc">{{ h }}</text>
          </view>
        </view>

        <!-- 装饰植物与沙发 -->
        <image class="deco-sofa-bg" src="/static/images/detail/deco-sofa-lamp.png" mode="aspectFit" />
      </view>

      <!-- 5. 配套设施卡片 -->
      <view class="facilities-card">
        <view class="section-title-row">
          <uni-icons type="settings-filled" size="18" color="#F28A00" />
          <text class="section-title-text">配套设施</text>
        </view>

        <view class="facilities-grid">
          <view v-for="item in facilitiesList" :key="item.key" class="facility-cell">
            <view class="facility-icon-circle">
              <uni-icons :type="item.icon" size="24" color="#8A7D71" />
            </view>
            <text class="facility-name">{{ item.name }}</text>
          </view>
        </view>

        <view class="facility-sub-note">
          <text>配备品牌家电家具 · 专属管家 24h 保障 · 随时报修</text>
        </view>
      </view>

      <!-- 6. 房源介绍卡片 -->
      <view class="intro-card">
        <view class="section-title-row">
          <uni-icons type="paperclip" size="18" color="#F28A00" />
          <text class="section-title-text">房源介绍</text>
        </view>

        <view class="intro-content-text">
          <text>{{ houseDetail.description }}</text>
        </view>
      </view>

      <view class="bottom-safe-space"></view>
    </scroll-view>

    <!-- 7. 底部固定主操作栏 -->
    <view class="bottom-fixed-bar">
      <button class="primary-consult-btn" @click="handleConsultLandlord">
        <uni-icons type="chat-filled" size="20" color="#FFFFFF" style="margin-right: 8rpx;" />
        <text>咨询房东</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { mockHouses } from '@/mock/houses.js'

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

// 默认房源详情
const houseDetail = reactive({
  id: 'house_001',
  title: '南山 · 科技园',
  layout: '2室1厅',
  area: 88,
  orientation: '南向',
  address: '深南大道附近 · 距地铁1号线深大站约600米',
  price: 6800,
  priceFormatted: '6,800',
  isFavorite: false,
  tags: [
    { text: '近地铁' },
    { text: '精装修' },
    { text: '拎包入住' }
  ],
  highlights: [
    '采光充足，南北通透格局',
    '近地铁1号线深大站步行可达',
    '全套品牌家电，配置智能门锁'
  ],
  description: '房源位于南山科技园核心地段，周边配套齐全，近地铁1号线深大站。全屋现代精装修，采光通透，全套品牌家电家具齐全，随时拎包入住。民用水电，无中介费，房东直租好房，欢迎看房。'
})

// 轮播图列表
const currentBannerIndex = ref(0)
const bannerList = ref([
  '/static/images/detail/slide-living-room.jpg',
  '/static/images/detail/slide-bedroom.jpg',
  '/static/images/detail/slide-kitchen.jpg',
  '/static/images/listing-nanshan-living-room.png'
])

// 配套设施
const facilitiesList = ref([
  { key: 'refrigerator', name: '冰箱', icon: 'shop' },
  { key: 'washing_machine', name: '洗衣机', icon: 'loop' },
  { key: 'air_conditioner', name: '空调', icon: 'snow' },
  { key: 'water_heater', name: '热水器', icon: 'fire' },
  { key: 'gas_stove', name: '燃气灶', icon: 'tune' },
  { key: 'wifi', name: '宽带', icon: 'wifi' }
])

onLoad((query) => {
  if (query && query.id) {
    const target = mockHouses.find(h => h.id === query.id)
    if (target) {
      Object.assign(houseDetail, target)
      if (target.coverImage) {
        bannerList.value[0] = target.coverImage
      }
    }
  }
})

const handleSwiperChange = (e) => {
  currentBannerIndex.value = e.detail.current
}

const previewImage = (idx) => {
  uni.previewImage({
    current: idx,
    urls: bannerList.value
  })
}

const getTagThemeClass = (text) => {
  if (text.includes('地铁')) return 'uni-tag-metro'
  if (text.includes('装修')) return 'uni-tag-deco'
  if (text.includes('入住')) return 'uni-tag-ready'
  return 'uni-tag-metro'
}

const handleBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

const handleToggleFavorite = () => {
  houseDetail.isFavorite = !houseDetail.isFavorite
  uni.showToast({
    title: houseDetail.isFavorite ? '已收藏' : '已取消收藏',
    icon: 'none'
  })
}

const handleShare = () => {
  uni.showToast({
    title: '已复制分享链接',
    icon: 'none'
  })
}

const handleOpenMap = () => {
  uni.showToast({
    title: '正在导航至房源位置...',
    icon: 'none'
  })
}

const handleConsultLandlord = () => {
  uni.showModal({
    title: '联系房东',
    content: '房东电话：138-8888-6666\n是否立即拨打？',
    confirmText: '呼叫',
    confirmColor: '#E66F00',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '13888886666',
          fail: () => {
            uni.showToast({ title: '已复制房东联系方式', icon: 'none' })
          }
        })
      }
    }
  })
}
</script>

<style lang="scss">
page {
  background-color: #F8F6F2;
}
</style>

<style lang="scss" scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F8F6F2;
  position: relative;
  overflow: hidden;
}

// 1. 自定义顶部导航栏
.nav-bar-wrapper {
  background: rgba(248, 246, 242, 0.96);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(235, 230, 223, 0.4);

  .nav-left-btn {
    width: 68rpx;
    height: 68rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .nav-right-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .nav-btn {
      width: 68rpx;
      height: 68rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }

  :deep(.uni-navbar__header-container) {
    font-size: 32rpx;
    font-weight: 700;
  }
}

// 页面滚动内容区
.detail-scroll-view {
  flex: 1;
  height: calc(100vh - 120rpx);
}

// 2. 轮播图
.banner-section {
  position: relative;
  width: 100%;
  height: 520rpx;
  background-color: #EFEBE5;

  .banner-swiper {
    width: 100%;
    height: 100%;

    .banner-img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .page-counter-badge {
    position: absolute;
    right: 28rpx;
    bottom: 24rpx;
    background-color: rgba(0, 0, 0, 0.55);
    padding: 6rpx 18rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: baseline;
    z-index: 10;

    .current {
      font-size: 26rpx;
      font-weight: 700;
      color: #FFFFFF;
    }

    .total {
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-left: 2rpx;
    }
  }
}

// 3. 房源核心主卡片
.main-info-card {
  margin: -24rpx 32rpx 20rpx;
  position: relative;
  z-index: 10;
  background-color: #FFFFFF;
  border-radius: 32rpx;
  padding: 36rpx 32rpx 32rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(235, 230, 223, 0.6);

  .price-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;

    .price-box {
      display: flex;
      align-items: baseline;

      .price-symbol {
        font-size: 32rpx;
        font-weight: 700;
        color: #E67E22;
        margin-right: 4rpx;
      }

      .price-number {
        font-size: 52rpx;
        font-weight: 800;
        color: #E67E22;
        line-height: 1;
      }

      .price-unit {
        font-size: 26rpx;
        color: #E67E22;
        margin-left: 4rpx;
        font-weight: 500;
      }
    }

    .collect-capsule-btn {
      display: flex;
      align-items: center;
      gap: 6rpx;
      background-color: #F6F4F0;
      border: 1px solid #ECE7DF;
      padding: 10rpx 22rpx;
      border-radius: 999rpx;
      cursor: pointer;
      transition: all 0.2s ease;

      .capsule-text {
        font-size: 24rpx;
        color: #55504A;
        font-weight: 500;
      }

      &.favorited {
        background-color: #F28A00;
        border-color: #F28A00;

        .capsule-text {
          color: #FFFFFF;
        }
      }
    }
  }

  .house-main-title {
    font-size: 38rpx;
    font-weight: 800;
    color: #1F1D1A;
    line-height: 1.35;
    margin-bottom: 28rpx;
  }

  .house-spec-grid {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #FAF8F5;
    border-radius: 20rpx;
    padding: 24rpx 10rpx;
    margin-bottom: 26rpx;

    .spec-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .spec-val-row {
        display: flex;
        align-items: center;
        gap: 6rpx;
        margin-bottom: 8rpx;

        .spec-val {
          font-size: 30rpx;
          font-weight: 700;
          color: #24201D;
        }
      }

      .spec-label {
        font-size: 22rpx;
        color: #8C857D;
      }
    }

    .spec-divider-line {
      width: 1px;
      height: 48rpx;
      background-color: #ECE5DC;
    }
  }

  .card-inner-divider {
    height: 1px;
    background-color: #F2EEE9;
    margin-bottom: 24rpx;
  }

  .location-link-row {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    cursor: pointer;

    .loc-pin-icon {
      margin-right: 8rpx;
    }

    .loc-text {
      flex: 1;
      font-size: 24rpx;
      color: #59534C;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .tags-capsule-row {
    display: flex;
    gap: 14rpx;

    .tag-wrapper {
      :deep(.uni-tag) {
        border-radius: 6rpx;
        padding: 6rpx 16rpx;
        font-size: 22rpx;
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
}

// 4. 房源亮点卡片
.highlights-card {
  position: relative;
  margin: 0 32rpx 20rpx;
  background: linear-gradient(135deg, #FFFFFF 0%, #FFFDF8 60%, #FFF8EE 100%);
  border-radius: 32rpx;
  padding: 30rpx 28rpx 36rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(235, 230, 223, 0.6);
  overflow: hidden;

  .section-title-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 24rpx;

    .section-title-text {
      font-size: 32rpx;
      font-weight: 700;
      color: #201E1C;
    }
  }

  .highlights-list {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 18rpx;
    max-width: 72%;

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 12rpx;

      .highlight-desc {
        font-size: 24rpx;
        color: #383430;
        line-height: 1.4;
      }
    }
  }

  .deco-sofa-bg {
    position: absolute;
    right: 8rpx;
    bottom: 0;
    width: 220rpx;
    height: 190rpx;
    opacity: 0.95;
    pointer-events: none;
    z-index: 1;
  }
}

// 5. 配套设施卡片
.facilities-card {
  margin: 0 32rpx 20rpx;
  background-color: #FFFFFF;
  border-radius: 32rpx;
  padding: 30rpx 28rpx 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(235, 230, 223, 0.6);

  .section-title-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 28rpx;

    .section-title-text {
      font-size: 32rpx;
      font-weight: 700;
      color: #201E1C;
    }
  }

  .facilities-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10rpx;
    margin-bottom: 24rpx;

    .facility-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;

      .facility-icon-circle {
        width: 82rpx;
        height: 82rpx;
        border-radius: 50%;
        background-color: #FAF6EE;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .facility-name {
        font-size: 22rpx;
        color: #383430;
      }
    }
  }

  .facility-sub-note {
    font-size: 22rpx;
    color: #8C867F;
    line-height: 1.4;
  }
}

// 6. 房源介绍卡片
.intro-card {
  margin: 0 32rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 32rpx;
  padding: 30rpx 28rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(235, 230, 223, 0.6);

  .section-title-row {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .section-title-text {
      font-size: 32rpx;
      font-weight: 700;
      color: #201E1C;
    }
  }

  .intro-content-text {
    font-size: 24rpx;
    color: #45403A;
    line-height: 1.7;
    letter-spacing: 0.3rpx;
  }
}

.bottom-safe-space {
  height: 180rpx;
}

// 7. 底部固定主操作栏
.bottom-fixed-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 246, 242, 0.95);
  backdrop-filter: blur(10px);
  padding: 16rpx 40rpx calc(16rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  z-index: 100;
  border-top: 1px solid rgba(235, 230, 223, 0.5);

  .primary-consult-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #E66F00 0%, #D86000 100%);
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 700;
    border-radius: 999rpx;
    border: none;
    box-shadow: 0 6rpx 20rpx rgba(220, 100, 0, 0.28);
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
      opacity: 0.9;
      transform: translateY(1rpx);
    }
  }
}
</style>
