import React from 'react';
import { useStore, type Widget } from '../store/useStore';

const TableWidget: React.FC<{ widget: Widget }> = ({ widget }) => {
  const { orders } = useStore();
  
  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">{widget.title}</p>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="py-2 px-2 font-semibold">Customer</th>
              <th className="py-2 px-2 font-semibold">Product</th>
              <th className="py-2 px-2 font-semibold">Amount</th>
              <th className="py-2 px-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order: any) => (
              <tr key={order._id} className="border-b hover:bg-secondary/30 transition-colors">
                <td className="py-2 px-2">{order.customerName}</td>
                <td className="py-2 px-2">{order.product}</td>
                <td className="py-2 px-2 font-medium">${(order.totalAmount || 0).toLocaleString()}</td>
                <td className="py-2 px-2">
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground text-[10px]">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableWidget;
