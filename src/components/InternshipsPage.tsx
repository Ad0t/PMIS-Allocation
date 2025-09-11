import { useState } from "react";
import { GovHeader } from "./GovHeader";
import { InternshipTile } from "./InternshipTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

const mockInternships = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "GAIL (India) Limited",
    location: "New Delhi",
    applicants: 245,
    status: "active" as const,
  },
  {
    id: "2",
    title: "Data Analytics Intern",
    company: "REC Limited",
    location: "Mumbai",
    applicants: 189,
    status: "active" as const,
  },
  {
    id: "3",
    title: "Marketing Research Intern",
    company: "Unilever India",
    location: "Bangalore",
    applicants: 156,
    status: "closed" as const,
  },
  {
    id: "4",
    title: "Finance & Accounting Intern",
    company: "ONGC",
    location: "Chennai",
    applicants: 203,
    status: "active" as const,
  },
  {
    id: "5",
    title: "Human Resources Intern",
    company: "NTPC Limited",
    location: "Kolkata",
    applicants: 178,
    status: "closed" as const,
  },
  {
    id: "6",
    title: "Digital Marketing Intern",
    company: "Bharti Airtel",
    location: "Gurgaon",
    applicants: 134,
    status: "active" as const,
  },
  {
    id: "7",
    title: "Product Management Intern",
    company: "Zomato",
    location: "Gurgaon",
    applicants: 312,
    status: "active" as const,
  },
  {
    id: "8",
    title: "Graphic Design Intern",
    company: "Swiggy",
    location: "Bangalore",
    applicants: 195,
    status: "active" as const,
  },
  {
    id: "9",
    title: "Business Development Intern",
    company: "Reliance Industries",
    location: "Mumbai",
    applicants: 289,
    status: "closed" as const,
  },
  {
    id: "10",
    title: "Supply Chain Intern",
    company: "ITC Limited",
    location: "Kolkata",
    applicants: 140,
    status: "active" as const,
  },
  {
    id: "11",
    title: "Content Writing Intern",
    company: "The Times of India",
    location: "Noida",
    applicants: 215,
    status: "active" as const,
  },
  {
    id: "12",
    title: "Legal Intern",
    company: "Tata Steel",
    location: "Jamshedpur",
    applicants: 98,
    status: "closed" as const,
  },
  {
    id: "13",
    title: "Machine Learning Intern",
    company: "Ola Cabs",
    location: "Bangalore",
    applicants: 450,
    status: "active" as const,
  },
  {
    id: "14",
    title: "Public Relations Intern",
    company: "Adani Group",
    location: "Ahmedabad",
    applicants: 162,
    status: "active" as const,
  },
  {
    id: "15",
    title: "Cybersecurity Intern",
    company: "Infosys",
    location: "Pune",
    applicants: 355,
    status: "closed" as const,
  },
];

interface InternshipsPageProps {
  onLogout: () => void;
  onInternshipClick: (id: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function InternshipsPage({ onLogout, onInternshipClick, onNavigate, currentPage }: InternshipsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");
  const [filterCategory, setFilterCategory] = useState<"all" | "IT" | "Food Tech" | "Law" | "Finance" | "Healthcare">("all");

  const filteredInternships = mockInternships.filter(internship => {
    const matchesSearch = 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || internship.status === filterStatus;
    
    // Simple category matching based on title keywords
    const matchesCategory = filterCategory === "all" || 
      (filterCategory === "IT" && (internship.title.toLowerCase().includes("software") || internship.title.toLowerCase().includes("data"))) ||
      (filterCategory === "Finance" && internship.title.toLowerCase().includes("finance")) ||
      (filterCategory === "Food Tech" && internship.title.toLowerCase().includes("food")) ||
      (filterCategory === "Law" && internship.title.toLowerCase().includes("legal")) ||
      (filterCategory === "Healthcare" && internship.title.toLowerCase().includes("health"));
    
    return matchesSearch && matchesStatus && matchesCategory;
  });
return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Internships Hub</h1>
          <p className="text-muted-foreground">Discover and manage all internship opportunities</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filterCategory === "all" ? "government" : "outline"}
            onClick={() => setFilterCategory("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterCategory === "IT" ? "government" : "outline"}
            onClick={() => setFilterCategory("IT")}
            size="sm"
          >
            IT
          </Button>
          <Button
            variant={filterCategory === "Food Tech" ? "government" : "outline"}
            onClick={() => setFilterCategory("Food Tech")}
            size="sm"
          >
            Food Tech
          </Button>
          <Button
            variant={filterCategory === "Law" ? "government" : "outline"}
            onClick={() => setFilterCategory("Law")}
            size="sm"
          >
            Law
          </Button>
          <Button
            variant={filterCategory === "Finance" ? "government" : "outline"}
            onClick={() => setFilterCategory("Finance")}
            size="sm"
          >
            Finance
          </Button>
          <Button
            variant={filterCategory === "Healthcare" ? "government" : "outline"}
            onClick={() => setFilterCategory("Healthcare")}
            size="sm"
          >
            Healthcare
          </Button>
        </div>

        {/* Search and Status Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search internships or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "government" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === "active" ? "success" : "outline"}
              onClick={() => setFilterStatus("active")}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={filterStatus === "closed" ? "warning" : "outline"}
              onClick={() => setFilterStatus("closed")}
              size="sm"
            >
              Closed
            </Button>
          </div>
        </div>

        {/* Internship Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
            <InternshipTile
              key={internship.id}
              {...internship}
              onClick={onInternshipClick}
            />
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No internships found matching your criteria.</p>
            </div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setFilterCategory("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}