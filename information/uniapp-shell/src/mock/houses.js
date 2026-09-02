/**
 * 租房系统首页模拟数据 (Mock Houses Data)
 * 严格按照 UI 参考图中的文案、价格、标签与参数配置
 */

export const mockFilterConfig = {
  districts: [
    { label: '全部区域', value: 'all' },
    { label: '南山区', value: '南山' },
    { label: '福田区', value: '福田' },
    { label: '龙华区', value: '龙华' },
    { label: '宝安区', value: '宝安' }
  ],
  layouts: [
    { label: '不限户型', value: 'all' },
    { label: '1室1厅', value: '1室1厅' },
    { label: '2室1厅', value: '2室1厅' },
    { label: '3室1厅', value: '3室1厅' }
  ],
  priceRanges: [
    { label: '不限租金', value: 'all', min: 0, max: 999999 },
    { label: '4000以下', value: '0-4000', min: 0, max: 4000 },
    { label: '4000-6000', value: '4000-6000', min: 4000, max: 6000 },
    { label: '6000-8000', value: '6000-8000', min: 6000, max: 8000 },
    { label: '8000以上', value: '8000-999999', min: 8000, max: 999999 }
  ],
  moreOptions: [
    { label: '全部', value: 'all' },
    { label: '近地铁', value: 'near_subway' },
    { label: '精装修', value: 'fine_decoration' },
    { label: '拎包入住', value: 'ready_to_move' }
  ]
}

export const mockHouses = [
  {
    id: 'house_001',
    district: '南山',
    block: '科技园',
    title: '南山 · 科技园',
    layout: '2室1厅',
    area: 88,
    orientation: '南向',
    address: '深南大道附近 · 距地铁1号线深大站约600米',
    subwayInfo: '距地铁1号线深大站约600米',
    tags: [
      { text: '近地铁', type: 'subway' },
      { text: '精装修', type: 'decoration' },
      { text: '拎包入住', type: 'ready' }
    ],
    price: 6800,
    priceFormatted: '6,800',
    unit: '月',
    isFavorite: false,
    coverImage: '/static/images/listing-nanshan-living-room.png',
    rentalType: 'entire',
    isNew: true
  },
  {
    id: 'house_002',
    district: '福田',
    block: '上梅林',
    title: '福田 · 上梅林',
    layout: '1室1厅',
    area: 45,
    orientation: '东向',
    address: '上梅林地铁站旁 · 距地铁9号线上梅林站150米',
    subwayInfo: '距地铁9号线上梅林站150米',
    tags: [
      { text: '近地铁', type: 'subway' },
      { text: '精装修', type: 'decoration' },
      { text: '拎包入住', type: 'ready' }
    ],
    price: 4300,
    priceFormatted: '4,300',
    unit: '月',
    isFavorite: false,
    coverImage: '/static/images/listing-futian-bedroom.png',
    rentalType: 'shared',
    isNew: false
  },
  {
    id: 'house_003',
    district: '龙华',
    block: '民治',
    title: '龙华 · 民治',
    layout: '3室1厅',
    area: 120,
    orientation: '南北通透',
    address: '民治地铁站约400米 · 近Costco商圈',
    subwayInfo: '民治地铁站约400米',
    tags: [
      { text: '近地铁', type: 'subway' },
      { text: '精装修', type: 'decoration' },
      { text: '拎包入住', type: 'ready' }
    ],
    price: 7500,
    priceFormatted: '7,500',
    unit: '月',
    isFavorite: false,
    coverImage: '/static/images/listing-longhua-living-dining.png',
    rentalType: 'entire',
    isNew: true
  },
  {
    id: 'house_004',
    district: '宝安',
    block: '西乡',
    title: '宝安 · 西乡',
    layout: '2室1厅',
    area: 70,
    orientation: '西南向',
    address: '西乡地铁站约300米 · 近天虹商场',
    subwayInfo: '西乡地铁站约300米',
    tags: [
      { text: '近地铁', type: 'subway' },
      { text: '精装修', type: 'decoration' },
      { text: '拎包入住', type: 'ready' }
    ],
    price: 5200,
    priceFormatted: '5,200',
    unit: '月',
    isFavorite: false,
    coverImage: '/static/images/listing-baoan-living-room.png',
    rentalType: 'shared',
    isNew: false
  }
]
