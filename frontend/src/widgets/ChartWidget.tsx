import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useStore, type Widget } from '../store/useStore';

const ChartWidget: React.FC<{ widget: Widget }> = ({ widget }) => {
  const { orders } = useStore();
  const { type, config } = widget;

  // Aggregate orders by date
  const chartData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    orders.forEach((order: any) => {
      const date = new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short' });
      groups[date] = (groups[date] || 0) + (order.totalAmount || 0);
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" fill={config.color || '#3b82f6'} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={config.color || '#3b82f6'} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={config.color || '#3b82f6'} fill={`${config.color || '#3b82f6'}33`} />
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">{widget.title}</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart() as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;
