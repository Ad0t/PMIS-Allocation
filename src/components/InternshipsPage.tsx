import { useState, useEffect } from "react";
import { apiJson } from "@/lib/api";
import { GovHeader } from "./GovHeader";
import { InternshipTile } from "./InternshipTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface InternshipsPageProps {
  onLogout: () => void;
  onInternshipClick: (id: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  currentUser?: string;
}

interface Internship {
  internship_id: string;
  internship_title: string;
  company_name: string;
  location: string;
  capacity: number;
  status: "Open" | "Closed";
  category: string;
}

const ITEMS_PER_PAGE = 20;

export function InternshipsPage({ onLogout, onInternshipClick, onNavigate, currentPage, currentUser }: InternshipsPageProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Open" | "Closed">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [paginationPage, setPaginationPage] = useState(1);

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
    internship.internship_title.includes(searchTerm) ||
    internship.company_name.includes(searchTerm);
  const matchesStatus = filterStatus === "all" || internship.status === filterStatus;
  const matchesCategory = filterCategory === "all" || internship.category === filterCategory;

  return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredInternships.length / ITEMS_PER_PAGE);
    const paginatedInternships = filteredInternships.slice(
      (paginationPage - 1) * ITEMS_PER_PAGE,
      paginationPage * ITEMS_PER_PAGE
    );

return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} currentUser={currentUser} />
      
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
              variant={filterCategory === category ? "government" : "outline"}
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
              variant={filterStatus === "Open" ? "success" : "outline"}
              onClick={() => setFilterStatus("Open")}
              size="sm"
            >
              Open
            </Button>
            <Button
              variant={filterStatus === "Closed" ? "warning" : "outline"}
              onClick={() => setFilterStatus("Closed")}
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
              key={internship.internship_id}
              internship_id={internship.internship_id.toString()}
              internship_title={internship.internship_title}
              company_name={internship.company_name}
              location={internship.location}
              capacity={internship.capacity}
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
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPaginationPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={paginationPage === 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPaginationPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={paginationPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}