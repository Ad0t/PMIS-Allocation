import { GovHeader } from "./GovHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const eligibilityData = [
  { category: "High Eligibility", value: 342, percentage: 45 },
  { category: "Medium Eligibility", value: 289, percentage: 38 },
  { category: "Low Eligibility", value: 129, percentage: 17 },
];

const applicationsOverTime = [
  { month: "Jan", applications: 120 },
  { month: "Feb", applications: 185 },
  { month: "Mar", applications: 245 },
  { month: "Apr", applications: 290 },
  { month: "May", applications: 380 },
  { month: "Jun", applications: 420 },
];

const funnelData = [
  { stage: "Total Applicants", count: 1250, percentage: 100 },
  { stage: "Shortlisted", count: 625, percentage: 50 },
  { stage: "Interviewed", count: 250, percentage: 20 },
  { stage: "Hired", count: 125, percentage: 10 },
];

const geographicalData = [
  { city: "Delhi", candidates: 185 },
  { city: "Mumbai", candidates: 164 },
  { city: "Bangalore", candidates: 142 },
  { city: "Chennai", candidates: 128 },
  { city: "Kolkata", candidates: 96 },
  { city: "Pune", candidates: 87 },
  { city: "Hyderabad", candidates: 78 },
  { city: "Others", candidates: 370 },
];

const COLORS = ['#059669', '#0891b2', '#dc2626', '#7c3aed', '#ea580c', '#be185d'];

interface ReportsPageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function ReportsPage({ onLogout, onNavigate, currentPage }: ReportsPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Data-driven insights for the PM Internship Scheme</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-primary">1,250</h3>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-success">625</h3>
            <p className="text-sm text-muted-foreground">Shortlisted Candidates</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-warning">125</h3>
            <p className="text-sm text-muted-foreground">Successfully Hired</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-secondary">10%</h3>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Candidate Eligibility Report */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Eligibility Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={eligibilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {eligibilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Applications Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Applications Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={applicationsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="#059669" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hiring Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Process Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Geographical Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Geographical Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={geographicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="city" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="candidates" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}