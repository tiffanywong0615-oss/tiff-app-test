'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trip, Activity, DayItinerary, ShoppingItem } from '@/types';
import { getSeedData } from '@/lib/seedData';

interface TripContextType {
  trips: Trip[];
  selectedTripId: string | null;
  selectedTrip: Trip | null;
  createTrip: (trip: Omit<Trip, 'id' | 'dailyItinerary' | 'budget' | 'checklist' | 'status' | 'shoppingList'>) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  selectTrip: (id: string | null) => void;
  addActivity: (tripId: string, dayIndex: number, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (tripId: string, dayIndex: number, activityId: string, updates: Partial<Activity>) => void;
  deleteActivity: (tripId: string, dayIndex: number, activityId: string) => void;
  reorderActivities: (tripId: string, dayIndex: number, activities: Activity[]) => void;
  toggleChecklistItem: (tripId: string, itemId: string) => void;
  addChecklistItem: (tripId: string, item: string) => void;
  addShoppingItem: (tripId: string, item: Omit<ShoppingItem, 'id'>) => void;
  toggleShoppingItem: (tripId: string, itemId: string) => void;
  deleteShoppingItem: (tripId: string, itemId: string) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('japan-travel-app');
      if (stored) {
        const parsed = JSON.parse(stored);
        const tripsWithDefaults = (parsed.trips || []).map((t: Trip) => ({
          ...t,
          shoppingList: t.shoppingList ?? [],
        }));
        setTrips(tripsWithDefaults);
      } else {
        const seed = getSeedData();
        setTrips(seed);
        localStorage.setItem('japan-travel-app', JSON.stringify({ trips: seed }));
      }
    } catch {
      const seed = getSeedData();
      setTrips(seed);
    }
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      localStorage.setItem('japan-travel-app', JSON.stringify({ trips }));
    }
  }, [trips]);

  const selectedTrip = trips.find(t => t.id === selectedTripId) || null;

  const createTrip = useCallback((tripData: Omit<Trip, 'id' | 'dailyItinerary' | 'budget' | 'checklist' | 'status' | 'shoppingList'>) => {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const dailyItinerary: DayItinerary[] = Array.from({ length: days }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        day: i + 1,
        date: date.toISOString().split('T')[0],
        weather: { condition: 'sunny', high: 25, low: 18 },
        activities: [],
      };
    });

    const newTrip: Trip = {
      id: uuidv4(),
      ...tripData,
      status: 'planning',
      dailyItinerary,
      budget: {
        total: 100000,
        categoryBudgets: { Food: 20000, Transport: 15000, Hotel: 30000, Sightseeing: 10000, Shopping: 15000, Other: 10000 },
      },
      checklist: [
        { id: uuidv4(), item: '護照、簽證', completed: false },
        { id: uuidv4(), item: '機票確認', completed: false },
        { id: uuidv4(), item: '飯店預訂確認', completed: false },
      ],
      shoppingList: [],
    };
    setTrips(prev => [...prev, newTrip]);
  }, []);

  const updateTrip = useCallback((id: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setSelectedTripId(prev => prev === id ? null : prev);
  }, []);

  const selectTrip = useCallback((id: string | null) => {
    setSelectedTripId(id);
  }, []);

  const addActivity = useCallback((tripId: string, dayIndex: number, activity: Omit<Activity, 'id'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newItinerary = [...t.dailyItinerary];
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        activities: [...newItinerary[dayIndex].activities, { ...activity, id: uuidv4() }],
      };
      return { ...t, dailyItinerary: newItinerary };
    }));
  }, []);

  const updateActivity = useCallback((tripId: string, dayIndex: number, activityId: string, updates: Partial<Activity>) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newItinerary = [...t.dailyItinerary];
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        activities: newItinerary[dayIndex].activities.map(a => a.id === activityId ? { ...a, ...updates } : a),
      };
      return { ...t, dailyItinerary: newItinerary };
    }));
  }, []);

  const deleteActivity = useCallback((tripId: string, dayIndex: number, activityId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newItinerary = [...t.dailyItinerary];
      newItinerary[dayIndex] = {
        ...newItinerary[dayIndex],
        activities: newItinerary[dayIndex].activities.filter(a => a.id !== activityId),
      };
      return { ...t, dailyItinerary: newItinerary };
    }));
  }, []);

  const reorderActivities = useCallback((tripId: string, dayIndex: number, activities: Activity[]) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      const newItinerary = [...t.dailyItinerary];
      newItinerary[dayIndex] = { ...newItinerary[dayIndex], activities };
      return { ...t, dailyItinerary: newItinerary };
    }));
  }, []);

  const toggleChecklistItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        checklist: t.checklist.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item),
      };
    }));
  }, []);

  const addChecklistItem = useCallback((tripId: string, item: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        checklist: [...t.checklist, { id: uuidv4(), item, completed: false }],
      };
    }));
  }, []);

  const addShoppingItem = useCallback((tripId: string, item: Omit<ShoppingItem, 'id'>) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        shoppingList: [...(t.shoppingList ?? []), { ...item, id: uuidv4() }],
      };
    }));
  }, []);

  const toggleShoppingItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        shoppingList: (t.shoppingList ?? []).map(item =>
          item.id === itemId ? { ...item, bought: !item.bought } : item
        ),
      };
    }));
  }, []);

  const deleteShoppingItem = useCallback((tripId: string, itemId: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        shoppingList: (t.shoppingList ?? []).filter(item => item.id !== itemId),
      };
    }));
  }, []);

  return (
    <TripContext.Provider value={{
      trips, selectedTripId, selectedTrip, createTrip, updateTrip, deleteTrip, selectTrip,
      addActivity, updateActivity, deleteActivity, reorderActivities, toggleChecklistItem, addChecklistItem,
      addShoppingItem, toggleShoppingItem, deleteShoppingItem,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
}
