import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar/>
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/pos" element={<POS/>}/>
              <Route path="/products" element={<Products/>}/>
              <Route path="/customers" element={<Customers/>}/>
              <Route path="/sales" element={<Sales/>}/>
              <Route path="/reports" element={<Reports/>}/>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ShopProvider>
  );
}
