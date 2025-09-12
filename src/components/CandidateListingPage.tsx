import { useState, useEffect } from "react";
import { GovHeader } from "./GovHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, User, MapPin, Eye, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CandidateListingPageProps {
  internshipId: string;
  onBack: () => void;
  onLogout: () => void;
}

export function CandidateListingPage({ internshipId, onBack, onLogout }: CandidateListingPageProps) {
  const [candidates, setCandidates] = useState([]);
  const [internshipInfo, setInternshipInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
      
        // Fetch internship details
        const internshipResponse = await fetch(`${apiUrl}/api/internships/${internshipId}`);
        const internshipData = await internshipResponse.json();
      
        // Fetch candidates for that internship
        const candidatesResponse = await fetch(`${apiUrl}/api/internships/${internshipId}/candidates`);
        const candidatesData = await candidatesResponse.json();
      
        setInternshipInfo(internshipData);
        setCandidates(candidatesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  fetchData();
  }, [internshipId]);

  const filteredCandidates = candidates.filter(candidate => // Now filters the fetched data
  candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
  candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleCandidateSelection = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleShortlist = () => {
    if (selectedCandidates.length === 0) {
      toast({
        title: "No candidates selected",
        description: "Please select at least one candidate to shortlist.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Candidates shortlisted successfully!",
      description: `${selectedCandidates.length} candidate(s) have been shortlisted for the next round.`,
    });

    setSelectedCandidates([]);
  };

  const isAllSelected = filteredCandidates.length > 0 && 
    filteredCandidates.every(candidate => selectedCandidates.includes(candidate.id));


  if (loading) {
    return <div className="text-center p-8">Loading candidates...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              Applicants for {internshipInfo ? internshipInfo.title : 'Loading...'}
            </h1>
            <p className="text-muted-foreground">
              {internshipInfo ? internshipInfo.company : '...'} • {internshipInfo.totalApplicants} total applicants
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates by name, skills, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                  <label 
                    htmlFor="select-all" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select All
                  </label>
                </div>
                
                <Button 
                  variant="government" 
                  onClick={handleShortlist}
                  disabled={selectedCandidates.length === 0}
                >
                  <Users className="h-4 w-4" />
                  Shortlist Selected ({selectedCandidates.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={`candidate-${candidate.id}`}
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) => 
                        handleCandidateSelection(candidate.id, checked as boolean)
                      }
                    />
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.education}</p>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{candidate.location}</span>
                          <span>•</span>
                          <span>{candidate.experience} experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
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