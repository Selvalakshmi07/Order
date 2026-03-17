import { Layout, Plus, Search, Package, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import React, { useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { dashboards, fetchDashboards, loadDashboard, resetDashboard } = useStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    try {
      if (typeof fetchDashboards === 'function') {
        fetchDashboards();
      }
    } catch (err) {
      console.error('Error fetching dashboards:', err);
    }
  }, [fetchDashboards]);

  const handleCreate = () => {
    resetDashboard();
    navigate('/builder');
  };

  const handleLoad = async (id: string) => {
    await loadDashboard(id);
    navigate(`/builder/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this dashboard?')) {
      await useStore.getState().deleteDashboard(id);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">HALLE-X Dashboards</span>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="mb-4">
            <p className="text-[10px] uppercase font-bold text-muted-foreground px-3 mb-2">Navigation</p>
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs rounded bg-primary/10 text-primary font-medium flex items-center gap-2">
                <Layout className="w-3.5 h-3.5" />
                Dashboards
              </div>
              <div 
                onClick={() => navigate('/orders')}
                className="px-3 py-1.5 text-xs rounded hover:bg-secondary cursor-pointer flex items-center gap-2 text-muted-foreground transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                Orders Management
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 border-b bg-card flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span>/</span>
            <span className="text-foreground font-medium">Gallery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search dashboards..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-64 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <ThemeToggle />
            <button 
              onClick={handleCreate}
              className="bg-primary text-white text-xs px-3 h-8 rounded-md flex items-center gap-1.5 font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Dashboard
            </button>
          </div>
        </header>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <section>
              <h2 className="text-sm font-semibold mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Dashboard Configurations
                </div>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {Array.isArray(dashboards) ? dashboards.length : 0} items
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(dashboards) && dashboards.filter(db => {
                  const name = db?.name || '';
                  const query = searchQuery || '';
                  return name.toLowerCase().includes(query.toLowerCase());
                }).map((db) => (
                  <div 
                    key={db?._id} 
                    onClick={() => db?._id && handleLoad(db._id)}
                    className="group bg-card border rounded-lg p-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="aspect-[4/3] bg-secondary/30 rounded-md mb-2 flex items-center justify-center p-4 relative group">
                      <Layout className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors" />
                      <button 
                        onClick={(e) => db?._id && handleDelete(e, db._id)}
                        className="absolute top-2 right-2 p-1.5 bg-card rounded-md border text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 border-t">
                      <p className="text-xs font-semibold truncate">{db?.name || 'Untitled'}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Updated {db?.updatedAt ? new Date(db.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={handleCreate}
                  className="group border-2 border-dashed rounded-lg p-1 flex flex-col hover:border-primary/50 cursor-pointer transition-colors bg-card/50 min-h-[160px]"
                >
                  <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground">Create new</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;
