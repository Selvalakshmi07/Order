import React from 'react';
import { 
  Save, 
  Calendar, 
  ChevronDown, 
  Layout, 
  Activity,
  BarChart3,
  PieChart as PieIcon,
  Table as TableIcon,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import CanvasGrid from '../components/CanvasGrid';
import SettingsSidebar from '../components/SettingsSidebar';
import ThemeToggle from '../components/ThemeToggle';

const widgetTypes = [
  { type: 'kpi', label: 'KPI Card', icon: <Activity className="w-4 h-4" /> },
  { type: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { type: 'line', label: 'Line Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { type: 'pie', label: 'Pie Chart', icon: <PieIcon className="w-4 h-4" /> },
  { type: 'table', label: 'Data Table', icon: <TableIcon className="w-4 h-4" /> },
  { type: 'predictive', label: 'AI Prediction', icon: <TrendingUp className="w-4 h-4" /> },
] as const;

const BuilderPage: React.FC = () => {
  const { 
    addWidget, 
    saveDashboard, 
    selectedWidgetId, 
    filters, 
    setFilters, 
    dashboardName, 
    setDashboardName, 
    fetchOrders, 
    isAIPanelOpen, 
    setAIPanelOpen 
  } = useStore();
  
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(false);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
  ] as const;

  return (
    <div className="flex h-screen bg-transparent overflow-hidden">
      {/* Widget Library (Left) */}
      {!isPreview && (
        <aside className="w-64 border-r bg-card/80 backdrop-blur-xl flex flex-col z-20">
          <div className="p-4 border-b flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">HALLE-X Library</span>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Components</p>
            <div className="grid grid-cols-2 gap-2">
              {widgetTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => addWidget(type)}
                  className="flex flex-col items-center justify-center p-3 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary gap-1.5"
                >
                  {icon}
                  <span className="text-[10px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Canvas Area (Middle) */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input 
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                className="text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-200 focus:border-primary focus:outline-none px-1"
              />
              <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">Draft</span>
            </div>
            <div className="h-4 w-[1px] bg-border" />
            <div className="relative">
              <div 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 bg-secondary/50 px-2 py-1 rounded-md cursor-pointer hover:bg-secondary transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium uppercase">
                  {dateOptions.find(o => o.value === filters.dateRange)?.label}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-card border rounded-md shadow-lg z-50 py-1">
                  {dateOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilters({ dateRange: option.value });
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors ${filters.dateRange === option.value ? 'bg-primary/5 text-primary font-medium' : 'text-muted-foreground'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className={`text-xs px-3 h-9 border rounded-md font-medium transition-colors ${isPreview ? 'bg-primary text-white border-primary' : 'hover:bg-secondary bg-card'}`}
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button 
              onClick={saveDashboard}
              className="bg-primary text-white text-xs px-3 h-9 rounded-md flex items-center gap-1.5 font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              Save Dashboard
            </button>
            <button
              onClick={() => setAIPanelOpen(!isAIPanelOpen)}
              className={`px-3 h-9 rounded-md border transition-all flex items-center gap-2 font-bold text-xs ${isAIPanelOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-card hover:bg-secondary text-muted-foreground'}`}
              title="AI Insights"
            >
              <Sparkles className={`w-4 h-4 ${isAIPanelOpen ? 'animate-pulse' : ''}`} />
              {isAIPanelOpen ? 'Hide Insights' : 'AI Analysis'}
            </button>
            <div className="w-[1px] h-4 bg-border mx-1" />
            <ThemeToggle />
          </div>
        </header>

        {/* Grid Canvas */}
        <CanvasGrid />
      </main>

      {/* Settings Panel (Right) */}
      {!isPreview && (
        <div className={`transition-all duration-300 fixed inset-y-0 right-0 z-30 ${selectedWidgetId ? 'translate-x-0 overflow-visible' : 'translate-x-full'}`}>
          <SettingsSidebar />
        </div>
      )}
    </div>
  );
};

export default BuilderPage;
