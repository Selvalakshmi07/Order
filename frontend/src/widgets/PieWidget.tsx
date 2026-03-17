import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStore, type Widget } from '../store/useStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const PieWidget: React.FC<{ widget: Widget }> = ({ widget }) => {
  const { orders } = useStore();

  const chartData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    orders.forEach((order: any) => {
      groups[order.status] = (groups[order.status] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [orders]);
  return (
    <div className="w-full h-full flex flex-col">
      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-4">{widget.title}</p>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {widget.config.showLegend && <Legend verticalAlign="bottom" height={36} />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieWidget;
