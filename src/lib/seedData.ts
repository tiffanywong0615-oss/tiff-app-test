import { v4 as uuidv4 } from 'uuid';
import { Trip } from '@/types';

export function getSeedData(): Trip[] {
  return [
    {
      id: uuidv4(),
      title: '九州六日自駕美食之旅',
      startDate: '2026-05-07',
      endDate: '2026-05-12',
      status: 'planning',
      coverImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
      budget: {
        total: 300000,
        categoryBudgets: {
          Food: 80000,
          Transport: 40000,
          Hotel: 80000,
          Sightseeing: 20000,
          Shopping: 40000,
          Other: 40000,
        },
      },
      checklist: [
        { id: uuidv4(), item: '護照、簽證', completed: false },
        { id: uuidv4(), item: '信用卡、現金', completed: false },
        { id: uuidv4(), item: '手機/充電器', completed: false },
        { id: uuidv4(), item: '行李打包', completed: false },
        { id: uuidv4(), item: '飯店預訂確認', completed: false },
        { id: uuidv4(), item: '機票確認', completed: false },
        { id: uuidv4(), item: '常用藥品', completed: false },
        { id: uuidv4(), item: '相機/記憶卡', completed: false },
        { id: uuidv4(), item: '雨具', completed: false },
        { id: uuidv4(), item: '轉接頭', completed: false },
      ],
      dailyItinerary: [
        {
          day: 1,
          date: '2026-05-07',
          weather: { condition: 'sunny', high: 26, low: 18 },
          activities: [
            { id: uuidv4(), time: '08:15', type: 'Transport', location: 'CX512 HKG→FUK 航班', notes: '由香港出發飛福岡', cost: 0, mapQuery: 'Fukuoka Airport' },
            { id: uuidv4(), time: '14:00', type: 'Transport', location: '租車公司取車（大7人車）', notes: '福岡機場租車', cost: 18000, mapQuery: 'Fukuoka Airport Car Rental' },
            { id: uuidv4(), time: '15:00', type: 'Food', location: '和牛明太神樂（和牛明太子蓋飯）', notes: '太宰府必吃和牛明太子蓋飯', cost: 2500, mapQuery: '和牛明太神樂 太宰府' },
            { id: uuidv4(), time: '16:30', type: 'Sightseeing', location: '太宰府天滿宮參拜、星巴克咖啡', notes: '日本最著名的學問之神神社', cost: 0, mapQuery: '太宰府天滿宮' },
            { id: uuidv4(), time: '19:30', type: 'Food', location: '馬櫻 馬肉料理（馬肉刺身/燒肉）', notes: '熊本名物馬肉料理', cost: 5000, mapQuery: '馬櫻 熊本' },
            { id: uuidv4(), time: '21:00', type: 'Shopping', location: '下通購物街', notes: '熊本市中心購物商圈', cost: 0, mapQuery: '下通 熊本' },
            { id: uuidv4(), time: '22:30', type: 'Hotel', location: '熊本花開酒店', notes: '熊本市中心住宿', cost: 13200, mapQuery: '熊本花開酒店' },
          ],
        },
        {
          day: 2,
          date: '2026-05-08',
          weather: { condition: 'partly-cloudy', high: 24, low: 16 },
          activities: [
            { id: uuidv4(), time: '08:30', type: 'Food', location: 'Licht Coffee & Cakes（精品手沖）', notes: '熊本精品咖啡', cost: 800, mapQuery: 'Licht Coffee Cakes 熊本' },
            { id: uuidv4(), time: '10:30', type: 'Sightseeing', location: '阿蘇大觀峰 展望台', notes: '阿蘇山最佳展望台', cost: 0, mapQuery: '阿蘇大觀峰' },
            { id: uuidv4(), time: '12:00', type: 'Food', location: '阿蘇庭 山見茶屋（赤牛丼）', notes: '阿蘇名物赤牛丼', cost: 2000, mapQuery: '阿蘇庭 山見茶屋' },
            { id: uuidv4(), time: '13:30', type: 'Sightseeing', location: '草千里之濱、阿蘇火山口景觀', notes: '阿蘇火山壯觀景色', cost: 0, mapQuery: '草千里ヶ浜' },
            { id: uuidv4(), time: '19:30', type: 'Food', location: '食道樂 とさか（炭火燒地雞）', notes: '別府名物地雞料理', cost: 3500, mapQuery: '食道楽 とさか 別府' },
            { id: uuidv4(), time: '22:00', type: 'Hotel', location: '別府 AMANEK', notes: '別府溫泉酒店', cost: 16500, mapQuery: 'AMANEK 別府' },
          ],
        },
        {
          day: 3,
          date: '2026-05-09',
          weather: { condition: 'sunny', high: 25, low: 17 },
          activities: [
            { id: uuidv4(), time: '09:00', type: 'Food', location: 'In Bloom Coffee', notes: '別府精品咖啡', cost: 800, mapQuery: 'In Bloom Coffee 別府' },
            { id: uuidv4(), time: '10:30', type: 'Sightseeing', location: '由布院散策、金鱗湖、湯之坪街道', notes: '由布院最著名景點', cost: 0, mapQuery: '金鱗湖 由布院' },
            { id: uuidv4(), time: '12:00', type: 'Food', location: '鰻之成瀨（極上鰻魚重）', notes: '由布院名物鰻魚料理', cost: 2500, mapQuery: '鰻の成瀬 由布院' },
            { id: uuidv4(), time: '15:30', type: 'Sightseeing', location: '別府地獄巡禮（海、血池地獄）', notes: '別府著名溫泉地獄', cost: 0, mapQuery: '別府地獄めぐり' },
            { id: uuidv4(), time: '19:30', type: 'Food', location: '三湯拉麵（豚骨拉麵/煎餃）', notes: '別府豚骨拉麵', cost: 1000, mapQuery: '三湯ラーメン 別府' },
            { id: uuidv4(), time: '22:00', type: 'Hotel', location: '別府 AMANEK', notes: '別府溫泉酒店', cost: 16500, mapQuery: 'AMANEK 別府' },
          ],
        },
        {
          day: 4,
          date: '2026-05-10',
          weather: { condition: 'cloudy', high: 22, low: 15 },
          activities: [
            { id: uuidv4(), time: '08:30', type: 'Food', location: 'Kamenos（老屋改裝咖啡）', notes: '特色咖啡店', cost: 1000, mapQuery: 'Kamenos Coffee 九州' },
            { id: uuidv4(), time: '10:00', type: 'Sightseeing', location: '九州自然動物園（自駕入場）', notes: '可以開車進入的動物園', cost: 0, mapQuery: '九州自然動物公園 アフリカンサファリ' },
            { id: uuidv4(), time: '13:00', type: 'Food', location: '山椒咖哩烏龍麵 菊すけ', notes: '特色咖哩烏龍麵', cost: 1500, mapQuery: '菊すけ 鳥栖' },
            { id: uuidv4(), time: '15:30', type: 'Shopping', location: '鳥栖 Premium Outlets', notes: '日本知名Outlets購物', cost: 0, mapQuery: '鳥栖プレミアムアウトレット' },
            { id: uuidv4(), time: '20:30', type: 'Food', location: '稚加榮 料亭（活魚刺身/明太子）', notes: '博多名物海鮮料理', cost: 6000, mapQuery: '稚加榮 福岡' },
            { id: uuidv4(), time: '22:00', type: 'Hotel', location: '西鐵格蘭登飯店', notes: '博多市中心酒店', cost: 15000, mapQuery: '西鉄グランドホテル 福岡' },
          ],
        },
        {
          day: 5,
          date: '2026-05-11',
          weather: { condition: 'sunny', high: 27, low: 19 },
          activities: [
            { id: uuidv4(), time: '09:00', type: 'Food', location: 'REC COFFEE（岩田屋店）', notes: '福岡知名精品咖啡', cost: 800, mapQuery: 'REC COFFEE 岩田屋 福岡' },
            { id: uuidv4(), time: '11:00', type: 'Food', location: '鮨 紫 壽司（師傅發辦早午餐）', notes: '福岡高級壽司', cost: 5000, mapQuery: '鮨 紫 福岡' },
            { id: uuidv4(), time: '14:00', type: 'Sightseeing', location: '能古島賞花（自駕上渡輪、泊車）', notes: '能古島春季花卉景觀', cost: 0, mapQuery: '能古島 福岡' },
            { id: uuidv4(), time: '20:30', type: 'Food', location: '天神屋台（博多在地美食）', notes: '博多著名屋台街', cost: 2500, mapQuery: '天神 屋台 福岡' },
            { id: uuidv4(), time: '22:00', type: 'Hotel', location: '西鐵格蘭登飯店', notes: '博多市中心酒店', cost: 15000, mapQuery: '西鉄グランドホテル 福岡' },
          ],
        },
        {
          day: 6,
          date: '2026-05-12',
          weather: { condition: 'sunny', high: 26, low: 18 },
          activities: [
            { id: uuidv4(), time: '09:00', type: 'Food', location: '柳橋連合市場 - 海鮮丼 / 明太子飯糰', notes: '博多廚房海鮮早餐', cost: 2000, mapQuery: '柳橋連合市場 福岡' },
            { id: uuidv4(), time: '11:30', type: 'Food', location: '珈琲美美（大濠公園旁）', notes: '大濠公園旁特色咖啡', cost: 800, mapQuery: '珈琲美美 福岡' },
            { id: uuidv4(), time: '16:15', type: 'Transport', location: 'CX529 FUK→HKG 航班', notes: '由福岡飛返香港', cost: 0, mapQuery: 'Fukuoka Airport' },
          ],
        },
      ],
    },
  ];
}
