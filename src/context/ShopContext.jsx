import { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

const initialProducts = [
  { id:1, barcode:'8001001', name:'Coca-Cola 0.5L', category:'Ichimliklar', price:8000, cost:5000, stock:120, minStock:20, unit:'dona', image:'🥤' },
  { id:2, barcode:'8001002', name:'Lay\'s Original 100g', category:'Gazaklar', price:12000, cost:8000, stock:85, minStock:15, unit:'dona', image:'🍟' },
  { id:3, barcode:'8002001', name:'Guruch Devzira 1kg', category:'Oziq-ovqat', price:18000, cost:12000, stock:200, minStock:30, unit:'kg', image:'🌾' },
  { id:4, barcode:'8002002', name:'Sut 1L', category:'Sut mahsulotlari', price:9000, cost:6500, stock:45, minStock:20, unit:'dona', image:'🥛' },
  { id:5, barcode:'8003001', name:'Non', category:'Non mahsulotlari', price:4000, cost:2500, stock:30, minStock:10, unit:'dona', image:'🍞' },
  { id:6, barcode:'8004001', name:'Tuxum (10 dona)', category:'Oziq-ovqat', price:22000, cost:16000, stock:60, minStock:10, unit:'quti', image:'🥚' },
];

const initialCustomers = [
  { id:1, name:'Abdullayev Mansur', phone:'+998901111111', loyaltyPoints:350, totalPurchase:850000, memberSince:'2025-01-15' },
  { id:2, name:'Xolmatova Dilnoza', phone:'+998902222222', loyaltyPoints:120, totalPurchase:320000, memberSince:'2025-06-01' },
];

export function ShopProvider({ children }) {
  const [products, setProducts] = useState(()=>JSON.parse(localStorage.getItem('shop_products')||'null')||initialProducts);
  const [customers, setCustomers] = useState(()=>JSON.parse(localStorage.getItem('shop_customers')||'null')||initialCustomers);
  const [sales, setSales] = useState(()=>JSON.parse(localStorage.getItem('shop_sales')||'null')||[]);
  const [cart, setCart] = useState([]);
  const [expenses, setExpenses] = useState(()=>JSON.parse(localStorage.getItem('shop_expenses')||'null')||[]);

  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

  const addProduct=(p)=>{const n=[...products,{...p,id:Date.now()}];setProducts(n);save('shop_products',n);};
  const updateProduct=(id,d)=>{const n=products.map(p=>p.id===id?{...p,...d}:p);setProducts(n);save('shop_products',n);};
  const deleteProduct=(id)=>{const n=products.filter(p=>p.id!==id);setProducts(n);save('shop_products',n);};

  const addToCart=(product,qty=1)=>{
    setCart(prev=>{
      const exists=prev.find(i=>i.id===product.id);
      if(exists) return prev.map(i=>i.id===product.id?{...i,qty:i.qty+qty}:i);
      return [...prev,{...product,qty}];
    });
  };
  const removeFromCart=(id)=>setCart(prev=>prev.filter(i=>i.id!==id));
  const updateCartQty=(id,qty)=>setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,qty)}:i));
  const clearCart=()=>setCart([]);

  const checkout=(paymentMethod='naqd',customerId=null,discount=0)=>{
    const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
    const finalTotal=total-discount;
    const profit=cart.reduce((s,i)=>s+(i.price-i.cost)*i.qty,0)-discount;
    const sale={
      id:Date.now(), date:new Date().toISOString(), items:[...cart],
      total,discount,finalTotal,profit,paymentMethod,customerId
    };
    const n=[sale,...sales];setSales(n);save('shop_sales',n);
    // Update stock
    const updatedProducts=products.map(p=>{
      const item=cart.find(i=>i.id===p.id);
      return item?{...p,stock:Math.max(0,p.stock-item.qty)}:p;
    });
    setProducts(updatedProducts);save('shop_products',updatedProducts);
    // Loyalty points
    if(customerId){
      const points=Math.floor(finalTotal/1000);
      const updatedC=customers.map(c=>c.id===customerId?{...c,loyaltyPoints:c.loyaltyPoints+points,totalPurchase:c.totalPurchase+finalTotal}:c);
      setCustomers(updatedC);save('shop_customers',updatedC);
    }
    clearCart();
    return sale;
  };

  const addCustomer=(c)=>{const n=[...customers,{...c,id:Date.now(),loyaltyPoints:0,totalPurchase:0,memberSince:new Date().toISOString().split('T')[0]}];setCustomers(n);save('shop_customers',n);};
  const addExpense=(e)=>{const n=[{...e,id:Date.now(),date:e.date||new Date().toISOString().split('T')[0]},...expenses];setExpenses(n);save('shop_expenses',n);};

  const todaySales=sales.filter(s=>new Date(s.date).toDateString()===new Date().toDateString());
  const todayRevenue=todaySales.reduce((s,t)=>s+t.finalTotal,0);
  const todayProfit=todaySales.reduce((s,t)=>s+t.profit,0);
  const totalRevenue=sales.reduce((s,t)=>s+t.finalTotal,0);
  const cartTotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const lowStock=products.filter(p=>p.stock<=p.minStock);

  return (
    <ShopContext.Provider value={{
      products,customers,sales,cart,expenses,
      addProduct,updateProduct,deleteProduct,
      addToCart,removeFromCart,updateCartQty,clearCart,checkout,
      addCustomer,addExpense,
      todaySales,todayRevenue,todayProfit,totalRevenue,cartTotal,lowStock
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop=()=>useContext(ShopContext);
