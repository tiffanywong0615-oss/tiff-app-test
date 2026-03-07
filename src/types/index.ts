export interface WeatherInfo {
  condition: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy';
  high: number;
  low: number;
}

export interface Activity {
  id: string;
  time: string;
  type: 'Food' | 'Sightseeing' | 'Transport' | 'Hotel' | 'Shopping' | 'Other';
  location: string;
  title?: string;
  notes: string;
  cost: number;
  costCurrency?: 'JPY' | 'HKD';
  mapQuery: string;
  drivingToNext?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  weather: WeatherInfo;
  activities: Activity[];
  mainLocation?: string;
}

export interface Budget {
  total: number;
  categoryBudgets: {
    Food: number;
    Transport: number;
    Hotel: number;
    Sightseeing: number;
    Shopping: number;
    Other: number;
  };
}

export interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  photo: string;
  bought: boolean;
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed';
  coverImage: string;
  dailyItinerary: DayItinerary[];
  budget: Budget;
  checklist: ChecklistItem[];
  shoppingList: ShoppingItem[];
}

export interface AppData {
  trips: Trip[];
}
