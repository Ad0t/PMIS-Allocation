import { useState } from "react";
import { GovHeader } from "./GovHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Eye, Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
];

interface InternshipsPageProps {
  onLogout: () => void;
  onViewApplicants: (id: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function InternshipsPage({ onLogout, onViewApplicants, onNavigate, currentPage }: InternshipsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const filteredInternships = mockInternships.filter(internship => {
    const matchesSearch = 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || internship.status === filterStatus;
    const matchesCompany = !filterCompany || internship.company.toLowerCase().includes(filterCompany.toLowerCase());
    const matchesLocation = !filterLocation || internship.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCompany && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Internships Management</h1>
            <p className="text-muted-foreground">Manage all internship opportunities</p>
          </div>
          <Button variant="government">
            <Plus className="h-4 w-4" />
            Add Internship
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg border shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Filter by company..."
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
            />
            <Input
              placeholder="Filter by location..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
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
        </div>

        {/* Internships Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Internship Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInternships.map((internship) => (
                <TableRow key={internship.id}>
                  <TableCell className="font-medium">{internship.title}</TableCell>
                  <TableCell>{internship.company}</TableCell>
                  <TableCell>{internship.location}</TableCell>
                  <TableCell>{internship.applicants} applicants</TableCell>
                  <TableCell>
                    <Badge variant={internship.status === "active" ? "success" : "warning"}>
                      {internship.status === "active" ? "Active" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewApplicants(internship.id)}
                      >
                        <Eye className="h-4 w-4" />
                        View Applicants
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>
                            {internship.status === "active" ? "Close" : "Reopen"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              setFilterCompany("");
              setFilterLocation("");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}