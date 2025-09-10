import { useState } from "react";
import { GovHeader } from "./GovHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Eye } from "lucide-react";

const mockCandidates = [
  {
    id: "1",
    name: "Priya Sharma",
    education: "B.Tech Computer Science",
    skills: ["React", "Node.js", "TypeScript"],
    location: "Delhi",
    applications: 3,
  },
  {
    id: "2",
    name: "Rahul Kumar",
    education: "MBA Finance",
    skills: ["Excel", "Financial Analysis", "SQL"],
    location: "Mumbai",
    applications: 2,
  },
  {
    id: "3",
    name: "Anita Singh",
    education: "B.Com Marketing",
    skills: ["Digital Marketing", "SEO", "Content Writing"],
    location: "Bangalore",
    applications: 4,
  },
  {
    id: "4",
    name: "Amit Patel",
    education: "B.Tech Mechanical",
    skills: ["AutoCAD", "SolidWorks", "Project Management"],
    location: "Chennai",
    applications: 1,
  },
  {
    id: "5",
    name: "Sneha Gupta",
    education: "BCA",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    location: "Pune",
    applications: 2,
  },
  {
    id: "6",
    name: "Vikash Yadav",
    education: "B.Tech Electronics",
    skills: ["VLSI", "Embedded Systems", "C++"],
    location: "Hyderabad",
    applications: 3,
  },
];

interface CandidatesPageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function CandidatesPage({ onLogout, onNavigate, currentPage }: CandidatesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidates = mockCandidates.filter(candidate => {
    const searchLower = searchTerm.toLowerCase();
    return (
      candidate.name.toLowerCase().includes(searchLower) ||
      candidate.education.toLowerCase().includes(searchLower) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      candidate.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Candidates Database</h1>
          <p className="text-muted-foreground">Search and manage all registered candidates</p>
        </div>

        {/* Search Bar */}
        <div className="bg-card p-6 rounded-lg border shadow-sm mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, education, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-primary">{mockCandidates.length}</h3>
            <p className="text-sm text-muted-foreground">Total Candidates</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-success">
              {mockCandidates.reduce((sum, c) => sum + c.applications, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </div>
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-bold text-secondary">
              {new Set(mockCandidates.map(c => c.location)).size}
            </h3>
            <p className="text-sm text-muted-foreground">Cities Represented</p>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Key Skills</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.education}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{candidate.location}</TableCell>
                  <TableCell>{candidate.applications} applications</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                      View Full Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No candidates found matching your search criteria.</p>
            </div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}