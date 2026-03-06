export type Language = 'zh' | 'en';

export interface Translations {
  itinerary: string;
  budget: string;
  packingList: string;
  day: string;
  daySuffix: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  departureCountdown: string;
  departed: string;
  high: string;
  low: string;
  daysTrip: string;
  dailyCost: string;
  viewMap: string;
  noActivities: string;
  tripNotFound: string;
  backToHome: string;
  totalBudget: string;
  spent: string;
  remaining: string;
  spendingDistribution: string;
  categoryBudget: string;
  packingListTitle: string;
  completedOf: string;
  addItemPlaceholder: string;
  currencyConverter: string;
  quickConvert: string;
  weather: {
    sunny: string;
    cloudy: string;
    'partly-cloudy': string;
    rainy: string;
    snowy: string;
  };
  activityTypes: {
    Food: string;
    Sightseeing: string;
    Transport: string;
    Hotel: string;
    Shopping: string;
    Other: string;
  };
  weekdays: string[];
  loading: string;
  translating: string;
  editCost: string;
  saveCost: string;
  cancelEdit: string;
  nearestParking: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    itinerary: '行程',
    budget: '預算',
    packingList: '行李清單',
    day: '第',
    daySuffix: '天',
    days: '天',
    hours: '時',
    minutes: '分',
    seconds: '秒',
    departureCountdown: '出發倒數',
    departed: '✈️ 出發啦！',
    high: '高 ',
    low: '低 ',
    daysTrip: '天行程',
    dailyCost: '今日花費',
    viewMap: '查看地圖',
    noActivities: '今天還沒有安排活動',
    tripNotFound: '找不到旅程',
    backToHome: '返回首頁',
    totalBudget: '總預算',
    spent: '已花費',
    remaining: '剩餘預算',
    spendingDistribution: '花費分佈',
    categoryBudget: '各類別預算',
    packingListTitle: '出發前確認清單',
    completedOf: '項已完成',
    addItemPlaceholder: '新增項目...',
    currencyConverter: '匯率換算',
    quickConvert: '快速換算',
    weather: {
      sunny: '晴天',
      cloudy: '陰天',
      'partly-cloudy': '多雲',
      rainy: '雨天',
      snowy: '雪天',
    },
    activityTypes: {
      Food: '餐飲',
      Sightseeing: '觀光',
      Transport: '交通',
      Hotel: '住宿',
      Shopping: '購物',
      Other: '其他',
    },
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    loading: '載入中...',
    translating: '翻譯中...',
    editCost: '編輯費用',
    saveCost: '確認',
    cancelEdit: '取消',
    nearestParking: '附近停車場',
  },
  en: {
    itinerary: 'Itinerary',
    budget: 'Budget',
    packingList: 'Packing List',
    day: 'Day ',
    daySuffix: '',
    days: 'days',
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
    departureCountdown: 'Departure Countdown',
    departed: '✈️ Departed!',
    high: 'H ',
    low: 'L ',
    daysTrip: '-day trip',
    dailyCost: "Today's Cost",
    viewMap: 'View Map',
    noActivities: 'No activities scheduled for today',
    tripNotFound: 'Trip not found',
    backToHome: 'Back to Home',
    totalBudget: 'Total Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    spendingDistribution: 'Spending Distribution',
    categoryBudget: 'Category Budget',
    packingListTitle: 'Pre-Departure Checklist',
    completedOf: 'completed',
    addItemPlaceholder: 'Add item...',
    currencyConverter: 'Currency Converter',
    quickConvert: 'Quick Convert',
    weather: {
      sunny: 'Sunny',
      cloudy: 'Cloudy',
      'partly-cloudy': 'Partly Cloudy',
      rainy: 'Rainy',
      snowy: 'Snowy',
    },
    activityTypes: {
      Food: 'Food',
      Sightseeing: 'Sightseeing',
      Transport: 'Transport',
      Hotel: 'Hotel',
      Shopping: 'Shopping',
      Other: 'Other',
    },
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    loading: 'Loading...',
    translating: 'Translating...',
    editCost: 'Edit Cost',
    saveCost: 'Save',
    cancelEdit: 'Cancel',
    nearestParking: 'Nearest Parking',
  },
};
