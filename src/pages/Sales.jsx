import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Receipt, Search } from 'lucide-react';

export default function Sales() {
  const { sales } = useShop();
  const [search, setSearch] = useState('');

  const filtered = sales.filter(s =>
    s.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
    s.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800">Sotuvlar tarixi</h2>
        <p className="text-gray-500 text-sm">{sales.length} ta sotuv</p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Mahsulot nomi yoki to'lov usuli..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="w-full">
          <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Mahsulotlar</th>
            <th className="px-6 py-3">Jami</th>
            <th className="px-6 py-3">Chegirma</th>
            <th className="px-6 py-3">Foyda</th>
            <th className="px-6 py-3">To'lov</th>
            <th className="px-6 py-3">Sana</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-400 text-sm">#{filtered.length - i}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {s.items.map(item => (
                      <span key={item.id} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                        {item.image} {item.name} x{item.qty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-600">{s.finalTotal.toLocaleString()} so'm</td>
                <td className="px-6 py-4 text-red-500 text-sm">{s.discount > 0 ? '-' + Number(s.discount).toLocaleString() : '—'}</td>
                <td className="px-6 py-4 text-green-600 font-semibold text-sm">{s.profit.toLocaleString()} so'm</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{s.paymentMethod}</span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{new Date(s.date).toLocaleString('uz-UZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">Sotuv tarixi yo'q</div>}
      </div>
    </div>
  );
}
