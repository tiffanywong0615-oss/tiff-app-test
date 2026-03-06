'use client';

import { useState, useRef } from 'react';
import { useTripContext } from '@/context/TripContext';
import { useLanguage } from '@/context/LanguageContext';
import TopHeader from '@/components/TopHeader';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Circle, X, Image as ImageIcon } from 'lucide-react';

export default function ShoppingPage() {
  const { trips, addShoppingItem, toggleShoppingItem, deleteShoppingItem } = useTripContext();
  const { t } = useLanguage();
  const trip = trips[0];

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [photo, setPhoto] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name.trim() || !trip) return;
    addShoppingItem(trip.id, {
      name: name.trim(),
      price: Number(price) || 0,
      quantity: Number(quantity) || 1,
      photo,
      bought: false,
    });
    setName('');
    setPrice('');
    setQuantity('1');
    setPhoto('');
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setName('');
    setPrice('');
    setQuantity('1');
    setPhoto('');
    setShowModal(false);
  };

  const shoppingList = trip?.shoppingList ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">
      <TopHeader title={t.shoppingList} />

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#FF6FAE]" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">{t.shoppingList}</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-[#FF6FAE] text-white text-sm font-semibold px-4 py-2 rounded-full shadow hover:bg-pink-500 transition-colors"
          >
            <Plus size={16} />
            {t.addShoppingItem}
          </button>
        </div>

        {/* Empty state */}
        {shoppingList.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t.noShoppingItems}</p>
          </div>
        )}

        {/* Shopping list grid */}
        {shoppingList.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {shoppingList.map(item => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden border border-pink-100 shadow-sm flex flex-col transition-opacity ${item.bought ? 'opacity-50' : ''}`}
              >
                {/* Photo */}
                <div className="w-full aspect-square bg-pink-50 flex items-center justify-center overflow-hidden">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-pink-200" />
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col gap-1">
                  <p className={`font-bold text-sm text-gray-800 leading-tight ${item.bought ? 'line-through' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">¥{item.price.toLocaleString()} × {item.quantity}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between px-3 pb-3">
                  <button
                    onClick={() => trip && deleteShoppingItem(trip.id, item.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="刪除"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => trip && toggleShoppingItem(trip.id, item.id)}
                    className={`transition-colors ${item.bought ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
                    aria-label={item.bought ? '取消勾選' : '標記已購買'}
                  >
                    {item.bought ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-1 bg-[#FF6FAE] text-white text-sm font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-pink-500 transition-colors"
        aria-label={t.addShoppingItem}
      >
        <Plus size={16} />
        {t.addShoppingItem}
      </button>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800">{t.addShoppingItem}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.itemPhoto}</label>
              <div
                className="w-full h-32 rounded-xl border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {photo ? (
                  <img src={photo} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-pink-300 mb-1" />
                    <span className="text-xs text-pink-400">{t.itemPhoto}</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Item name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.itemName}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.itemName}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {/* Price + Quantity row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.itemPrice}</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  min="0"
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.itemQuantity}</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  min="1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="w-full bg-[#FF6FAE] text-white font-semibold py-3 rounded-xl hover:bg-pink-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.addItem}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
