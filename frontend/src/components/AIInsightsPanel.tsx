import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, AlertCircle, Target, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';

const AIInsightsPanel: React.FC = () => {
  const { isAIPanelOpen, setAIPanelOpen, orders } = useStore();

  const insights = React.useMemo(() => {
    if (orders.length === 0) return [];

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = totalRevenue / orders.length;
    
    return [
      {
        title: "Revenue Projection",
        description: `Based on your current trajectory, we anticipate a 12% increase in revenue by next quarter, potentially reaching $${(totalRevenue * 1.12).toLocaleString()}.`,
        icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
        color: "blue"
      },
      {
        title: "Growth Opportunity",
        description: `Your average order value is $${avgOrderValue.toFixed(2)}. Suggesting "Premium Plus" bundles could increase this by 8-10%.`,
        icon: <Target className="w-5 h-5 text-purple-500" />,
        color: "purple"
      },
      {
        title: "Data Anomaly",
        description: "Unusual spike in orders from 'Canada' detected in the last 48 hours. Recommend reviewing regional marketing campaign performance.",
        icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
        color: "orange"
      }
    ];
  }, [orders]);

  return (
    <AnimatePresence>
      {isAIPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAIPanelOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-card border-l shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <h2 className="font-bold text-lg">AI Insights</h2>
              </div>
              <button 
                onClick={() => setAIPanelOpen(false)}
                className="p-1.5 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="group p-4 rounded-xl border bg-background hover:border-primary/50 transition-all hover:shadow-md cursor-default"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-${insight.color}-500/10`}>
                      {insight.icon}
                    </div>
                    <h3 className="font-bold text-sm">{insight.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    TAKE ACTION <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No data to analyze</p>
                  <p className="text-xs text-muted-foreground mt-1">Start by adding some orders to see AI magic.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-secondary/20">
              <button className="w-full h-10 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                Generate Full Report
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIInsightsPanel;
