import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';

export interface Widget {
  id: string;
  type: 'kpi' | 'bar' | 'line' | 'area' | 'pie' | 'table' | 'predictive';
  title: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

export type ThemeType = 'default' | 'glass' | 'midnight' | 'cyberpunk';

interface DashboardState {
  dashboards: any[];
  currentDashboardId: string | null;
  widgets: Widget[];
  selectedWidgetId: string | null;
  filters: {
    dateRange: 'all' | 'today' | '7days' | '30days' | '90days';
  };
  dashboardName: string;
  orders: any[];
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  theme: ThemeType;
  isAIPanelOpen: boolean;
  
  // Actions
  setWidgets: (widgets: Widget[]) => void;
  addWidget: (type: Widget['type']) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
  setSelectedWidget: (id: string | null) => void;
  setFilters: (filters: DashboardState['filters']) => void;
  setToast: (toast: DashboardState['toast']) => void;
  saveDashboard: () => Promise<void>;
  loadDashboard: (id: string) => Promise<void>;
  fetchDashboards: () => Promise<void>;
  setDashboardName: (name: string) => void;
  resetDashboard: () => void;
  deleteDashboard: (id: string) => Promise<void>;
  
  // Order Actions
  fetchOrders: () => Promise<void>;
  createOrder: (order: any) => Promise<void>;
  updateOrder: (id: string, order: any) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  setTheme: (theme: ThemeType) => void;
  setAIPanelOpen: (isOpen: boolean) => void;
}

export const useStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      dashboards: [],
      currentDashboardId: null,
      widgets: [],
      selectedWidgetId: null,
      filters: {
        dateRange: 'all',
      },
      dashboardName: 'Untitled Dashboard',
      orders: [],
      toast: null,
      theme: 'default',
      isAIPanelOpen: false,

      setWidgets: (widgets) => set({ widgets }),

      addWidget: (type) => {
        const id = `widget-${Date.now()}`;
        const newWidget: Widget = {
          id,
          type,
          title: `New ${type.toUpperCase()}`,
          config: {
            aggregation: 'sum',
            metric: 'totalAmount',
            color: '#3b82f6',
            showLabels: true,
          },
          position: { x: 0, y: 0, w: 4, h: 4 },
        };
        set((state) => ({ 
          widgets: [...state.widgets, newWidget],
          toast: { message: `${type.toUpperCase()} widget added`, type: 'info' }
        }));
      },

      updateWidget: (id, updates) => {
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },

      deleteWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
          toast: { message: 'Widget deleted', type: 'error' }
        }));
      },

      setSelectedWidget: (id) => set({ selectedWidgetId: id }),

      setFilters: (filters) => set({ filters }),

      setDashboardName: (name) => set({ dashboardName: name }),

      setToast: (toast) => set({ toast }),

      saveDashboard: async () => {
        const { widgets, currentDashboardId, dashboardName } = get();
        const data = {
          name: dashboardName,
          widgets,
          layout: widgets.map(w => ({ i: w.id, ...w.position })),
          filters: get().filters,
        };

        try {
          if (currentDashboardId) {
            await api.dashboards.update(currentDashboardId, data);
          } else {
            const res = await api.dashboards.create(data);
            set({ currentDashboardId: res.data._id });
          }
          await get().fetchDashboards();
          set({ toast: { message: 'Dashboard saved successfully', type: 'success' } });
        } catch (err) {
          console.error('Failed to save dashboard', err);
          set({ toast: { message: 'Failed to save dashboard', type: 'error' } });
        }
      },

      loadDashboard: async (id) => {
        try {
          const res = await api.dashboards.getById(id);
          set({ 
            widgets: res.data.widgets, 
            currentDashboardId: id,
            dashboardName: res.data.name || 'Untitled Dashboard',
            filters: res.data.filters || { dateRange: 'all' }
          });
        } catch (err) {
          console.error('Failed to load dashboard', err);
        }
      },

      fetchDashboards: async () => {
        try {
          const res = await api.dashboards.getAll();
          set({ dashboards: res.data });
        } catch (err) {
          console.error('Failed to fetch dashboards', err);
        }
      },

      resetDashboard: () => {
        set({
          widgets: [],
          currentDashboardId: null,
          selectedWidgetId: null,
          dashboardName: 'Untitled Dashboard',
          filters: { dateRange: 'all' }
        });
      },

      deleteDashboard: async (id) => {
        try {
          await api.dashboards.delete(id);
          await get().fetchDashboards();
          set({ toast: { message: 'Dashboard deleted successfully', type: 'success' } });
        } catch (err) {
          console.error('Failed to delete dashboard', err);
          set({ toast: { message: 'Failed to delete dashboard', type: 'error' } });
        }
      },

      fetchOrders: async () => {
        try {
          const res = await api.orders.getAll();
          set({ orders: res.data });
        } catch (err) {
          console.error('Failed to fetch orders', err);
        }
      },

      createOrder: async (order) => {
        try {
          await api.orders.create(order);
          await get().fetchOrders();
          set({ toast: { message: 'Order created successfully', type: 'success' } });
        } catch (err) {
          console.error('Failed to create order', err);
          set({ toast: { message: 'Failed to create order', type: 'error' } });
        }
      },

      updateOrder: async (id, order) => {
        try {
          await api.orders.update(id, order);
          await get().fetchOrders();
          set({ toast: { message: 'Order updated successfully', type: 'success' } });
        } catch (err) {
          console.error('Failed to update order', err);
          set({ toast: { message: 'Failed to update order', type: 'error' } });
        }
      },

      deleteOrder: async (id) => {
        try {
          await api.orders.delete(id);
          await get().fetchOrders();
          set({ toast: { message: 'Order deleted successfully', type: 'success' } });
        } catch (err) {
          console.error('Failed to delete order', err);
          set({ toast: { message: 'Failed to delete order', type: 'error' } });
        }
      },

      setTheme: (theme) => set({ theme }),
      setAIPanelOpen: (isOpen) => set({ isAIPanelOpen: isOpen }),
    }),
    {
      name: 'halleyx-storage',
    }
  )
);
