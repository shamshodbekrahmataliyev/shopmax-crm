import { useShop } from '../context/ShopContext';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { products, customers, sales, todayRevenue, todayProfit, totalRevenue, lowStock, todaySales } = useShop();

  const stats = [
    { label:"Bugungi savdo", value:todayRevenue.toLocaleString()+' so\'m', icon:DollarSign, color:'from-emerald-400 to-teal-500' },
    { label:"Bugungi foyda", value:todayProfit.toLocaleString()+' so\'m', icon:TrendingUp, color:'from-green-400 to-emerald-500' },
    { label:"Bugungi cheklar", value:todaySales.length+' ta', icon:ShoppingBag, color:'from-blue-400 to-indigo-500' },
    { label:"Mijozlar", value:customers.length+' ta', icon:Users, color:'from-purple-400 to-pink-500' },
    { label:"Mahsulotlar", value:products.length+' tur', icon:Package, color:'from-orange-400 to-red-400' },
    { label:"Jami daromad", value:(totalRevenue/1000000).toFixed(1)+' mln', icon:TrendingUp, color:'from-teal-400 to-cyan-500' },
  ];

  const topProducts = [...products].sort((a,b)=>{
    const aSales=sales.reduce((s,t)=>s+(t.items.find(i=>i.id===a.id)?.qty||0),0);
    const bSales=sales.reduce((s,t)=>s+(t.items.find(i=>i.id===b.id)?.qty||0),0);
    return bSales-aSales;
  }).slice(0,5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800">Boshqaruv paneli</h2>
        <p className="text-gray-500">{new Date().toLocaleDateString('uz-UZ',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({label,value,icon:Icon,color})=>(
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex items-center justify-between mb-3">
              <Icon size={24} className="opacity-80"/>
              <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs">Bugun</span>
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-sm opacity-80 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">🔥 Eng ko'p sotiladigan</h3>
          <div className="space-y-3">
            {topProducts.map((p,i)=>(
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center text-sm font-bold">{i+1}</span>
                <span className="text-2xl">{p.image}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.price.toLocaleString()} so'm</p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">{p.stock}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-500"/>Kam qoldiq
          </h3>
          {lowStock.length===0?<p className="text-gray-400 text-sm">Hamma narsa yetarli ✅</p>:(
            <div className="space-y-3">
              {lowStock.map(p=>(
                <div key={p.id} className="flex items-center justify-between bg-red-50 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.image}</span>
                    <p className="text-sm font-semibold text-gray-700 truncate max-w-[120px]">{p.name}</p>
                  </div>
                  <span className="text-red-600 font-black">{p.stock}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">So'nggi sotuvlar</h3>
          {sales.length===0?<p className="text-gray-400 text-sm">Hali sotuv yo'q</p>:(
            <div className="space-y-3">
              {sales.slice(0,5).map(s=>(
                <div key={s.id} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                  <div>
                    <p className="text-xs text-gray-500">{new Date(s.date).toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'})}</p>
                    <p className="text-sm font-medium text-gray-700">{s.items.length} ta mahsulot</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{s.finalTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{s.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
