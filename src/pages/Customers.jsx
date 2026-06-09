import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Plus, Search, X, Star, Phone } from 'lucide-react';

export default function Customers() {
  const { customers, addCustomer } = useShop();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const handleSave = () => {
    if (!form.name) return;
    addCustomer(form);
    setForm({ name:'', phone:'' });
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Mijozlar</h2>
          <p className="text-gray-500 text-sm">{customers.length} ta doimiy mijoz</p>
        </div>
        <button onClick={()=>setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700">
          <Plus size={18}/> Yangi mijoz
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ism yoki telefon..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map(c => {
          const level = c.loyaltyPoints >= 500 ? 'Oltin' : c.loyaltyPoints >= 200 ? 'Kumush' : 'Bronza';
          const levelColor = level==='Oltin'?'text-yellow-600 bg-yellow-50':level==='Kumush'?'text-gray-500 bg-gray-100':'text-orange-600 bg-orange-50';
          return (
            <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-black text-xl">
                  {c.name[0]}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${levelColor}`}>{level}</span>
              </div>
              <h3 className="font-bold text-gray-800">{c.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12}/>{c.phone}</p>
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1"><Star size={12} className="text-yellow-500"/>Ball:</span>
                  <span className="font-bold text-emerald-600">{c.loyaltyPoints} ball</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Jami xarid:</span>
                  <span className="font-semibold">{c.totalPurchase.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>A'zo bo'lgan:</span>
                  <span>{c.memberSince}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-bold">Yangi mijoz</h3>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-4">
              {[['name','Ism Familiya'],['phone','Telefon']].map(([k,l])=>(
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700">Saqlash</button>
              <button onClick={()=>setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-bold">Bekor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
