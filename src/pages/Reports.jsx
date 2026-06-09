import { useShop } from '../context/ShopContext';
import { TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';

export default function Reports() {
  const { products, sales, customers, totalRevenue } = useShop();

  const totalProfit = sales.reduce((s,t)=>s+t.profit,0);
  const totalSales = sales.length;

  const productSales = products.map(p => {
    const qty = sales.reduce((s,t)=>s+(t.items.find(i=>i.id===p.id)?.qty||0),0);
    const rev = sales.reduce((s,t)=>s+((t.items.find(i=>i.id===p.id)?.qty||0)*p.price),0);
    return { ...p, soldQty: qty, revenue: rev };
  }).sort((a,b)=>b.soldQty-a.soldQty);

  const maxQty = Math.max(...productSales.map(p=>p.soldQty),1);

  const dailyRevenue = {};
  sales.forEach(s=>{
    const d=s.date?.slice(0,10)||'';
    dailyRevenue[d]=(dailyRevenue[d]||0)+s.finalTotal;
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-800">Hisobotlar</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Jami daromad', value:(totalRevenue/1000000).toFixed(2)+' mln so\'m', icon:DollarSign, color:'from-emerald-400 to-teal-500' },
          { label:'Jami foyda', value:(totalProfit/1000000).toFixed(2)+' mln so\'m', icon:TrendingUp, color:'from-green-400 to-emerald-500' },
          { label:'Jami cheklar', value:totalSales+' ta', icon:ShoppingBag, color:'from-blue-400 to-indigo-500' },
          { label:'Mahsulot turlari', value:products.length+' ta', icon:Package, color:'from-orange-400 to-red-400' },
        ].map(({label,value,icon:Icon,color})=>(
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <Icon size={24} className="mb-3 opacity-80"/>
            <div className="text-xl font-black">{value}</div>
            <div className="text-sm opacity-80 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">🔥 Eng ko'p sotiladigan mahsulotlar</h3>
          <div className="space-y-3">
            {productSales.slice(0,8).map(p=>(
              <div key={p.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 font-medium text-gray-700">
                    <span>{p.image}</span>{p.name}
                  </span>
                  <span className="text-gray-500">{p.soldQty} ta</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width:`${(p.soldQty/maxQty)*100}%`}}/>
                </div>
              </div>
            ))}
            {productSales.every(p=>p.soldQty===0)&&<p className="text-gray-400 text-sm">Hali sotuv yo'q</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">📅 Kunlik daromad</h3>
          <div className="space-y-3">
            {Object.entries(dailyRevenue).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,8).map(([date,amount])=>(
              <div key={date} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                <span className="text-sm font-medium text-gray-700">{date}</span>
                <span className="text-emerald-600 font-bold">{amount.toLocaleString()} so'm</span>
              </div>
            ))}
            {Object.keys(dailyRevenue).length===0&&<p className="text-gray-400 text-sm">Ma'lumot yo'q</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
