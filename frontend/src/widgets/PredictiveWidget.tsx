import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { useStore } from '../store/useStore';

interface PredictiveWidgetProps {
  id: string;
  title: string;
  config: any;
}

const PredictiveWidget: React.FC<PredictiveWidgetProps> = ({ title, config }) => {
  const { orders } = useStore();

  // Simple regression for demonstration
  const data = React.useMemo(() => {
    if (!orders.length) return [];
    
    interface ChartDataPoint {
      name: string;
      actual: number | null;
      forecast: number | null;
    }

    // Group by date
    const grouped = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});

    const chartData: ChartDataPoint[] = Object.entries(grouped).map(([name, value]) => ({
      name,
      actual: value as number,
      forecast: null
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // Add forecast points
    if (chartData.length > 0) {
      const lastPoint = chartData[chartData.length - 1];
      const avgGrowth = 1.15; // Simulated 15% growth
      
      for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(new Date(lastPoint.name).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString();
        chartData.push({
          name: nextDate,
          actual: null,
          forecast: Math.round((lastPoint.actual as number) * Math.pow(avgGrowth, i))
        });
      }
    }

    return chartData;
  }, [orders]);

  return (
    <div className="flex flex-col h-full glass rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
        <TrendingUp className="w-12 h-12 text-primary rotate-12" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm truncate">{title}</h3>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
          <TrendingUp className="w-3 h-3" />
          AI Forecast
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: 'currentColor', opacity: 0.5 }}
            />
            <YAxis 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tick={{ fill: 'currentColor', opacity: 0.5 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--foreground)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke={config.color} 
              fillOpacity={1} 
              fill="url(#actualGradient)" 
              strokeWidth={2}
              name="Historical"
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stroke="#10b981" 
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#forecastGradient)" 
              strokeWidth={2}
              name="AI Prediction"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-start gap-2 p-2 bg-secondary/30 rounded-lg">
        <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
        <p className="text-[10px] text-muted-foreground leading-tight">
          AI prediction is based on historical order volume and 15% estimated market growth.
        </p>
      </div>
    </div>
  );
};

export default PredictiveWidget;
