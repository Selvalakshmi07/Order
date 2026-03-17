import React from 'react';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, X, Type, Palette, Layout as LayoutIcon, Database, SlidersHorizontal } from 'lucide-react';

// ─── Config options ──────────────────────────────────────────────
const METRICS = [
  { value: 'totalAmount', label: 'Total Revenue' },
  { value: 'count', label: 'Total Orders' },
  { value: 'avgAmount', label: 'Avg Order Value' },
  { value: 'quantity', label: 'Total Quantity' },
];

const AGGREGATIONS = ['Sum', 'Average', 'Count', 'Max', 'Min'];
const SORTING_OPTIONS = ['None', 'Ascending', 'Descending'];

const TABLE_COLUMNS = [
  { value: 'orderId', label: 'Order ID' },
  { value: 'customerName', label: 'Customer Name' },
  { value: 'product', label: 'Product' },
  { value: 'quantity', label: 'Quantity' },
  { value: 'unitPrice', label: 'Unit Price' },
  { value: 'totalAmount', label: 'Total Amount' },
  { value: 'status', label: 'Status' },
  { value: 'createdBy', label: 'Created By' },
];

const PIE_CATEGORIES = [
  { value: 'status', label: 'Order Status' },
  { value: 'product', label: 'Product' },
  { value: 'country', label: 'Country' },
];

// ─── Reusable sub-components ─────────────────────────────────────
const SectionTitle: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-2">
    {icon}
    {label}
  </div>
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] text-muted-foreground px-1 block mb-1">{children}</label>
);

const Select: React.FC<{
  value: string;
  options: Array<{ value: string; label: string } | string>;
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-8 px-2 text-xs border rounded-md focus:ring-1 focus:ring-primary outline-none bg-white"
  >
    {options.map((o) => {
      const val = typeof o === 'string' ? o : o.value;
      const label = typeof o === 'string' ? o : o.label;
      return <option key={val} value={val}>{label}</option>;
    })}
  </select>
);

// ─── Main Component ───────────────────────────────────────────────
const SettingsSidebar: React.FC = () => {
  const { selectedWidgetId, widgets, updateWidget, setSelectedWidget } = useStore();
  const widget = widgets.find((w) => w.id === selectedWidgetId);

  if (!selectedWidgetId || !widget) return null;

  const cfg = widget.config;
  const update = (patch: object) =>
    updateWidget(widget.id, { config: { ...cfg, ...patch } });

  // default columns if not set
  const selectedColumns: string[] = cfg.columns || ['orderId', 'customerName', 'product', 'quantity', 'totalAmount', 'status'];

  const toggleColumn = (col: string) => {
    const next = selectedColumns.includes(col)
      ? selectedColumns.filter((c) => c !== col)
      : [...selectedColumns, col];
    update({ columns: next });
  };

  return (
    <aside className="w-72 border-l bg-white flex flex-col shadow-2xl relative z-30 h-full">
      {/* ── Header ── */}
      <div className="p-4 border-b flex items-center justify-between bg-secondary/10">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Widget configuration</span>
        </div>
        <button
          onClick={() => setSelectedWidget(null)}
          className="p-1 hover:bg-secondary rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* ── Basic Info ── */}
        <section>
          <SectionTitle icon={<Type className="w-3 h-3" />} label="Basic Info" />
          <div className="space-y-3">
            <div>
              <FieldLabel>Widget Title</FieldLabel>
              <input
                type="text"
                value={widget.title}
                onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                className="w-full h-8 px-2 text-xs border rounded-md focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ── Data Source ── */}
        <section>
          <SectionTitle icon={<Database className="w-3 h-3" />} label="Data source" />
          <div className="space-y-3">
            <div>
              <FieldLabel>Source API</FieldLabel>
              <div className="h-8 px-2 text-xs border rounded-md bg-slate-50 flex items-center text-slate-500 font-mono">
                /api/orders
              </div>
            </div>

            {widget.type !== 'table' && (
              <div>
                <FieldLabel>Metric</FieldLabel>
                <Select
                  value={cfg.metric || 'totalAmount'}
                  options={METRICS}
                  onChange={(v) => update({ metric: v })}
                />
              </div>
            )}

            {(widget.type === 'kpi') && (
              <div>
                <FieldLabel>Format</FieldLabel>
                <Select
                  value={cfg.format || 'number'}
                  options={[
                    { value: 'number', label: 'Number' },
                    { value: 'currency', label: 'Currency ($)' },
                  ]}
                  onChange={(v) => update({ format: v })}
                />
              </div>
            )}

            {widget.type !== 'table' && widget.type !== 'kpi' && widget.type !== 'pie' && (
              <div>
                <FieldLabel>Aggregation</FieldLabel>
                <Select
                  value={cfg.aggregation || 'Sum'}
                  options={AGGREGATIONS}
                  onChange={(v) => update({ aggregation: v })}
                />
              </div>
            )}

            {widget.type === 'pie' && (
              <div>
                <FieldLabel>Category field</FieldLabel>
                <Select
                  value={cfg.pieCategory || 'status'}
                  options={PIE_CATEGORIES}
                  onChange={(v) => update({ pieCategory: v })}
                />
              </div>
            )}
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ── Style & Color ── */}
        <section>
          <SectionTitle icon={<Palette className="w-3 h-3" />} label="Style & Color" />
          <div>
            <FieldLabel>Primary Color</FieldLabel>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cfg.color || '#3b82f6'}
                onChange={(e) => update({ color: e.target.value })}
                className="w-8 h-8 rounded border overflow-hidden cursor-pointer"
              />
              <input
                type="text"
                value={cfg.color || '#3b82f6'}
                onChange={(e) => update({ color: e.target.value })}
                className="flex-1 h-8 px-2 text-xs border rounded-md uppercase"
              />
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* ── Configuration ── */}
        <section>
          <SectionTitle icon={<SlidersHorizontal className="w-3 h-3" />} label="Configuration" />
          <div className="space-y-3">

            {/* Bar / Line / Area sorting */}
            {(widget.type === 'bar' || widget.type === 'line' || widget.type === 'area') && (
              <>
                <div>
                  <FieldLabel>Bar sorting</FieldLabel>
                  <Select
                    value={cfg.sorting || 'None'}
                    options={SORTING_OPTIONS}
                    onChange={(v) => update({ sorting: v })}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cfg.showLabels !== false}
                    onChange={(e) => update({ showLabels: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-primary accent-primary"
                  />
                  <span className="text-[11px] text-muted-foreground">Show X-Axis Labels</span>
                </label>
              </>
            )}

            {/* Pie legend */}
            {widget.type === 'pie' && (
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cfg.showLegend !== false}
                    onChange={(e) => update({ showLegend: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-primary accent-primary"
                  />
                  <span className="text-[11px] text-muted-foreground">Show Legend</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cfg.innerRing === true}
                    onChange={(e) => update({ innerRing: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-primary accent-primary"
                  />
                  <span className="text-[11px] text-muted-foreground">Donut style</span>
                </label>
              </>
            )}

            {/* Table column configuration */}
            {widget.type === 'table' && (
              <div>
                <FieldLabel>Import key (columns)</FieldLabel>
                <div className="space-y-1.5 mt-1">
                  {TABLE_COLUMNS.map((col) => (
                    <label key={col.value} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col.value)}
                        onChange={() => toggleColumn(col.value)}
                        className="w-3.5 h-3.5 rounded border-primary accent-primary"
                      />
                      <span className="text-[11px] text-muted-foreground">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sync filter — all widget types */}
            <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={cfg.syncFilter !== false}
                onChange={(e) => update({ syncFilter: e.target.checked })}
                className="w-3.5 h-3.5 rounded border-primary accent-primary"
              />
              <span className="text-[11px] text-muted-foreground">Sync filter</span>
            </label>

          </div>
        </section>

        {/* ── Layout hint ── */}
        <section>
          <SectionTitle icon={<LayoutIcon className="w-3 h-3" />} label="Layout" />
          <div className="text-[10px] text-muted-foreground bg-slate-50 rounded-md p-2 border">
            Drag the widget corners on the canvas to resize it.
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <div className="p-4 border-t bg-secondary/5 flex gap-2">
        <button
          onClick={() => setSelectedWidget(null)}
          className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-md hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => setSelectedWidget(null)}
          className="flex-1 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          Save
        </button>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
