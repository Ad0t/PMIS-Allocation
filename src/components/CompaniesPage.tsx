import { GovHeader } from "./GovHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Users, Briefcase } from "lucide-react";

const mockCompanies = [
  {
    id: "1",
    name: "GAIL (India) Limited",
    logo: "🏢",
    sector: "Oil & Gas",
    location: "New Delhi",
    totalInternships: 12,
    totalHired: 45,
    activeInternships: 3,
    description: "Gas Authority of India Limited",
  },
  {
    id: "2",
    name: "REC Limited",
    logo: "⚡",
    sector: "Power & Energy",
    location: "New Delhi",
    totalInternships: 8,
    totalHired: 28,
    activeInternships: 2,
    description: "Rural Electrification Corporation",
  },
  {
    id: "3",
    name: "Unilever India",
    logo: "🧴",
    sector: "FMCG",
    location: "Mumbai",
    totalInternships: 15,
    totalHired: 62,
    activeInternships: 0,
    description: "Fast Moving Consumer Goods",
  },
  {
    id: "4",
    name: "ONGC",
    logo: "🛢️",
    sector: "Oil & Gas",
    location: "Dehradun",
    totalInternships: 10,
    totalHired: 38,
    activeInternships: 1,
    description: "Oil and Natural Gas Corporation",
  },
  {
    id: "5",
    name: "NTPC Limited",
    logo: "🔋",
    sector: "Power",
    location: "New Delhi",
    totalInternships: 9,
    totalHired: 33,
    activeInternships: 1,
    description: "National Thermal Power Corporation",
  },
  {
    id: "6",
    name: "Bharti Airtel",
    logo: "📱",
    sector: "Telecommunications",
    location: "New Delhi",
    totalInternships: 14,
    totalHired: 51,
    activeInternships: 1,
    description: "Leading telecommunications company",
  },
];

interface CompaniesPageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function CompaniesPage({ onLogout, onNavigate, currentPage }: CompaniesPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Partner Companies</h1>
          <p className="text-muted-foreground">Manage relationships with participating organizations</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-primary">{mockCompanies.length}</h3>
            <p className="text-sm text-muted-foreground">Partner Companies</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-success">
              {mockCompanies.reduce((sum, c) => sum + c.totalInternships, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Internships Posted</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-warning">
              {mockCompanies.reduce((sum, c) => sum + c.totalHired, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Interns Hired</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-secondary">
              {mockCompanies.reduce((sum, c) => sum + c.activeInternships, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Active Internships</p>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCompanies.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{company.logo}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{company.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  <span>{company.sector}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="text-lg font-bold text-primary">{company.totalInternships}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Internships</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="h-4 w-4 text-success" />
                      <span className="text-lg font-bold text-success">{company.totalHired}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Interns Hired</p>
                  </div>
                </div>

                {company.activeInternships > 0 && (
                  <div className="pt-2">
                    <Badge variant="success" className="w-full justify-center">
                      {company.activeInternships} Active Internship{company.activeInternships > 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}