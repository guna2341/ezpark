import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Settings, Layout, FileText, ChevronRight, Zap,
  ArrowRight,
  DollarSign, Activity, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { useDemoAuth } from '../context/DemoAuthContext';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { REVENUE_DATA } from '../data/mockData';

type DashTab = 'overview' | 'layout' | 'slots' | 'reports';

// Real varying 7-day revenue dataset requested by user
const SEVEN_DAY_REVENUE = [
  { day: 'Sep 10', revenue: 14200, label: '₹14,200' },
  { day: 'Sep 11', revenue: 16800, label: '₹16,800' },
  { day: 'Sep 12', revenue: 15100, label: '₹15,100' },
  { day: 'Sep 13', revenue: 19300, label: '₹19,300' },
  { day: 'Sep 14', revenue: 22600, label: '₹22,600' },
  { day: 'Sep 15', revenue: 24900, label: '₹24,900' },
  { day: 'Sep 16', revenue: 18420, label: '₹18,420' },
];

// Per-location live occupancy breakdown
const LOCATION_BREAKDOWN = [
  { id: 'loc-1', name: 'Phoenix Marketcity, Whitefield', occupied: 156, total: 200, percent: 78, type: 'Commercial Mall', status: 'Normal' },
  { id: 'loc-2', name: 'Forum Mall, Koramangala', occupied: 142, total: 180, percent: 79, type: 'Retail Hub', status: 'Peak Surge (+15%)' },
  { id: 'loc-3', name: 'Manipal Hospital, HAL Airport Rd', occupied: 48, total: 60, percent: 80, type: 'Hospital Priority', status: 'Emergency Reserved' },
];

// 6-8 real live activity feed items requested by user
const OWNER_LIVE_FEED_ITEMS = [
  { id: 'f1', plate: 'KA 05 AB 4321', text: 'entered Slot B-14', time: '2 min ago', type: 'entry' as const, fee: null, note: 'ANPR Matched' },
  { id: 'f2', plate: 'MH 12 CD 5678', text: 'exited Slot A-02 — ₹120 charged via FASTag', time: '5 min ago', type: 'exit' as const, fee: '₹120', note: 'FASTag NETC Auto-debit' },
  { id: 'f3', plate: 'DL 3C GH 9081', text: 'payment failed, fallback to UPI link sent', time: '14 min ago', type: 'alert' as const, fee: '₹110', note: 'Fallback SMS Sent' },
  { id: 'f4', plate: 'KA 51 S 8890', text: 'entered Slot B-07 (Royal Enfield Classic)', time: '18 min ago', type: 'entry' as const, fee: null, note: 'Two-Wheeler Bay' },
  { id: 'f5', plate: 'TN 07 BX 9988', text: 'exited Slot EV-03 — ₹240 charged (Parking + EV Fast Charge)', time: '26 min ago', type: 'exit' as const, fee: '₹240', note: 'FASTag + EV Surcharge' },
  { id: 'f6', plate: 'KA 03 MM 1122', text: 'entered Slot C-12 (Kia Seltos)', time: '31 min ago', type: 'entry' as const, fee: null, note: 'Barrier Cleared' },
  { id: 'f7', plate: 'TS 08 EF 3411', text: 'exited Slot A-15 — ₹80 charged via FASTag', time: '42 min ago', type: 'exit' as const, fee: '₹80', note: 'FASTag Cleared' },
  { id: 'f8', plate: 'KA 04 NM 2219', text: 'entered Slot B-09 — Reserved Pass App', time: '55 min ago', type: 'entry' as const, fee: null, note: 'Pre-booked Slot' },
];

// Recent Transactions Table (6-8 rows)
const RECENT_TRANSACTIONS = [
  { id: 'tx-1', time: '10:11 AM', plate: 'MH 12 CD 5678', slot: 'Slot A-02', duration: '2h 15m', amount: '₹120', method: 'FASTag NETC', status: 'Settled' },
  { id: 'tx-2', time: '09:54 AM', plate: 'TN 07 BX 9988', slot: 'Slot EV-03', duration: '3h 10m', amount: '₹240', method: 'FASTag + EV', status: 'Settled' },
  { id: 'tx-3', time: '09:38 AM', plate: 'TS 08 EF 3411', slot: 'Slot A-15', duration: '1h 45m', amount: '₹80', method: 'FASTag NETC', status: 'Settled' },
  { id: 'tx-4', time: '09:20 AM', plate: 'KA 01 MJ 7741', slot: 'Slot B-09', duration: '4h 00m', amount: '₹160', method: 'FASTag NETC', status: 'Settled' },
  { id: 'tx-5', time: '08:55 AM', plate: 'KA 05 MN 9012', slot: 'Slot B-04', duration: '1h 20m', amount: '₹60', method: 'UPI Auto-pay', status: 'Settled' },
  { id: 'tx-6', time: '08:30 AM', plate: 'DL 3C GH 9081', slot: 'Slot C-05', duration: '2h 45m', amount: '₹110', method: 'UPI Link SMS', status: 'Pending Link' },
  { id: 'tx-7', time: '08:12 AM', plate: 'KA 51 S 8890', slot: 'Slot G-A12', duration: '0h 50m', amount: '₹30', method: 'FASTag NETC', status: 'Settled' },
  { id: 'tx-8', time: '07:45 AM', plate: 'KA 04 NM 2219', slot: 'Slot B-11', duration: '1h 10m', amount: '₹50', method: 'FASTag NETC', status: 'Settled' },
];

// Operational Alerts Panel
const OWNER_ALERTS = [
  { id: 'al-1', title: 'Slot C-07 marked out-of-service by staff', desc: 'Flagged for sensor calibration and bay power cleaning by ground team.', time: '18 min ago', type: 'warning' as const, badge: 'Maintenance' },
  { id: 'al-2', title: 'Boom Barrier Gate 2 sensor latency spiked to 4.2s (cleared)', desc: 'Edge ANPR optical gateway automatically stabilized connection.', time: '42 min ago', type: 'info' as const, badge: 'IoT Network' },
  { id: 'al-3', title: 'Surge pricing active at Forum Mall (+15%)', desc: 'Triggered as real-time occupancy crossed 78% threshold during lunch peak.', time: '1h ago', type: 'success' as const, badge: 'Dynamic Yield' },
];

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
  const { user, switchRole } = useDemoAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen" style={{ background: '#F7F8FA', paddingTop: '104px', paddingBottom: '96px' }}>
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
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

          <div className="flex items-center gap-3">
            <button
              id="dashboard-switch-to-user-btn"
              onClick={() => {
                switchRole('user');
                navigate('/user-dashboard');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#00C2A8] text-xs font-semibold text-[#111827] hover:text-[#00C2A8] transition-all shadow-xs cursor-pointer"
            >
              <span>Switch to User view</span>
              <ArrowRight size={13} />
            </button>

            <button
              id="dashboard-list-new-lot-btn"
              onClick={() => setShowListModal(true)}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                color: '#fff',
                background: '#3B5BFF',
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
              {/* Welcome Banner */}
              <div className="mb-8 p-6 sm:p-7 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#111827] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full border border-[#E5E7EB]">
                      Facility Owner Portal
                    </span>
                    <span className="text-xs text-[#6B7280]">Live Management Console</span>
                  </div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#111827]">
                    Welcome back, {user.name || 'Rajesh Iyer'} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                    Operating <span className="font-semibold text-[#111827]">{activeVenue}</span> and 2 other connected parking hubs across Bengaluru.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <span className="text-xs text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                    3 Active Hubs Online
                  </span>
                </div>
              </div>

              {/* Stat row with real numbers (Revenue visually dominant, rest secondary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-8">
                {/* Primary Hero Stat (5 cols): Today's Revenue - Visually Dominant */}
                <div className="lg:col-span-5 rounded-xl p-6 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign size={15} className="text-[#6B7280]" />
                        Primary Stat • Today's Revenue
                      </span>
                      <span className="text-xs font-bold text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <ArrowUpRight size={13} className="text-[#00C2A8]" /> ↑12% vs yesterday
                      </span>
                    </div>
                    <p className="font-display font-bold text-4xl sm:text-[42px] text-[#111827] tracking-tight leading-none mt-2">
                      ₹18,420
                    </p>
                    <p className="text-xs text-[#6B7280] mt-2">
                      vs ₹16,450 yesterday • ₹14,800 via FASTag + ₹3,620 UPI
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-[#F1F3F6] flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">198 vehicle transactions today</span>
                    <span className="font-semibold text-[#3B5BFF]">Export Reconciliation →</span>
                  </div>
                </div>

                {/* Secondary Stat 1 (3 cols): Live Occupancy 78% (156/200 slots) */}
                <div className="lg:col-span-3 rounded-xl p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#6B7280] font-medium">Live Occupancy</span>
                      <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                    </div>
                    <p className="font-display font-bold text-2xl sm:text-3xl text-[#111827]">
                      78%
                    </p>
                    <p className="text-xs text-[#15803D] font-medium mt-1">
                      156 / 200 slots filled
                    </p>
                  </div>
                  <div>
                    <div className="w-full bg-[#F1F3F6] h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#3B5BFF] h-full rounded-full" style={{ width: '78%' }} />
                    </div>
                    <p className="text-[10px] text-[#6B7280] mt-1.5">44 bays currently open</p>
                  </div>
                </div>

                {/* Secondary Stat 2 (2 cols): Total Locations 3 */}
                <div className="lg:col-span-2 rounded-xl p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block mb-1">Total Locations</span>
                    <p className="font-display font-bold text-2xl sm:text-3xl text-[#111827]">3</p>
                    <p className="text-[11px] text-[#6B7280] mt-1">All ANPR online</p>
                  </div>
                  <span className="text-[11px] text-[#3B5BFF] font-medium mt-2">
                    Phoenix, Forum, Manipal
                  </span>
                </div>

                {/* Secondary Stat 3 (2 cols): Avg. Stay Duration 2h 14m */}
                <div className="lg:col-span-2 rounded-xl p-5 bg-white border border-[#E5E7EB] flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#6B7280] font-medium block mb-1">Avg. Stay Duration</span>
                    <p className="font-display font-bold text-2xl sm:text-3xl text-[#111827]">2h 14m</p>
                    <p className="text-[11px] text-[#6B7280] mt-1">Median dwell time</p>
                  </div>
                  <span className="text-[11px] text-[#15803D] font-medium mt-2">
                    -8m vs weekend avg
                  </span>
                </div>
              </div>

              {/* Feature Launcher Grid (Cards linking straight into features with rich treatments) */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-lg text-[#111827]">
                    Facility Feature Launchers
                  </h2>
                  <span className="text-xs text-[#6B7280]">Direct shortcuts into owner tools</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  
                  {/* Launcher 1: Design Your Layout (Shows live mini floor plan thumbnail!) */}
                  <div
                    id="launcher-layout-btn"
                    onClick={() => setTab('layout')}
                    className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] text-[#111827] flex items-center justify-center border border-[#E5E7EB]">
                          <Layout size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
                          Open Canvas <ChevronRight size={13} />
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#111827] mb-1">
                        Design Your Layout
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                        Interactive 2D slot-map canvas to draft aisles, car bays, and EV chargers.
                      </p>

                      {/* Rich treatment: Mini Floor Plan Thumbnail Preview */}
                      <div className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] mb-2">
                        <div className="grid grid-cols-6 gap-1">
                          {[
                            '#4B5563','#4B5563','#15803D','#4B5563','#F59E0B','#4B5563',
                            '#CBD5E1','#E2E8F0','#E2E8F0','#E2E8F0','#E2E8F0','#CBD5E1',
                            '#3B5BFF','#4B5563','#4B5563','#15803D','#4B5563','#4B5563',
                          ].map((c, idx) => (
                            <div key={idx} className="h-3 rounded-xs" style={{ background: c, opacity: 0.75 }} />
                          ))}
                        </div>
                        <p className="text-[9px] text-[#6B7280] mt-1 text-center font-mono">Floor B1 • 12x11 Grid</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F1F3F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Drag & place tool</span>
                      <span className="font-semibold text-[#3B5BFF]">Edit Floor Plan →</span>
                    </div>
                  </div>

                  {/* Launcher 2: Manage Slots & Pricing */}
                  <div
                    id="launcher-slots-btn"
                    onClick={() => setTab('slots')}
                    className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] text-[#111827] flex items-center justify-center border border-[#E5E7EB]">
                          <Settings size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
                          Manage Rates <ChevronRight size={13} />
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#111827] mb-1">
                        Manage Slots & Pricing
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                        Configure base hourly rates, dynamic surge multipliers, and EV surcharge.
                      </p>

                      {/* Rich treatment: Mini Rate Card Preview */}
                      <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] mb-2 space-y-1 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6B7280]">Standard Base:</span>
                          <span className="font-bold text-[#111827]">₹40/hr</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6B7280]">Weekend Surge:</span>
                          <span className="font-bold text-[#F59E0B]">1.5x Peak</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F1F3F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Real-time sync</span>
                      <span className="font-semibold text-[#3B5BFF]">Update Pricing →</span>
                    </div>
                  </div>

                  {/* Launcher 3: View Reports (Mini sparkline preview!) */}
                  <div
                    id="launcher-reports-btn"
                    onClick={() => setTab('reports')}
                    className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] text-[#111827] flex items-center justify-center border border-[#E5E7EB]">
                          <FileText size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
                          Reports <ChevronRight size={13} />
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#111827] mb-1">
                        View Reports & Yield
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                        Weekly revenue curves, occupancy heatmaps, and FASTag reconciliation.
                      </p>

                      {/* Rich treatment: Inline mini SVG sparkline */}
                      <div className="p-2 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] mb-2 flex items-center justify-between">
                        <svg className="w-full h-8" viewBox="0 0 120 30" fill="none">
                          <path
                            d="M 5 22 Q 25 18 40 24 T 70 12 T 95 16 T 115 6"
                            stroke="#3B5BFF"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="115" cy="6" r="3" fill="#3B5BFF" />
                        </svg>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F1F3F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>GST invoices export</span>
                      <span className="font-semibold text-[#3B5BFF]">Open Reports →</span>
                    </div>
                  </div>

                  {/* Launcher 4: Live Activity */}
                  <div
                    id="launcher-activity-btn"
                    onClick={() => {
                      const el = document.getElementById('live-activity-preview');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F9FAFB] text-[#111827] flex items-center justify-center border border-[#E5E7EB]">
                          <Activity size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
                          Live Stream
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-[#111827] mb-1">
                        Live Entry / Exit Feed
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">
                        Real-time ANPR edge camera scans, boom barrier events, and toll logs.
                      </p>

                      {/* Rich treatment: Mini Live Ticker */}
                      <div className="p-2 rounded-lg bg-[#111827] text-white text-xs mb-2 flex items-center justify-between">
                        <span className="kiosk-plate text-[10px] text-[#22C55E]">KA 05 AB 4321</span>
                        <span className="text-[10px] text-[#9CA3AF]">→ IN (2m ago)</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F1F3F6] flex items-center justify-between text-[11px] text-[#6B7280]">
                      <span>Camera telemetry</span>
                      <span className="font-semibold text-[#3B5BFF]">Jump to Stream →</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Real 7-Day Revenue Chart & Occupancy by Location */}
              <div id="live-activity-preview" className="grid lg:grid-cols-12 gap-6 mb-6">
                
                {/* 7-Day Revenue Chart (7 cols) with real varying values */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-display font-bold text-lg text-[#111827]">Revenue (Last 7 Days)</h2>
                        <span className="text-[11px] font-bold text-[#15803D] bg-[#22C55E]/10 px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                          ↑12% vs Yesterday
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-0.5">Real daily gross settlements via NETC FASTag & UPI Gateway</p>
                    </div>
                    <span className="font-display font-bold text-xl text-[#3B5BFF]">₹18,420</span>
                  </div>

                  <ResponsiveContainer width="100%" height={210}>
                    <AreaChart data={SEVEN_DAY_REVENUE} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
                      <defs>
                        <linearGradient id="ownerRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B5BFF" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#3B5BFF" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '12px', color: '#111827', boxShadow: '0 8px 20px rgba(16,24,40,0.1)' }}
                        formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Daily Gross Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3B5BFF" strokeWidth={2.5} fill="url(#ownerRevenueGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>

                  {/* Day breakdown chips */}
                  <div className="grid grid-cols-7 gap-1 pt-3 mt-2 border-t border-[#F1F3F6] text-center">
                    {SEVEN_DAY_REVENUE.map(d => (
                      <div key={d.day} className="p-1 rounded bg-[#F7F8FA]">
                        <p className="text-[10px] text-[#6B7280]">{d.day.split(' ')[0]}</p>
                        <p className="text-[11px] font-bold text-[#111827]">{d.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Occupancy by Location (5 cols) - Per-location breakdown */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-display font-bold text-lg text-[#111827]">Occupancy by Location</h2>
                        <p className="text-xs text-[#6B7280] mt-0.5">Real-time capacity across 3 managed facilities</p>
                      </div>
                      <span className="pulse-dot bg-[#22C55E]" style={{ width: '7px', height: '7px' }} />
                    </div>

                    <div className="space-y-4">
                      {LOCATION_BREAKDOWN.map(loc => (
                        <div key={loc.id} className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <p className="text-xs font-bold text-[#111827]">{loc.name}</p>
                              <span className="text-[10px] text-[#6B7280]">{loc.type}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-[#111827]">{loc.occupied} / {loc.total} slots</span>
                              <span className="text-[10px] font-bold text-[#3B5BFF] block">{loc.percent}% Full</span>
                            </div>
                          </div>
                          <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${loc.percent}%`,
                                background: loc.percent > 79 ? '#3B5BFF' : '#3B5BFF',
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[10px]">
                            <span className="text-[#6B7280]">{loc.total - loc.occupied} bays available</span>
                            <span className={`font-semibold px-2 py-0.5 rounded ${loc.status.includes('Peak') ? 'bg-[#F59E0B]/10 text-[#D97706]' : 'bg-[#22C55E]/10 text-[#15803D]'}`}>
                              {loc.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#F1F3F6] flex items-center justify-between text-xs text-[#6B7280]">
                    <span>Aggregated Portfolio Capacity:</span>
                    <span className="font-bold text-[#111827]">346 / 440 (78.6%)</span>
                  </div>
                </div>

              </div>

              {/* Operational Alerts & Live Activity Feed Row */}
              <div className="grid lg:grid-cols-12 gap-6 mb-6">
                
                {/* Operational Alerts Panel (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/10 text-[#D97706] flex items-center justify-center">
                        <AlertTriangle size={15} />
                      </div>
                      <h2 className="font-display font-bold text-base text-[#111827]">Operational Alerts</h2>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B7280]">3 Active Flags</span>
                  </div>

                  <div className="space-y-3">
                    {OWNER_ALERTS.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          alert.type === 'warning'
                            ? 'bg-[#FFFBEB] border-[#FDE68A]'
                            : alert.type === 'info'
                            ? 'bg-[#EFF6FF] border-[#BFDBFE]'
                            : 'bg-[#F0FDF4] border-[#BBF7D0]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-bold text-[#111827]">{alert.title}</p>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              alert.type === 'warning'
                                ? 'bg-[#F59E0B]/15 text-[#B45309]'
                                : alert.type === 'info'
                                ? 'bg-[#3B5BFF]/15 text-[#1D4ED8]'
                                : 'bg-[#22C55E]/15 text-[#15803D]'
                            }`}
                          >
                            {alert.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4B5563] leading-relaxed">{alert.desc}</p>
                        <span className="text-[10px] text-[#9CA3AF] mt-1.5 block font-mono">{alert.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Activity Feed (7 cols) - 6-8 real entries */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="pulse-dot bg-[#22C55E]" style={{ width: '7px', height: '7px' }} />
                      <h2 className="font-display font-bold text-base text-[#111827]">Live Activity Feed</h2>
                    </div>
                    <span className="text-xs text-[#15803D] font-semibold bg-[#22C55E]/10 px-2.5 py-0.5 rounded-full">
                      Real-Time ANPR Stream
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {OWNER_LIVE_FEED_ITEMS.map((ev, i) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-[#F7F8FA] transition-colors"
                        style={{ borderBottom: i < OWNER_LIVE_FEED_ITEMS.length - 1 ? '1px solid #F1F3F6' : undefined }}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              background: ev.type === 'entry' ? '#22C55E' : ev.type === 'exit' ? '#3B5BFF' : '#EF4444'
                            }}
                          />
                          <span className="kiosk-plate text-xs font-bold text-[#111827] flex-shrink-0">
                            {ev.plate}
                          </span>
                          <span className="text-xs text-[#4B5563] truncate">
                            — {ev.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-mono text-[#6B7280]">
                            — {ev.time}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              ev.type === 'entry'
                                ? 'bg-[#22C55E]/10 text-[#15803D]'
                                : ev.type === 'exit'
                                ? 'bg-[#3B5BFF]/10 text-[#3B5BFF]'
                                : 'bg-[#EF4444]/10 text-[#EF4444]'
                            }`}
                          >
                            {ev.note}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Transactions Table (6-8 Rows with Real Numbers) */}
              <div className="bg-white border border-[#E5E7EB] shadow-sm rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#111827]">Recent Transactions</h2>
                    <p className="text-xs text-[#6B7280] mt-0.5">Automated NETC FASTag exits, parking fee settlements & overstay deductions</p>
                  </div>
                  <button className="text-xs font-semibold text-[#3B5BFF] bg-[#3B5BFF]/10 px-3 py-1.5 rounded-lg hover:bg-[#3B5BFF]/20 transition-all cursor-pointer">
                    Download CSV Report
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[#6B7280] uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-3 px-3">Time</th>
                        <th className="py-3 px-3">Plate</th>
                        <th className="py-3 px-3">Slot</th>
                        <th className="py-3 px-3">Duration</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Method</th>
                        <th className="py-3 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F3F6]">
                      {RECENT_TRANSACTIONS.map(tx => (
                        <tr key={tx.id} className="hover:bg-[#F7F8FA] transition-colors">
                          <td className="py-3 px-3 font-mono text-[#6B7280]">{tx.time}</td>
                          <td className="py-3 px-3 kiosk-plate font-bold text-[#111827]">{tx.plate}</td>
                          <td className="py-3 px-3 font-semibold text-[#111827]">{tx.slot}</td>
                          <td className="py-3 px-3 text-[#6B7280]">{tx.duration}</td>
                          <td className="py-3 px-3 font-display font-bold text-sm text-[#111827]">{tx.amount}</td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-[#4B5563] bg-[#F1F3F6] px-2 py-0.5 rounded font-medium">
                              {tx.method}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                                tx.status === 'Settled'
                                  ? 'bg-[#22C55E]/10 text-[#15803D]'
                                  : 'bg-[#F59E0B]/10 text-[#D97706]'
                              }`}
                            >
                              {tx.status === 'Settled' ? '✓ Settled' : '● Pending Link'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  style={{ background: '#3B5BFF' }}
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
                    background: '#3B5BFF',
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
