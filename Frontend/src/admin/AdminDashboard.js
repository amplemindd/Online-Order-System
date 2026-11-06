import React, { useState, useEffect } from 'react';
import './Admin.css';
import AddProductModal from './AddProductModal';

const I = {
 Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
 Orders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
 Products: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
 Categories: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/></svg>,
 Customers: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
 Reports: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
 Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 9 15a1.65 1.65 0 0 0-1-1.51V13a2 2 0 0 1 4 0v.49c.34.22.68.52.9.91z"/></svg>,
};

export default function AdminDashboard(){
 const [page,setPage]=useState('dashboard');
 const [prodOpen,setProdOpen]=useState(true);
 const [prodSub,setProdSub]=useState('all');
 const [showAdd,setShowAdd]=useState(false);
 const [products,setProducts]=useState([]);

 // LIVE - DB se products lao
 const fetchProducts = async () => {
   try {
     const res = await fetch('http://localhost:3000/api/products');
     const data = await res.json();
     // backend kabhi array bhejta hai, kabhi {products: [...]}
     if (Array.isArray(data)) setProducts(data);
     else if (data.products) setProducts(data.products);
     else setProducts([]);
   } catch (e) { console.log('fetch error', e); }
 };

 useEffect(() => { fetchProducts(); }, []);

 const getImage = (p) => {
   if (p.imageUrl) return p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:3000${p.imageUrl}`;
   if (p.image) return p.image.startsWith('http') ? p.image : `http://localhost:3000${p.image}`;
   return '';
 };

 return(
  <div className="admin-layout">
   <div className="admin-sidebar">
    <div className="admin-logo">
     <div className="admin-logo-icon">
       <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1z"/></svg>
     </div>
     <div><h3>GreenBee</h3><span>Online Order System</span></div>
    </div>

    <div className="admin-nav">
     <div className={`admin-nav-item ${page==='dashboard'?'active':''}`} onClick={()=>{setPage('dashboard'); setProdOpen(false)}}><I.Home/> Dashboard</div>
     <div className="admin-nav-item"><I.Orders/> Orders <span className="badge">12</span></div>
     <div className={`admin-nav-item ${page==='products'?'active':''}`} onClick={()=>{setPage('products'); setProdOpen(!prodOpen)}}><I.Products/> Products <span className={`arrow ${prodOpen?'open':''}`} style={{marginLeft:'auto'}}>›</span></div>
     {prodOpen && (
       <div className="admin-sub">
         <div className={`admin-sub-item ${prodSub==='all'&&page==='products'?'active':''}`} onClick={()=>{setPage('products'); setProdSub('all')}}>All Products</div>
         <div className={`admin-sub-item ${prodSub==='add'?'active':''}`} onClick={()=>{setProdSub('add'); setShowAdd(true)}}>Add Product</div>
         <div className="admin-sub-item">Product Variants</div>
         <div className="admin-sub-item">Bulk Upload</div>
       </div>
     )}
     <div className="admin-nav-item"><I.Categories/> Categories</div>
     <div className="admin-nav-item"><I.Customers/> Customers</div>
     <div className="admin-nav-item"><I.Reports/> Reports</div>
     <div className="admin-nav-item"><I.Settings/> Settings</div>
    </div>

    <div className="admin-basket">
      <img src="https://cdn-icons-png.flaticon.com/512/3081/3081648.png" alt="basket" />
      <h4>GreenBee</h4>
      <p>Manage your online<br/>store efficiently.</p>
    </div>

    <div className="admin-user">
     <div style={{width:32,height:32,borderRadius:'50%',background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center'}}>👤</div>
     <div><div style={{fontSize:13,fontWeight:700}}>Admin</div><div style={{fontSize:11,opacity:.6}}>Administrator</div></div>
     <div style={{marginLeft:'auto',width:8,height:8,background:'#22c55e',borderRadius:'50%'}}></div>
    </div>
   </div>

   <div className="admin-content">
    {page==='dashboard' ? (
      <>
        <div className="admin-top">
          <div><h2 style={{margin:0,fontSize:20,fontWeight:800}}>Admin Dashboard</h2><p style={{margin:0,fontSize:13,opacity:.6}}>Welcome back, Admin 👋</p></div>
          <div className="admin-search"><span style={{position:'absolute',left:12,top:9}}>🔍</span><input placeholder="Search orders, products, customers..." /></div>
        </div>

        <div className="admin-cards">
          <div className="stat-card"><div className="stat-icon" style={{background:'#dcfce7'}}>🛒</div><div><h4>Total Orders</h4><h2>1,248</h2><p>↑ +12.5% today</p></div></div>
          <div className="stat-card"><div className="stat-icon" style={{background:'#f3e8ff'}}>📦</div><div><h4>Total Products</h4><h2>{products.length}</h2><p>↑ {products.length} live products</p></div></div>
          <div className="stat-card"><div className="stat-icon" style={{background:'#dbeafe'}}>👥</div><div><h4>Total Customers</h4><h2>892</h2><p>↑ +7.3%</p></div></div>
          <div className="stat-card"><div className="stat-icon" style={{background:'#fef3c7'}}>₹</div><div><h4>Total Revenue</h4><h2>₹3,46,820</h2><p>↑ +18.4%</p></div></div>
        </div>

        <div className="admin-grid2">
          <div className="admin-card">
            <div style={{display:'flex',justifyContent:'space-between'}}><b>Sales Overview</b><select style={{border:'1px solid #ddd',borderRadius:8,padding:'4px 8px',fontSize:12}}><option>This Month</option></select></div>
            <div className="chart-wrap">
              <svg viewBox="0 0 500 160" width="100%" height="160"><path d="M0,130 Q20,125 40,110 T80,100 T120,70 T160,75 T200,90 T240,85 T280,50 T320,40 T360,45 T400,20 T440,30 T480,20" fill="none" stroke="#22c55e" strokeWidth="2"/></svg>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#888'}}><span>Oct 01</span><span>Oct 29</span></div>
            </div>
          </div>
          <div className="admin-card"><b>Orders by Status</b><div style={{marginTop:20,textAlign:'center'}}><div style={{width:120,height:120,borderRadius:'50%',background:'conic-gradient(#16a34a 0 67%,#fb923c 67% 81%,#3b82f6 81% 90%,#a855f7 90% 95%,#9ca3af 95% 100%)',margin:'0 auto'}}></div><div style={{fontSize:12,marginTop:10}}>Completed 67.5%</div></div></div>
        </div>

        <div className="admin-grid3">
          <div className="admin-card">
            <div style={{display:'flex',justifyContent:'space-between'}}><b>Recent Orders</b><span style={{color:'#22c55e',fontSize:12}}>View All →</span></div>
            <table className="recent-table" style={{marginTop:10}}>
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td style={{color:'#16a34a',fontWeight:700}}>#GB1248</td><td>Rahul Sharma</td><td>₹1,240</td><td><span className="status Completed">Completed</span></td></tr>
                <tr><td style={{color:'#16a34a',fontWeight:700}}>#GB1247</td><td>Priya Verma</td><td>₹780</td><td><span className="status Processing">Processing</span></td></tr>
                <tr><td style={{color:'#16a34a',fontWeight:700}}>#GB1246</td><td>Amit Gupta</td><td>₹2,310</td><td><span className="status Completed">Completed</span></td></tr>
              </tbody>
            </table>
          </div>
          <div className="admin-card">
            <b>Top Selling Products</b>
            <div style={{marginTop:10}}>
              {products.slice(0,3).map((p,i)=>(
                <div key={p.id || i} className="top-product"><span>{getImage(p) ? <img src={getImage(p)} alt="" style={{width:22,height:22,borderRadius:4,objectFit:'cover'}}/> : '🍎'}</span> {p.name}<div className="progress"><div style={{width:'90%'}}></div></div></div>
              ))}
              {products.length===0 && <p style={{fontSize:12,color:'#888'}}>Abhi koi product nahi hai</p>}
            </div>
          </div>
          <div className="admin-card">
            <b>Quick Actions</b>
            <div className="quick-grid" style={{marginTop:10}}>
              <div className="quick-btn green" onClick={()=>setShowAdd(true)}>⊕ Add Product</div>
              <div className="quick-btn purple">⊞ Add Category</div>
              <div className="quick-btn orange">🏷️ Create Offer</div>
              <div className="quick-btn blue">📋 View Reports</div>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div>
        <div className="prod-header"><div><h2 style={{margin:0}}>Products Management</h2><p style={{fontSize:12,color:'#666'}}>Manage your store products</p></div><button onClick={()=>setShowAdd(true)} style={{background:'#16a34a',color:'#fff',padding:'8px 14px',borderRadius:8,border:'none',fontWeight:600}}>+ Add Product</button></div>
        <div className="admin-card" style={{marginTop:12}}>
          <table className="recent-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {products.length===0 && (<tr><td colSpan="4" style={{textAlign:'center',padding:20,color:'#888'}}>No products yet. Add Product dabake pehla product add karo.</td></tr>)}
              {products.map((p)=>(
                <tr key={p.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}>{getImage(p) ? <img src={getImage(p)} alt="" style={{width:32,height:32,borderRadius:6,objectFit:'cover'}}/> : '🍎'} {p.name}</div></td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
   </div>

   {showAdd && <AddProductModal onClose={()=>{setShowAdd(false); setProdSub('all'); fetchProducts();}} onProductAdded={fetchProducts} />}
  </div>
 )
}