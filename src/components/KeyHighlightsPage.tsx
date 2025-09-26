import { useEffect, useMemo, useState, ReactNode } from "react";
import { GovHeader } from "./GovHeader";
import { apiJson } from "@/lib/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface KeyHighlightsPageProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  currentUser?: string;
}

interface InternshipRecord { // inferred shape from existing components
  internship_id: string;
  internship_title: string;
  company_name: string;
  location: string;
  capacity: number;
  status: string; // "Open" | "Closed" | others
  [key: string]: unknown; // allow extra fields gracefully
}

const COLORS = ["#2563eb", "#0ea5e9", "#14b8a6", "#10b981", "#84cc16", "#f59e0b", "#f97316", "#ef4444", "#6366f1", "#8b5cf6", "#ec4899"]; // extended palette

// Static average score data (placeholder until API provides this)
const AVERAGE_SCORE_DATA = [
  { internship_id: 'INT006', title: 'R&D and Quality Control Intern', company: 'BASF India', avgScore: 0.7527 },
  { internship_id: 'INT005', title: 'Process Engineering Intern', company: 'Reliance Industries Ltd.', avgScore: 0.7188 },
  { internship_id: 'INT008', title: 'Corporate Banking & Treasury Intern', company: 'SBI', avgScore: 0.7140 },
  { internship_id: 'INT009', title: 'Automotive Design Intern', company: 'Tata Motors', avgScore: 0.7116 },
  { internship_id: 'INT001', title: 'Data Scientist Intern', company: 'Infosys', avgScore: 0.7049 },
  { internship_id: 'INT004', title: 'App Development Intern', company: 'Paytm', avgScore: 0.6057 },
  { internship_id: 'INT002', title: 'Full Stack Intern', company: 'Flipkart', avgScore: 0.5771 },
];

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  empty?: boolean;
  loading?: boolean;
}

const ChartCard = ({ title, description, children, className = "", footer, empty, loading }: ChartCardProps) => (
  <div className={`relative group bg-gradient-to-br from-card to-card/90 border border-border/60 hover:border-primary/40 transition-colors rounded-xl shadow-sm hover:shadow-md backdrop-blur-sm ${className}`}>
    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-border/60 group-hover:ring-primary/30 pointer-events-none" />
    <div className="p-5 space-y-3">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <span className="relative">
            {title}
            <span className="absolute -bottom-1 left-0 h-px w-6 bg-gradient-to-r from-primary/60 to-transparent" />
          </span>
        </h2>
        {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
      </header>
      <div className="h-72 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm rounded-md">
            <div className="animate-spin h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full" />
          </div>
        )}
        {empty && !loading ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No data</div>
        ) : children}
      </div>
      {footer && <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground flex justify-between">{footer}</div>}
    </div>
  </div>
);

export function KeyHighlightsPage({ onLogout, onNavigate, currentUser }: KeyHighlightsPageProps) {
  const [internships, setInternships] = useState<InternshipRecord[] | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiJson<InternshipRecord[]>('/api/internships');
        if (!mounted) return;
        if (Array.isArray(data)) {
          setInternships(data);
        } else {
          setInternships([]);
        }
      } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (mounted) {
          setError(e.message || 'Failed to load data');
          setInternships([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Aggregations
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    (internships || []).forEach(r => {
      const key = (r.status || 'Unknown').toString();
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({ status, value }));
  }, [internships]);

  const companyData = useMemo(() => {
    const counts: Record<string, { internships: number; totalCapacity: number; } > = {};
    (internships || []).forEach(r => {
      const key = r.company_name || 'Unknown';
      if (!counts[key]) counts[key] = { internships: 0, totalCapacity: 0 };
      counts[key].internships += 1;
      const cap = typeof r.capacity === 'number' ? r.capacity : parseInt(String(r.capacity || 0), 10) || 0;
      counts[key].totalCapacity += cap;
    });
    const arr = Object.entries(counts).map(([company, v]) => ({ company, ...v }));
    // Top 7 by internships
    arr.sort((a, b) => b.internships - a.internships);
    return arr.slice(0, 7);
  }, [internships]);

  const locationData = useMemo(() => {
    const counts: Record<string, number> = {};
    (internships || []).forEach(r => {
      const key = r.location || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    const arr = Object.entries(counts).map(([location, value]) => ({ location, value }));
    arr.sort((a, b) => b.value - a.value);
    return arr.slice(0, 7);
  }, [internships]);

  const capacityByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    (internships || []).forEach(r => {
      const status = (r.status || 'Unknown').toString();
      const cap = typeof r.capacity === 'number' ? r.capacity : parseInt(String(r.capacity || 0), 10) || 0;
      map[status] = (map[status] || 0) + cap;
    });
    return Object.entries(map).map(([status, capacity]) => ({ status, capacity }));
  }, [internships]);

  // Category / Sector distribution (uses `category` if present; fallbacks handled)
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    (internships || []).forEach((r: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const raw = (r.category || r.sector || 'Uncategorized') as string;
      const key = raw.trim() === '' ? 'Uncategorized' : raw.trim();
      counts[key] = (counts[key] || 0) + 1;
    });
    let arr = Object.entries(counts).map(([category, value]) => ({ category, value }));
    arr.sort((a, b) => b.value - a.value);
    if (arr.length > 8) {
      const top = arr.slice(0, 7);
      const otherTotal = arr.slice(7).reduce((s, x) => s + x.value, 0);
      arr = [...top, { category: 'Other', value: otherTotal }];
    }
    return arr;
  }, [internships]);

  const avgScoreData = useMemo(() => {
    // Sort by numeric value in internship_id ascending (INT001, INT002, ...)
    return [...AVERAGE_SCORE_DATA].sort((a, b) => {
      const na = parseInt(a.internship_id.replace(/\D/g, ''), 10);
      const nb = parseInt(b.internship_id.replace(/\D/g, ''), 10);
      return na - nb;
    });
  }, []);

  const totals = useMemo(() => {
    const total = internships?.length || 0;
    const open = (internships || []).filter(r => /open/i.test(r.status || '')).length;
    const closed = (internships || []).filter(r => /closed/i.test(r.status || '')).length;
    const totalCapacity = (internships || []).reduce((sum, r) => sum + (typeof r.capacity === 'number' ? r.capacity : parseInt(String(r.capacity || 0), 10) || 0), 0);
    const avgCapacity = total ? (totalCapacity / total) : 0;
    return { total, open, closed, totalCapacity, avgCapacity };
  }, [internships]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage="reports" currentUser={currentUser} />
      <main className="container mx-auto px-4 py-10 space-y-12">
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            Key Highlights <span className="text-primary">& Reports</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Current snapshot of internship opportunities and distribution across companies, status, and locations.
            Additional historical trends can be integrated when temporal fields are available.
          </p>
        </section>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { label: 'Total Internships', value: totals.total, accent: 'from-primary/10 to-primary/0' },
            { label: 'Open', value: totals.open, accent: 'from-emerald-500/15 to-emerald-500/0' },
            { label: 'Closed', value: totals.closed, accent: 'from-amber-500/15 to-amber-500/0' },
            { label: 'Total Capacity', value: totals.totalCapacity, accent: 'from-sky-500/15 to-sky-500/0' },
            { label: 'Avg Capacity', value: totals.avgCapacity.toFixed(1), accent: 'from-fuchsia-500/15 to-fuchsia-500/0' }
          ].map(kpi => (
            <div key={kpi.label} className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.accent}`} />
              <div className="relative p-5 flex flex-col items-center text-center">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{kpi.label}</span>
                <span className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{loading ? '…' : kpi.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid (Two rows: first row 3, second row 2 centered) */}
        <div className="space-y-10">
          <div className="grid gap-8 mx-auto max-w-7xl md:grid-cols-2 xl:grid-cols-3">
            <ChartCard title="By Status" description="Open vs closed postings" loading={loading} empty={!loading && statusData.length === 0} footer={<span className="">Distinct statuses: {statusData.length}</span>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={35} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" name="Count" fill="#2563eb" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Top Companies" description="Most internship postings" loading={loading} empty={!loading && companyData.length === 0} footer={<span>Total shown: {companyData.length}</span>}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={companyData} dataKey="internships" nameKey="company" innerRadius={40} outerRadius={90} paddingAngle={3}>
                    {companyData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Top Locations" description="Highest concentration" loading={loading} empty={!loading && locationData.length === 0} footer={<span>Total shown: {locationData.length}</span>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="location" width={80} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="value" name="Internships" fill="#10b981" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <div className="grid gap-8 mx-auto max-w-4xl md:grid-cols-2 justify-center">
            <ChartCard title="Capacity by Status" description="Total offered seats per status" loading={loading} empty={!loading && capacityByStatus.length === 0} footer={<span>Statuses: {capacityByStatus.length}</span>}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityByStatus}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} width={40} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(v: number) => [v, 'Capacity']} />
                  <Bar dataKey="capacity" name="Capacity" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Sectors" description="Internships per sector / category" loading={loading} empty={!loading && categoryData.length === 0} footer={<span>Shown: {categoryData.length}</span>}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Pie data={categoryData} dataKey="value" nameKey="category" innerRadius={35} outerRadius={85} paddingAngle={2}>
                    {categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Company Capacity Summary (moved above average score section) */}
        <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Company Capacity Summary</h2>
              <p className="text-xs text-muted-foreground mt-1">Top companies limited to first 7 by posting count.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t border-border/60">
              <thead className="text-left text-muted-foreground bg-muted/30">
                <tr className="divide-x divide-border/50">
                  <th className="py-2 px-4 font-medium">Company</th>
                  <th className="py-2 px-4 font-medium">Internships</th>
                  <th className="py-2 px-4 font-medium">Total Capacity</th>
                  <th className="py-2 px-4 font-medium">Avg Capacity</th>
                </tr>
              </thead>
              <tbody>
                {companyData.map((c, idx) => (
                  <tr key={c.company} className={`divide-x divide-border/50 ${idx % 2 ? 'bg-muted/20' : 'bg-transparent'} hover:bg-muted/40 transition-colors`}> 
                    <td className="py-2 px-4 font-medium">{c.company}</td>
                    <td className="py-2 px-4 tabular-nums">{c.internships}</td>
                    <td className="py-2 px-4 tabular-nums">{c.totalCapacity}</td>
                    <td className="py-2 px-4 tabular-nums">{(c.totalCapacity / c.internships).toFixed(1)}</td>
                  </tr>
                ))}
                {!loading && companyData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-muted-foreground">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Average Score Analytics (table left larger, chart right smaller) */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-8 items-start">
          <div className="xl:col-span-3 rounded-xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 pb-3">
              <h2 className="text-lg font-semibold tracking-tight">Average Score Table</h2>
              <p className="text-xs text-muted-foreground mt-1">Sorted by ID ascending. Values are normalized (0–1) averages.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t border-border/60">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr className="divide-x divide-border/50">
                    <th className="py-2 px-3 text-left font-medium">ID</th>
                    <th className="py-2 px-3 text-left font-medium">Internship</th>
                    <th className="py-2 px-3 text-left font-medium">Company</th>
                    <th className="py-2 px-3 text-right font-medium">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {avgScoreData.map((row, idx) => (
                    <tr key={row.internship_id} className={`divide-x divide-border/50 ${idx % 2 ? 'bg-muted/20' : ''} hover:bg-muted/40 transition-colors`}>
                      <td className="py-2 px-3 font-medium tabular-nums">{row.internship_id}</td>
                      <td className="py-2 px-3">{row.title}</td>
                      <td className="py-2 px-3">{row.company}</td>
                      <td className="py-2 px-3 text-right font-semibold tabular-nums">{row.avgScore.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-border/60 text-xs text-muted-foreground flex justify-end">
              <span>Range: {avgScoreData[0].avgScore.toFixed(4)} - {avgScoreData[avgScoreData.length-1].avgScore.toFixed(4)}</span>
            </div>
          </div>
          <ChartCard
            title="Average Scores"
            description="Per internship average (static demo)"
            loading={false}
            empty={avgScoreData.length === 0}
            footer={<span>Items: {avgScoreData.length}</span>}
            className="xl:col-span-3"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgScoreData} margin={{ left: 20, right: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                <XAxis dataKey="internship_id" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1]} tickFormatter={(v) => v.toFixed(1)} width={30} />
                <Tooltip formatter={(v: number) => [v.toFixed(4), 'Avg Score']} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Bar dataKey="avgScore" name="Avg Score" radius={[4,4,0,0]}>
                  {avgScoreData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

      </main>
    </div>
  );
}

export default KeyHighlightsPage;
