import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Filter,
  ChevronRight,
  Layout,
  ShoppingCart,
  Clock,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, createOrder, updateOrder, deleteOrder } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  // Fixed price per product — same regardless of country
  const PRODUCT_PRICES: Record<string, number> = {
    'Fiber Internet 300 Mbps': 60,
    '5G Unlimited Mobile Plan': 45,
    'Fiber Internet 1 Gbps': 90,
    'Business Internet 500 Mbps': 150,
    'VoIP Corporate Package': 30,
  };
  
  // Form State
  const [formData, setFormData] = useState({
    customerId: 'CUST-' + Math.floor(Math.random() * 1000),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    product: 'Fiber Internet 300 Mbps',
    country: 'United States',
    quantity: 1,
    unitPrice: 60,
    status: 'Pending',
    createdBy: 'Mr. Ryan Cooper'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const CREATED_BY_OPTIONS = [
    'Mr. Ryan Cooper',
    'Ms. Sarah Jenkins',
    'Mr. Lucas Martin'
  ];

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenCreate = () => {
    setEditingOrder(null);
    setFormData({
      customerId: 'CUST-' + Math.floor(Math.random() * 1000),
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      product: 'Fiber Internet 300 Mbps',
      country: 'United States',
      quantity: 1,
      unitPrice: 60,
      status: 'Pending',
      createdBy: 'Mr. Ryan Cooper'
    });
    setFormErrors({});
    setShowValidationErrors(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: any) => {
    setEditingOrder(order);
    setFormData({ ...order });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phoneNumber', 
      'address', 'city', 'state', 'postalCode'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidationErrors(true);
    
    if (!validateForm()) return;

    const data = {
      ...formData,
      customerName: `${formData.firstName} ${formData.lastName}`,
      totalAmount: formData.quantity * formData.unitPrice
    };
    
    if (editingOrder) {
      await updateOrder(editingOrder._id, data);
    } else {
      await createOrder(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await deleteOrder(id);
    }
  };

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar (Same structure as Gallery for consistency) */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">HALLE-X Orders</span>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground px-3 mb-2">Navigation</p>
            <div className="space-y-1">
              <div 
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs rounded hover:bg-secondary cursor-pointer flex items-center gap-2 text-muted-foreground transition-colors"
                >
                <Layout className="w-3.5 h-3.5" />
                Dashboards
              </div>
              <div 
                className="px-3 py-1.5 text-xs rounded bg-primary/10 text-primary font-medium flex items-center gap-2"
              >
                <Layout className="w-3.5 h-3.5" />
                Table
              </div>
            </div>
          </div>
        </nav>
        {/* Logout */}
        <div className="p-3 border-t">
          <button
            onClick={() => {
              localStorage.removeItem('halleyx_auth');
              localStorage.removeItem('halleyx_user');
              navigate('/login');
            }}
            className="w-full px-3 py-2 text-xs rounded hover:bg-red-50 text-red-500 font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-muted/50">
        {/* Header */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-semibold">Orders Management</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-64 rounded-lg border border-border bg-muted text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <ThemeToggle />
            <button 
              onClick={handleOpenCreate}
              className="bg-primary text-white text-xs px-4 h-9 rounded-lg flex items-center gap-2 font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.total, icon: <ShoppingCart className="text-primary" />, bg: 'bg-primary/10' },
                { label: 'Processing', value: stats.processing, icon: <Clock className="text-blue-500" />, bg: 'bg-blue-50' },
                { label: 'Shipped', value: stats.shipped, icon: <Package className="text-purple-500" />, bg: 'bg-purple-50' },
                { label: 'Delivered', value: stats.delivered, icon: <CheckCircle2 className="text-green-500" />, bg: 'bg-green-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/50">
                <h3 className="font-bold text-foreground text-sm">Recent Orders</h3>
                <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 font-medium transition-colors">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">S.no</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Customer ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Customer name</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Email ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Phone number</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Address</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Order ID</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Total Amount</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-20 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-border">
                               <Package className="w-8 h-8 text-slate-300" />
                            </div>
                            <div className="max-w-[200px]">
                              <p className="text-sm font-bold text-foreground">No Orders Yet</p>
                              <p className="text-xs text-muted-foreground mt-1">Click Create Order and enter the your order information</p>
                            </div>
                            <button 
                              onClick={handleOpenCreate}
                              className="mt-2 bg-primary text-white text-xs px-6 h-9 rounded-lg font-bold hover:shadow-lg transition-all"
                            >
                              Create Order
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order, index) => (
                        <tr key={order._id} className="hover:bg-muted/50 transition-colors group">
                          <td className="px-6 py-4 border-b text-xs font-medium text-muted-foreground">{index + 1}</td>
                          <td className="px-6 py-4 border-b">
                            <span className="text-xs font-mono font-bold text-muted-foreground">
                              {order.customerId}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <p className="text-xs font-semibold text-foreground">{order.customerName}</p>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <p className="text-xs text-muted-foreground">{order.email}</p>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <p className="text-xs text-muted-foreground">{order.phoneNumber}</p>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <p className="text-[10px] text-muted-foreground max-w-[150px] truncate">{order.address}</p>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <span className="text-xs font-mono text-muted-foreground">
                              {order._id.substring(order._id.length - 8).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <p className="text-xs font-bold text-foreground">
                              ${order.totalAmount.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 border-b">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(order.status)} shadow-sm`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleOpenEdit(order)}
                                className="p-1.5 hover:bg-white rounded-md border border-border text-muted-foreground hover:text-primary transition-all shadow-sm"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(order._id)}
                                className="p-1.5 hover:bg-red-50 rounded-md border border-border text-muted-foreground hover:text-red-600 transition-all shadow-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New/Edit Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Create order</h2>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh]">
               <div className="p-6 space-y-6">
                 {/* Customer Information */}
                 <div className="space-y-4">
                   <h3 className="text-sm font-bold text-foreground">Customer Information</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">First name*</label>
                        <input 
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.firstName ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="jhon"
                        />
                        {showValidationErrors && formErrors.firstName && <p className="text-[10px] text-red-500">{formErrors.firstName}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Last Name*</label>
                        <input 
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.lastName ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="doe"
                        />
                        {showValidationErrors && formErrors.lastName && <p className="text-[10px] text-red-500">{formErrors.lastName}</p>}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Email ID*</label>
                        <input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.email ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="johndoe@gmail.com"
                        />
                        {showValidationErrors && formErrors.email && <p className="text-[10px] text-red-500">{formErrors.email}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Phone number*</label>
                        <input 
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.phoneNumber ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="+1 838 222 3546"
                        />
                        {showValidationErrors && formErrors.phoneNumber && <p className="text-[10px] text-red-500">{formErrors.phoneNumber}</p>}
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground">Street Address*</label>
                      <input 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.address ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                        placeholder="788 St Plais, Apt 4B"
                      />
                      {showValidationErrors && formErrors.address && <p className="text-[10px] text-red-500">{formErrors.address}</p>}
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">City*</label>
                        <input 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.city ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="Quebec"
                        />
                        {showValidationErrors && formErrors.city && <p className="text-[10px] text-red-500">{formErrors.city}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">State / Province*</label>
                        <input 
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.state ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="Quebec"
                        />
                        {showValidationErrors && formErrors.state && <p className="text-[10px] text-red-500">{formErrors.state}</p>}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Postal code*</label>
                        <input 
                          value={formData.postalCode}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          className={`w-full h-10 px-3 rounded-lg border outline-none transition-all text-sm ${showValidationErrors && formErrors.postalCode ? 'border-red-500 focus:ring-red-100' : 'border-border focus:ring-primary/20 focus:border-primary'}`}
                          placeholder="G1Q 2V6"
                        />
                        {showValidationErrors && formErrors.postalCode && <p className="text-[10px] text-red-500">{formErrors.postalCode}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Country*</label>
                        <select 
                          value={formData.country}
                           onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg border border-border focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-card"
                        >
                          {['United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                 </div>

                 {/* Order Information */}
                 <div className="space-y-4 pt-4 border-t">
                   <h3 className="text-sm font-bold text-foreground">Order Information</h3>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Choose product*</label>
                        <select 
                          value={formData.product}
                          onChange={(e) => {
                            const newProduct = e.target.value;
                            setFormData({
                              ...formData,
                              product: newProduct,
                              unitPrice: PRODUCT_PRICES[newProduct] || 0
                            });
                          }}
                          className="w-full h-10 px-3 rounded-lg border border-border focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-card"
                        >
                          {Object.keys(PRODUCT_PRICES).map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Quantity*</label>
                        <input 
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                          className="w-full h-10 px-3 rounded-lg border border-border focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Unit price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                          <input 
                            readOnly
                            value={formData.unitPrice}
                            className="w-full h-10 pl-7 pr-3 rounded-lg border border-border bg-muted text-muted-foreground text-sm outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Total Amount</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                          <input 
                            readOnly
                            value={(formData.quantity * formData.unitPrice).toLocaleString()}
                            className="w-full h-10 pl-7 pr-3 rounded-lg border border-border bg-muted text-muted-foreground font-bold text-sm outline-none"
                          />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Status*</label>
                        <select 
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full h-10 px-3 rounded-lg border border-border focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-card"
                        >
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-muted-foreground">Created by*</label>
                        <select 
                          value={formData.createdBy}
                          onChange={(e) => setFormData({...formData, createdBy: e.target.value})}
                          className="w-full h-10 px-3 rounded-lg border border-border focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-card"
                        >
                          {CREATED_BY_OPTIONS.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                 </div>

                 <div className="pt-2 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-11 rounded-xl border border-border font-bold text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 h-11 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      Submit
                    </button>
                 </div>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple X component since lucide-react X might be duplicated or missing
const X = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default OrdersPage;
