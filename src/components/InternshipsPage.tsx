import { useState, useEffect } from "react";
import { apiJson } from "@/lib/api";
import { GovHeader } from "./GovHeader";
import { InternshipTile } from "./InternshipTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";


interface InternshipsPageProps {
  onLogout: () => void;
  onInternshipClick: (id: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

interface Internship {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  job_capacity: number;
  status: "active" | "closed";
  category: string;
}

export function InternshipsPage({ onLogout, onInternshipClick, onNavigate, currentPage }: InternshipsPageProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    apiJson<Internship[]>("/api/internships")
      .then((data) => {
        setInternships(data);
        const uniqueCategories = Array.from(new Set(data.map(internship => internship.category)));
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching internships:', error));
  }, []);

  const filteredInternships = internships.filter(internship => {
  const matchesSearch =
    internship.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = filterStatus === "all" || internship.status.toLowerCase() === filterStatus;
  const matchesCategory = filterCategory === "all" || internship.category.toLowerCase() === filterCategory.toLowerCase();

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
          {categories.map((category) => (
            <Button
              key={category}
              variant={filterCategory.toLowerCase() === category ? "government" : "outline"}
              onClick={() => setFilterCategory(category)}
              size="sm"
              className="capitalize"
            >
              {category}
            </Button>
          ))}
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
            // <InternshipTile
            //   key={internship.id}
            //   {...internship}
            //   onClick={onInternshipClick}
            // />
            <InternshipTile
              key={internship.id}
              id={internship.id.toString()}
              job_title={internship.job_title}
              company_name={internship.company_name}
              location={internship.location}
              job_capacity={internship.job_capacity}
              status={internship.status}
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