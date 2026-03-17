import React from 'react';
import { useStore, type Widget } from '../store/useStore';

const KPIWidget: React.FC<{ widget: Widget }> = ({ widget }) => {
  const { config } = widget;
  const { orders } = useStore();
  
  const value = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
  const trend = '+12.5%'; // Trend logic could be added later if needed

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase text-muted-foreground">{widget.title}</p>
        <h2 className="text-2xl font-bold tracking-tight mt-1">
          {config.format === 'currency' ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </h2>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
          {trend}
        </span>
        <span className="text-[10px] text-muted-foreground">vs last 30 days</span>
      </div>
    </div>
  );
};

export default KPIWidget;
