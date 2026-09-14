import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2, Users, DollarSign, TrendingUp, Activity,
  Settings, Layout, FileText, ChevronRight, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { REVENUE_DATA, OCCUPANCY_BY_HOUR } from '../data/mockData';

type DashTab = 'overview' | 'layout' | 'slots' | 'reports';

interface SlotBlock {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'car' | 'bike' | 'ev' | 'accessible' | 'wall' | 'road';
  status?: 'free' | 'occupied';
}

const LIVE_FEED = [
  { time: '10:14 AM', plate: 'KA 05 AB 4321', type: 'entry', slot: 'B1-A04' },
  { time: '10:11 AM', plate: 'MH 12 DE 5567', type: 'exit', slot: 'G-C07', amount: '₹80' },
  { time: '10:09 AM', plate: 'TN 07 BX 9988', type: 'entry', slot: 'B1-B02' },
  { time: '10:06 AM', plate: 'KA 51 S 8890', type: 'exit', slot: 'G-A12', amount: '₹30' },
  { time: '10:02 AM', plate: 'DL 01 EA 4567', type: 'entry', slot: 'B2-D06' },
];

const INITIAL_LAYOUT: SlotBlock[] = [
  { id: 'w1', label: '', x: 0, y: 0, w: 12, h: 1, type: 'wall' },
  { id: 'r1', label: 'AISLE A', x: 1, y: 1, w: 10, h: 1, type: 'road' },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `a${i}`, label: `A-${String(i+1).padStart(2,'0')}`, x: i+1, y: 2, w: 1, h: 1, type: 'car' as const, status: (i%3===0 ? 'occupied' : 'free') as 'free'|'occupied' })),
  { id: 'r2', label: 'AISLE B', x: 1, y: 4, w: 10, h: 1, type: 'road' },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `b${i}`, label: `B-${String(i+1).padStart(2,'0')}`, x: i+1, y: 5, w: 1, h: 1, type: (i < 2 ? 'ev' : i===7 ? 'accessible' : 'car') as SlotBlock['type'], status: (i%4===0 ? 'occupied' : 'free') as 'free'|'occupied' })),
  { id: 'r3', label: 'AISLE C', x: 1, y: 7, w: 10, h: 1, type: 'road' },
  ...Array.from({ length: 8 }, (_, i) => ({ id: `c${i}`, label: `C-${String(i+1).padStart(2,'0')}`, x: i+1, y: 8, w: 1, h: 1, type: (i > 5 ? 'bike' : 'car') as SlotBlock['type'], status: (i%5===0 ? 'occupied' : 'free') as 'free'|'occupied' })),
  { id: 'w2', label: '', x: 0, y: 10, w: 12, h: 1, type: 'wall' },
];

const SLOT_COLORS: Record<string, string> = {
  car: '#4B5563',
  bike: '#F59E0B',
  ev: '#15803D',
  accessible: '#3B5BFF',
  wall: '#CBD5E1',
  road: '#E2E8F0',
};

function LayoutDesigner() {
  const [layout, setLayout] = useState(INITIAL_LAYOUT);
  const [selected, setSelected] = useState<string | null>(null);
  const [tool, setTool] = useState<SlotBlock['type']>('car');

  const gridCols = 12;
  const gridRows = 11;

  const handleCellClick = (x: number, y: number) => {
    const existing = layout.find(b => b.x === x && b.y === y);
    if (existing) {
      setSelected(existing.id === selected ? null : existing.id);
    } else if (tool !== 'road' && tool !== 'wall') {
      const newBlock: SlotBlock = {
        id: `custom-${Date.now()}`,
        label: `X-${layout.filter(b => b.type === tool).length + 1}`,
        x, y, w: 1, h: 1, type: tool,
        status: 'free',
      };
      setLayout(prev => [...prev, newBlock]);
    }
  };

  const selectedBlock = layout.find(b => b.id === selected);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm text-[#6B7280]">Tool:</span>
        {(['car', 'bike', 'ev', 'accessible', 'wall', 'road'] as SlotBlock['type'][]).map(t => (
          <button
            key={t}
            onClick={() => setTool(t)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
              tool === t ? 'border-[#3B5BFF] text-[#3B5BFF] bg-[#3B5BFF]/10' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#3B5BFF]/40 bg-white'
            }`}
          >
            <div className="w-3 h-3 rounded-sm" style={{ background: SLOT_COLORS[t] }} />
            {t}
          </button>
        ))}
        <button
          onClick={() => selected && setLayout(prev => prev.filter(b => b.id !== selected))}
          disabled={!selected}
          className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#EF4444]/30 text-[#EF4444] disabled:opacity-30 hover:bg-[#EF4444]/10 transition-all bg-white"
        >
          Delete selected
        </button>
      </div>

      <div className="relative overflow-auto">
        <div
          className="grid gap-1 w-fit mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, 52px)`,
            gridTemplateRows: `repeat(${gridRows}, 36px)`,
          }}
        >
          {Array.from({ length: gridRows }, (_, row) =>
            Array.from({ length: gridCols }, (_, col) => {
              const block = layout.find(b => b.x === col && b.y === row);
              const isSelected = block?.id === selected;

              if (!block) {
                return (
                  <div
                    key={`${col}-${row}`}
                    onClick={() => handleCellClick(col, row)}
                    className="border border-dashed border-[#E5E7EB] rounded cursor-pointer hover:border-[#3B5BFF]/50 hover:bg-[#3B5BFF]/05 transition-all bg-[#FAFAFA]"
                    style={{ gridColumn: col + 1, gridRow: row + 1 }}
                  />
                );
              }

              if (block.type === 'road') {
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelected(block.id === selected ? null : block.id)}
                    className="flex items-center justify-center"
                    style={{
                      gridColumn: `${block.x + 1} / span ${block.w}`,
                      gridRow: block.y + 1,
                      background: '#F1F3F6',
                      border: '1px solid #E5E7EB',
                      borderRadius: '4px',
                    }}
                  >
                    <span className="text-[8px] tracking-widest text-[#9CA3AF] font-bold">{block.label}</span>
                  </div>
                );
              }

              if (block.type === 'wall') {
                return (
                  <div
                    key={block.id}
                    style={{
                      gridColumn: `${block.x + 1} / span ${block.w}`,
                      gridRow: block.y + 1,
                      background: '#CBD5E1',
                      border: '1px solid #94A3B8',
                      borderRadius: '4px',
                    }}
                  />
                );
              }

              return (
                <div
                  key={block.id}
                  onClick={() => setSelected(block.id === selected ? null : block.id)}
                  className="flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded transition-all"
                  style={{
                    gridColumn: block.x + 1,
                    gridRow: block.y + 1,
                    background: block.status === 'occupied'
                      ? `${SLOT_COLORS[block.type]}15`
                      : `${SLOT_COLORS[block.type]}25`,
                    border: isSelected
                      ? '2px solid #3B5BFF'
                      : block.status === 'occupied'
                      ? `1px solid ${SLOT_COLORS[block.type]}50`
                      : `1px solid ${SLOT_COLORS[block.type]}80`,
                    opacity: block.status === 'occupied' ? 0.65 : 1,
                    boxShadow: isSelected ? '0 0 10px rgba(59,91,255,0.35)' : undefined,
                  }}
                >
                  {block.type === 'ev' && <Zap size={8} color={SLOT_COLORS['ev']} />}
                  {block.type === 'accessible' && <span style={{ fontSize: '8px' }}>♿</span>}
                  <span style={{ fontSize: '7px', fontFamily: 'Space Grotesk', fontWeight: 700, color: SLOT_COLORS[block.type] }}>
                    {block.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected block info */}
      {selectedBlock && selectedBlock.type !== 'wall' && selectedBlock.type !== 'road' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-4 p-4 rounded-xl"
          style={{ background: '#FFFFFF', border: '1px solid #3B5BFF', boxShadow: '0 2px 8px rgba(59,91,255,0.08)' }}
        >
          <div className="w-3 h-3 rounded-sm" style={{ background: SLOT_COLORS[selectedBlock.type] }} />
          <span className="font-bold text-[#111827]">{selectedBlock.label}</span>
          <span className="text-xs text-[#6B7280] capitalize">{selectedBlock.type} bay</span>
          <span className={`text-xs font-semibold ${selectedBlock.status === 'occupied' ? 'text-[#F59E0B]' : 'text-[#15803D]'}`}>
            {selectedBlock.status === 'occupied' ? '● Occupied' : '● Free'}
          </span>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {Object.entries(SLOT_COLORS).filter(([k]) => !['wall', 'road'].includes(k)).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border" style={{ background: `${v}20`, borderColor: `${v}60` }} />
            <span className="text-[10px] text-[#6B7280] capitalize font-medium">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<DashTab>('overview');
  const [showListModal, setShowListModal] = useState(false);
  const [activeVenue, setActiveVenue] = useState('Phoenix Marketcity');
  const [listedVenues, setListedVenues] = useState([
    'Phoenix Marketcity',
    'Lulu Mall',
    'Manipal Hospital',
  ]);
  const [newLotName, setNewLotName] = useState('');
  const [newLotAddress, setNewLotAddress] = useState('');
  const [newLotSlots, setNewLotSlots] = useState(120);
  const [newLotRate, setNewLotRate] = useState(40);
  const [notification, setNotification] = useState<string | null>(null);

  const handleListLotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotName.trim()) return;
    const name = newLotName.trim();
    setListedVenues(prev => [...prev, name]);
    setActiveVenue(name);
    setShowListModal(false);
    setNewLotName('');
    setNewLotAddress('');
    setNotification(`Successfully registered "${name}". Sensors and ANPR gateway initialized.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'layout', label: 'Layout Designer', icon: Layout },
    { id: 'slots', label: 'Slots & Pricing', icon: Settings },
    { id: 'reports', label: 'Reports', icon: FileText },
  ] as const;

  const OCCUPANCY_DATA = [
    { name: 'Car', value: 68, color: '#3B5BFF' },
    { name: 'Bike', value: 14, color: '#F59E0B' },
    { name: 'EV', value: 12, color: '#22C55E' },
    { name: 'Empty', value: 6, color: '#E5E7EB' },
  ];

  const QUICK_STATS = [
    { label: 'Live Occupancy', val: '94%', delta: '+3%', up: true, icon: Activity },
    { label: "Today's Revenue", val: '₹48,300', delta: '+12% vs yesterday', up: true, icon: DollarSign },
    { label: 'Vehicles In', val: '198', delta: '-8 vs avg', up: false, icon: Users },
    { label: 'Avg Duration', val: '2.4h', delta: '+0.2h', up: true, icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-16">
        {/* Top Lot Management Bar */}
        <div
          className="flex items-center justify-between mb-8 pb-6 flex-wrap gap-4 border-b border-[#E5E7EB]"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs text-[#6B7280] font-medium">Active Facility:</span>
              <select
                value={activeVenue}
                onChange={e => setActiveVenue(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#111827',
                  outline: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(16,24,40,0.05)',
                }}
              >
                {listedVenues.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="pulse-dot bg-[#22C55E]" style={{ width: '6px', height: '6px' }} />
              <span className="text-xs text-[#15803D] font-medium">IoT telemetry synced · ANPR cameras online</span>
            </div>
          </div>

          <button
            id="dashboard-list-new-lot-btn"
            onClick={() => setShowListModal(true)}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              color: '#fff',
              background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px', // standard button: 12px/24px
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'filter 0.15s ease',
              boxShadow: '0 2px 8px rgba(59, 91, 255, 0.25)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1)'; }}
          >
            + List a new lot
          </button>
        </div>

        {/* Success Notification */}
        {notification && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center justify-between"
            style={{
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              color: '#15803D',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            <span>✓ {notification}</span>
            <button
              onClick={() => setNotification(null)}
              style={{ background: 'none', border: 'none', color: '#15803D', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Two-Column Grid: Sidebar on left (3 cols), Main Workspace on right (9 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-[#6B7280] mb-3 px-2">Management</p>
              {TABS.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as DashTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                      tab === t.id ? 'text-[#3B5BFF] font-semibold' : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F3F6]'
                    }`}
                    style={tab === t.id ? { background: 'rgba(59, 91, 255, 0.08)', color: '#3B5BFF' } : {}}
                  >
                    <Icon size={16} />
                    {t.label}
                    {tab === t.id && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>

            <div
              className="rounded-2xl p-6 bg-white border border-[#E5E7EB] shadow-sm"
            >
              <p className="text-xs font-semibold text-[#111827] mb-1">{activeVenue}</p>
              <p className="text-xs text-[#6B7280]">Floor B1 — 1,200 total slots</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="pulse-dot bg-[#22C55E]" style={{ width: '8px', height: '8px' }} />
                <span className="text-xs text-[#15803D] font-medium">Telemetry Synced</span>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-9 space-y-8">

          {/* Tab bar mobile */}
          <div className="flex gap-2 mb-6 lg:hidden overflow-x-auto pb-2">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as DashTab)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full whitespace-nowrap border transition-all ${
                    tab === t.id ? 'border-[#3B5BFF] text-[#3B5BFF] bg-[#3B5BFF]/10' : 'border-[#E5E7EB] bg-white text-[#6B7280]'
                  }`}
                >
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display font-bold text-2xl text-[#111827] mb-6">Dashboard Overview</h1>

              {/* Quick stat cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {QUICK_STATS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon size={16} color="#6B7280" />
                        <div className={`flex items-center gap-1 text-[10px] font-semibold ${s.up ? 'text-[#15803D]' : 'text-[#F59E0B]'}`}>
                          {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {s.delta}
                        </div>
                      </div>
                      <p className="font-display font-bold text-2xl text-[#111827] mb-0.5">{s.val}</p>
                      <p className="text-xs text-[#6B7280]">{s.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-3 gap-5 mb-5">
                {/* Revenue chart */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-semibold text-[#111827]">Revenue (Last 7 Days)</h2>
                    <span className="text-xs text-[#15803D] font-semibold">▲ 14.2%</span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B5BFF" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#3B5BFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }}
                        formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3B5BFF" strokeWidth={2} fill="url(#revenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Occupancy donut */}
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-5">
                  <h2 className="font-display font-semibold text-[#111827] mb-5">Live Occupancy</h2>
                  <div className="relative flex justify-center">
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie
                          data={OCCUPANCY_DATA}
                          cx="50%" cy="50%"
                          innerRadius={42} outerRadius={64}
                          strokeWidth={0}
                          dataKey="value"
                        >
                          {OCCUPANCY_DATA.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="font-bold text-2xl text-[#111827]">94%</p>
                        <p className="text-[10px] text-[#6B7280]">full</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    {OCCUPANCY_DATA.map(d => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                          <span className="text-xs text-[#6B7280]">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#111827]">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hourly occupancy + live feed */}
              <div className="grid lg:grid-cols-2 gap-5">
                {/* Hourly bar chart */}
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-5">
                  <h2 className="font-display font-semibold text-[#111827] mb-4">Occupancy by Hour (Today)</h2>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={OCCUPANCY_BY_HOUR} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }}
                        formatter={v => [`${v}%`, 'Occupancy']}
                      />
                      <Bar dataKey="occupancy" fill="#3B5BFF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Live feed */}
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display font-semibold text-[#111827]">Live Entry/Exit</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="pulse-dot bg-[#22C55E]" style={{ width: '6px', height: '6px' }} />
                      <span className="text-xs text-[#15803D] font-medium">Live</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {LIVE_FEED.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i < LIVE_FEED.length - 1 ? '1px solid #F1F3F6' : undefined }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: ev.type === 'entry' ? '#22C55E' : '#F59E0B' }}
                        />
                        <span className="text-[10px] text-[#6B7280] w-16 flex-shrink-0">{ev.time}</span>
                        <span className="kiosk-plate text-xs font-bold text-[#111827] flex-1">{ev.plate}</span>
                        <span className={`text-xs font-semibold ${ev.type === 'entry' ? 'text-[#15803D]' : 'text-[#F59E0B]'}`}>
                          {ev.type === 'entry' ? '→ IN' : '← OUT'}
                        </span>
                        <span className="text-xs text-[#6B7280]">{ev.slot}</span>
                        {ev.amount && <span className="text-xs font-semibold text-[#111827]">{ev.amount}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LAYOUT DESIGNER */}
          {tab === 'layout' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display font-bold text-2xl text-[#111827]">Visual Layout Designer</h1>
                  <p className="text-sm text-[#6B7280] mt-1">Floor B1 — Click empty cells to place slots. Select to delete.</p>
                </div>
                <button
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all"
                  style={{ background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)' }}
                >
                  Save Layout
                </button>
              </div>
              <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 overflow-x-auto">
                <LayoutDesigner />
              </div>
            </motion.div>
          )}

          {/* SLOTS & PRICING */}
          {tab === 'slots' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display font-bold text-2xl text-[#111827] mb-6">Slots & Pricing</h1>
              <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <p className="text-sm font-semibold text-[#111827]">All Slots (Floor B1)</p>
                  <div className="flex gap-2">
                    {['All', 'Available', 'Occupied', 'EV'].map(f => (
                      <button key={f} className="text-xs px-3 py-1.5 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:border-[#3B5BFF] hover:text-[#3B5BFF] bg-[#F7F8FA] transition-all">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F7F8FA' }}>
                        {['Slot', 'Type', 'Status', 'Rate/hr', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 12 }, (_, i) => {
                        const slotLabel = `${String.fromCharCode(65 + Math.floor(i/4))}-${String((i%4)+1).padStart(2,'0')}`;
                        const types = ['car', 'car', 'ev', 'accessible', 'car', 'bike', 'car', 'car', 'ev', 'car', 'car', 'bike'];
                        const statuses = ['available', 'occupied', 'available', 'available', 'occupied', 'available', 'available', 'occupied', 'available', 'available', 'occupied', 'available'];
                        const rates = [40, 40, 45, 35, 40, 25, 40, 40, 45, 40, 40, 25];
                        const t = types[i];
                        const s = statuses[i];
                        const r = rates[i];
                        return (
                          <tr key={i} className="hover:bg-[#F7F8FA] transition-colors" style={{ borderBottom: '1px solid #F1F3F6' }}>
                            <td className="px-5 py-3 font-bold text-[#111827] font-mono">{slotLabel}</td>
                            <td className="px-5 py-3 capitalize text-[#6B7280]">{t}</td>
                            <td className="px-5 py-3">
                              <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                                style={{
                                  background: s === 'available' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                                  color: s === 'available' ? '#15803D' : '#D97706',
                                }}
                              >
                                {s}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[#111827] font-medium">₹{r}</span>
                                <input
                                  type="range" min="10" max="200" defaultValue={r}
                                  className="w-16 h-1 accent-blue-600"
                                />
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <button className="text-xs font-medium text-[#3B5BFF] hover:underline">Edit</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS */}
          {tab === 'reports' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-display font-bold text-2xl text-[#111827] mb-6">Revenue Reports</h1>
              <div className="grid gap-5">
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-semibold text-[#111827]">Revenue vs Bookings (Sep 2026)</h2>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#3B5BFF]" /><span className="text-[#6B7280] font-medium">Revenue</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#00C2A8]" /><span className="text-[#6B7280] font-medium">Bookings</span></div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={REVENUE_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px', color: '#111827', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }} />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B5BFF" strokeWidth={2.5} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#00C2A8" strokeWidth={2} dot={false} strokeDasharray="4 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary table */}
                <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
                  <h2 className="font-display font-semibold text-[#111827] mb-5">Daily Summary</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F7F8FA' }}>
                        {['Date', 'Bookings', 'Revenue', 'Avg Duration', 'Peak Occupancy'].map(h => (
                          <th key={h} className="text-left py-3 px-3 text-xs text-[#6B7280] font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {REVENUE_DATA.map((d, i) => (
                        <tr key={i} className="hover:bg-[#F7F8FA] transition-colors" style={{ borderBottom: '1px solid #F1F3F6' }}>
                          <td className="py-3 px-3 text-[#111827] font-medium">{d.date}</td>
                          <td className="py-3 px-3 text-[#6B7280]">{d.bookings}</td>
                          <td className="py-3 px-3 font-semibold text-[#111827]">₹{d.revenue.toLocaleString()}</td>
                          <td className="py-3 px-3 text-[#6B7280]">{(2 + Math.random() * 1).toFixed(1)}h</td>
                          <td className="py-3 px-3">
                            <span className="text-xs font-semibold text-[#F59E0B]">{80 + Math.floor(Math.random() * 18)}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>

      {/* List Your Lot Modal */}
      {showListModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(17, 24, 39, 0.45)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-xl rounded-2xl p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 20px 48px rgba(16, 24, 40, 0.16)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
              <div>
                <h2 className="font-display font-bold text-xl text-[#111827] m-0">List Your Parking Lot</h2>
                <p className="font-sans text-xs text-[#6B7280] mt-1 m-0">
                  Connect your cameras, gates, and bays to the ParkEZ network in 3 minutes.
                </p>
              </div>
              <button
                onClick={() => setShowListModal(false)}
                style={{
                  background: '#F1F3F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  color: '#6B7280',
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleListLotSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">Facility / Lot Name *</label>
                <input
                  required
                  placeholder="e.g. Indiranagar 100ft Road Car Park"
                  value={newLotName}
                  onChange={e => setNewLotName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '10px 16px', // form input spec
                    color: '#111827',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">City & Area *</label>
                  <input
                    placeholder="e.g. Bengaluru — East"
                    value={newLotAddress}
                    onChange={e => setNewLotAddress(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: '#111827',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">Total Capacity (Slots)</label>
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={newLotSlots}
                    onChange={e => setNewLotSlots(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: '#111827',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">Base Hourly Rate (₹)</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newLotRate}
                    onChange={e => setNewLotRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: '#111827',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-2">Gate Hardware Type</label>
                  <select
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: '#111827',
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="anpr">ANPR Edge Camera + Boom Barrier</option>
                    <option value="fastag">FASTag NETC Toll Reader</option>
                    <option value="kiosk">QR Entry / Exit Kiosk</option>
                    <option value="manual">Manual Attendant App</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-[#6B7280] mb-2">Included Systems</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {[
                    '✓ ANPR 2-second recognition',
                    '✓ FASTag NETC auto-exit',
                    '✓ Real-time occupancy feed',
                    '✓ Dynamic surge pricing',
                  ].map(feature => (
                    <span
                      key={feature}
                      className="text-xs px-3 py-1 rounded-md"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#15803D' }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#6B7280',
                    background: '#F7F8FA',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '12px 24px', // standard button: 12px 24px
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#fff',
                    background: 'linear-gradient(135deg, #3B5BFF, #00C2A8)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px', // standard button: 12px 24px
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(59,91,255,0.25)',
                  }}
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
