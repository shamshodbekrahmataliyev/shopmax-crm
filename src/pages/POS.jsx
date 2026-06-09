import { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, X, Check } from 'lucide-react';

const CATEGORIES = ['Barchasi', 'Oziq-ovqat', 'Ichimliklar', 'Gazaklar', 'Sut mahsulotlari', 'Non mahsulotlari'];

export default function POS() {
  const { products, cart, customers, addToCart, removeFromCart, updateCartQty, clearCart, cartTotal, checkout } = useShop();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Barchasi');
  const [payMethod, setPayMethod] = useState('naqd');
  const [discount, setDiscount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showReceipt, setShowReceipt] = useState(null);

  const filteredProducts = products.filter(p=>{
    const q=search.toLowerCase();
    const catMatch=category==='Barchasi'||p.category===category;
    const searchMatch=p.name.toLowerCase().includes(q)||p.barcode.includes(q);
    return catMatch&&searchMatch&&p.stock>0;
  });

  const finalTotal = Math.max(0, cartTotal - Number(discount));

  const handleCheckout = () => {
    if(cart.length===0) return;
    const sale = checkout(payMethod, selectedCustomer?Number(selectedCustomer):null, Number(discount));
    setShowReceipt(sale);
    setDiscount(0);
    setSelectedCustomer('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Products */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Mahsulot nomi yoki barkod..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${category===c?'bg-emerald-600 text-white':'bg-white text-gray-600 hover:bg-emerald-50'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto">
          {filteredProducts.map(p=>(
            <button key={p.id} onClick={()=>addToCart(p)}
              className="bg-white rounded-2xl p-4 text-left hover:shadow-md hover:border-emerald-300 border-2 border-transparent transition group">
              <div className="text-3xl mb-2">{p.image}</div>
              <p className="text-sm font-bold text-gray-800 leading-tight truncate">{p.name}</p>
              <p className="text-emerald-600 font-black mt-1">{p.price.toLocaleString()} so'm</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">Qoldi: {p.stock}</span>
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 transition">
                  <Plus size={14} className="text-emerald-600 group-hover:text-white"/>
                </div>
              </div>
            </button>
          ))}
          {filteredProducts.length===0&&<div className="col-span-3 text-center py-12 text-gray-400">Mahsulot topilmadi</div>}
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 bg-white shadow-xl flex flex-col">
        <div className="p-4 border-b bg-emerald-700 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-black flex items-center gap-2"><ShoppingCart size={20}/>Savat</h3>
            {cart.length>0&&<button onClick={clearCart} className="text-emerald-200 hover:text-white text-xs">Tozalash</button>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length===0?
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-2 opacity-30"/>
              <p className="text-sm">Savat bo'sh</p>
            </div>:
            cart.map(item=>(
              <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.image}</span>
                    <p className="text-sm font-semibold text-gray-800 leading-tight max-w-[150px]">{item.name}</p>
                  </div>
                  <button onClick={()=>removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={()=>updateCartQty(item.id,item.qty-1)} className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-red-100"><Minus size={12}/></button>
                    <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                    <button onClick={()=>updateCartQty(item.id,item.qty+1)} className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-green-100"><Plus size={12}/></button>
                  </div>
                  <span className="font-black text-emerald-700">{(item.price*item.qty).toLocaleString()}</span>
                </div>
              </div>
            ))
          }
        </div>

        <div className="p-4 border-t space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Mijoz (ixtiyoriy)</label>
            <select value={selectedCustomer} onChange={e=>setSelectedCustomer(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">Anonim mijoz</option>
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Chegirma (so'm)</label>
            <input type="number" value={discount} onChange={e=>setDiscount(e.target.value)} min="0"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Jami:</span>
            <span className="font-semibold">{cartTotal.toLocaleString()} so'm</span>
          </div>
          {discount>0&&<div className="flex justify-between text-sm">
            <span className="text-gray-500">Chegirma:</span>
            <span className="text-red-500">-{Number(discount).toLocaleString()} so'm</span>
          </div>}
          <div className="flex justify-between font-black text-lg text-emerald-700">
            <span>To'lash:</span>
            <span>{finalTotal.toLocaleString()} so'm</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['naqd','Naqd',Banknote],['karta','Karta',CreditCard],['transfer',"Click/Payme",Smartphone]].map(([v,l,Icon])=>(
              <button key={v} onClick={()=>setPayMethod(v)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-semibold transition ${payMethod===v?'bg-emerald-600 text-white':'bg-gray-100 text-gray-600 hover:bg-emerald-50'}`}>
                <Icon size={16}/>{l}
              </button>
            ))}
          </div>
          <button onClick={handleCheckout} disabled={cart.length===0}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-base hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2">
            <Check size={20}/>To'lovni yakunlash
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt&&(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-80 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={32} className="text-emerald-600"/>
              </div>
              <h3 className="text-xl font-black text-gray-800">To'lov qabul qilindi!</h3>
              <p className="text-gray-500 text-sm">#{showReceipt.id}</p>
            </div>
            <div className="border-t border-dashed border-gray-300 py-3 space-y-2">
              {showReceipt.items.map(i=>(
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{i.name} x{i.qty}</span>
                  <span className="font-semibold">{(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1">
              <div className="flex justify-between font-black text-lg">
                <span>Jami:</span>
                <span className="text-emerald-600">{showReceipt.finalTotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>To'lov usuli:</span><span>{showReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Sana:</span><span>{new Date(showReceipt.date).toLocaleString('uz-UZ')}</span>
              </div>
            </div>
            <button onClick={()=>setShowReceipt(null)} className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">
              Yangi sotuv
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
