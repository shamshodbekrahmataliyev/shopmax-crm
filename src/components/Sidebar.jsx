import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, BarChart2, Receipt, AlertTriangle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const links = [
  { to:'/', icon:LayoutDashboard, label:'Boshqaruv' },
  { to:'/pos', icon:ShoppingCart, label:'Kassa (POS)' },
  { to:'/products', icon:Package, label:'Mahsulotlar' },
  { to:'/customers', icon:Users, label:'Mijozlar' },
  { to:'/sales', icon:Receipt, label:'Sotuvlar' },
  { to:'/reports', icon:BarChart2, label:'Hisobotlar' },
];

export default function Sidebar() {
  const { cart, lowStock } = useShop();
  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-900 to-teal-900 min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-400 rounded-2xl flex items-center justify-center text-emerald-900 font-black text-xl">S</div>
          <div>
            <h1 className="font-black text-lg">ShopMax</h1>
            <p className="text-xs text-emerald-300">Supermarket CRM</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-200 hover:bg-emerald-800 hover:text-white'
              }`}>
            <Icon size={18}/>{label}
            {to==='/pos'&&cart.length>0&&(
              <span className="ml-auto bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      {lowStock.length>0&&(
        <div className="m-4 bg-red-900/40 border border-red-600 rounded-xl p-3">
          <p className="text-red-300 text-xs font-semibold flex items-center gap-1">
            <AlertTriangle size={14}/>{lowStock.length} ta mahsulot tugayapti
          </p>
        </div>
      )}
    </aside>
  );
}
