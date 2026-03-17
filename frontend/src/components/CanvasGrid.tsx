import React from 'react';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { Settings, Trash2 } from 'lucide-react';
import { useStore, type Widget } from '../store/useStore';
import KPIWidget from '../widgets/KPIWidget';
import ChartWidget from '../widgets/ChartWidget';
import PieWidget from '../widgets/PieWidget';
import TableWidget from '../widgets/TableWidget';
import PredictiveWidget from '../widgets/PredictiveWidget';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const CanvasGrid: React.FC = () => {
  const { widgets, updateWidget, deleteWidget, setSelectedWidget } = useStore();
  const { width, containerRef, mounted } = useContainerWidth();
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  console.log('HALLEYX_DEBUG: CanvasGrid Rendering with width:', width, 'mounted:', mounted);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 10; 
    const y = (clientY / innerHeight - 0.5) * -10;
    setMousePosition({ x, y });
  };

  const onLayoutChange = (currentLayout: any[]) => {
    currentLayout.forEach((item) => {
      const widget = (widgets || []).find((w) => w.id === item.i);
      if (widget) {
        updateWidget(item.i, {
          position: { x: item.x, y: item.y, w: item.w, h: item.h },
        });
      }
    });
  };

  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'kpi': return <KPIWidget widget={widget} />;
      case 'bar':
      case 'line':
      case 'area': return <ChartWidget widget={widget} />;
      case 'pie': return <PieWidget widget={widget} />;
      case 'table': return <TableWidget widget={widget} />;
      case 'predictive': return <PredictiveWidget id={widget.id} title={widget.title} config={widget.config} />;
      default: return null;
    }
  };

  return (
    <div 
      ref={containerRef as any}
      className="flex-1 overflow-auto p-6 scrollbar-hide relative"
      onMouseMove={handleMouseMove}
      style={{ perspective: '1000px' }}
    >
      {mounted && (
        <motion.div
          animate={{ 
            rotateX: mousePosition.y,
            rotateY: mousePosition.x,
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 100 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: (widgets || []).map(w => ({ i: w.id, ...w.position })) }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            width={width}
            onLayoutChange={onLayoutChange}
            draggableHandle=".drag-handle"
            margin={[20, 20]}
          >
            {(widgets || []).map((widget) => (
              <div key={widget.id} onClick={(e) => {
                e.stopPropagation();
                setSelectedWidget(widget.id);
              }}>
                <div 
                  className="h-full bg-card/60 backdrop-blur-md rounded-2xl border shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-primary/50 transition-all duration-300 relative"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Widget Header */}
                  <div className="drag-handle px-4 py-3 border-b flex items-center justify-between cursor-move bg-card/40 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="text-[10px] uppercase tracking-wider font-extrabold pr-4 truncate">{widget.title}</h3>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity no-drag">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWidget(widget.id);
                        }}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground transition-colors"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteWidget(widget.id);
                        }}
                        className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 p-4 min-h-0 bg-transparent">
                    {renderWidgetContent(widget)}
                  </div>
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </motion.div>
      )}
    </div>
  );
};

export default CanvasGrid;
