import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Oziq-ovqat','Ichimliklar','Gazaklar','Sut mahsulotlari','Non mahsulotlari','Uy-ro\'zg\'or','Boshqa'];
const EMOJIS = ['🛒','🥤','🍟','🌾','🥛','🍞','🥚','🧴','🍎','🥕','🧃','🍫'];

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const empty = { barcode:'', name:'', category:'Oziq-ovqat', price:0, cost:0, stock:0, minStock:5, unit:'dona', image:'🛒' };
  const [form, setForm] = useState(empty);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const genBarcode = () => '8' + Math.floor(1000000 + Math.random() * 9000000).toString();
  const openAdd = () => { setEditItem(null); setForm({...empty, barcode: genBarcode()}); setShowModal(true); };
  const openEdit = (p) => { setEditItem(p); setForm({...p}); setShowModal(true); };
  const handleSave = () => {
    if (!form.name) return;
    const data = {...form, price: Number(form.price), cost: Number(form.cost), stock: Number(form.stock), minStock: Number(form.minStock)};
    if (editItem) updateProduct(editItem.id, data);
    else addProduct(data);
    setShowModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Mahsulotlar</h2>
          <p className="text-gray-500 text-sm">{products.length} ta mahsulot</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition">
          <Plus size={18}/> Yangi mahsulot
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, barkod, kategoriya..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="text-xs font-semibold text-gray-500 uppercase bg-gray-50 text-left">
              <th className="px-6 py-3">Mahsulot</th>
              <th className="px-6 py-3">Kategoriya</th>
              <th className="px-6 py-3">Narx</th>
              <th className="px-6 py-3">Tannarx</th>
              <th className="px-6 py-3">Qoldiq</th>
              <th className="px-6 py-3">Holat</th>
              <th className="px-6 py-3">Amal</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p=>(
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.image}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <code className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{p.barcode}</code>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{p.category}</span></td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{Number(p.price).toLocaleString()} so'm</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{Number(p.cost).toLocaleString()} so'm</td>
                  <td className="px-6 py-4 font-semibold">{p.stock} {p.unit}</td>
                  <td className="px-6 py-4">
                    {p.stock <= p.minStock
                      ? <span className="flex items-center gap-1 text-red-600 text-xs font-semibold"><AlertTriangle size={12}/>Kam</span>
                      : <span className="text-green-600 text-xs font-semibold">✓ Yetarli</span>}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={()=>openEdit(p)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600"><Edit2 size={16}/></button>
                    <button onClick={()=>deleteProduct(p.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div className="text-center py-12 text-gray-400">Mahsulot topilmadi</div>}
        </div>
      </div>

      {showModal&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-lg font-bold">{editItem?'Tahrirlash':'Yangi mahsulot'}</h3>
              <button onClick={()=>setShowModal(false)}><X size={20} className="text-gray-500"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e=>(
                    <button key={e} onClick={()=>setForm({...form,image:e})}
                      className={`text-2xl p-2 rounded-xl transition ${form.image===e?'bg-emerald-100 ring-2 ring-emerald-500':'hover:bg-gray-100'}`}>{e}</button>
                  ))}
                </div>
              </div>
              {[['name','Nomi'],['barcode','Barkod']].map(([k,l])=>(
                <div key={k}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                  <input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">O'lchov</label>
                  <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {['dona','kg','litr','quti','paket'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['price',"Sotuv narxi (so'm)"],['cost',"Tannarx (so'm)"],['stock','Qoldiq'],['minStock','Min qoldiq']].map(([k,l])=>(
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                    <input type="number" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
                  </div>
                ))}
              </div>
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
