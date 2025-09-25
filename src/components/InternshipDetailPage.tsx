import { useState, useEffect } from "react";
import { apiJson } from "@/lib/api";
import { GovHeader } from "./GovHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Calendar, IndianRupee, Sparkles } from "lucide-react";

interface InternshipDetailPageProps {
  internshipId: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentUser?: string;
}

interface Internship {
    internship_id: string;
    internship_title: string;
    company_name: string;
    location: string;
    status: string;
    stipend_inr_month: string;
    duration_months: number;
    job_description: string;
    skills_required: string[];
    responsibilities: string[];
}

export function InternshipDetailPage({ internshipId, onBack, onLogout, onNavigate, currentUser }: InternshipDetailPageProps) {
  const [internship, setInternship] = useState<Internship | null>(null);
  const [aiProgress, setAiProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  const candidates: any[] = [];
  useEffect(() => {
    setLoading(true);
    apiJson<Internship>(`/api/internships/${internshipId}`)
      .then((internshipData) => {
        setInternship(internshipData);
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, [internshipId]);

  if (loading || !internship) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl">
                {loading ? "Loading internship details..." : "Internship not found."}
            </p>
        </div>
    );
  }


  const runAiShortlisting = () => {
    setShowProgress(true);
    setActiveTab("applicants");
    setAiProgress(0);
    
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowProgress(false);
            setShowResults(true);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "shortlisted": return "success";
      case "promising": return "default";
      case "not-recommended": return "secondary";
      default: return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "shortlisted": return "Shortlisted";
      case "promising": return "Promising";
      case "not-recommended": return "Not Recommended";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage="internships" currentUser={currentUser} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{internship.internship_title}</h1>
            <p className="text-lg text-muted-foreground">{internship.company_name}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {internship.location}
          </div>
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            {internship.stipend_inr_month}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {internship.duration_months} Months
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About This Role</h2>
                <p className="text-muted-foreground mb-6">{internship.job_description}</p>
                
                <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {internship.skills_required &&
                    String(internship.skills_required)
                      .split(',')
                      .map((skill) => (
                        <Badge key={skill.trim()} variant="outline">
                          {skill.trim()}
                        </Badge>
                      ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {internship.responsibilities &&
                    String(internship.responsibilities)
                      .split(',')
                      .map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {responsibility.trim()}
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applicants" className="mt-8">
            {!showProgress && !showResults && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Candidate Applications</h2>
                  <Button onClick={runAiShortlisting} variant="government" className="gap-2" disabled={internship.status !== "Closed"}>
                    <Sparkles className="h-4 w-4" />
                    Run AI Shortlisting
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Projects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.candidate_id}>
                        <TableCell>{candidate.candidate_id}</TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.candidate_degree}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.technical_skills.split(',').map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {candidate.projects}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {showProgress && (
              <div className="bg-card p-12 rounded-lg border shadow-sm text-center">
                <div className="max-w-md mx-auto">
                  <Sparkles className="h-12 w-12 mx-auto mb-6 text-primary animate-spin" />
                  <h2 className="text-xl font-semibold mb-4">AI Smart Allocation Engine in Action!</h2>
                  <p className="text-muted-foreground mb-8">
                    Our AI is finding the best matches... Please wait.
                  </p>
                  <Progress value={aiProgress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">{aiProgress}% Complete</p>
                  
                  {/* {aiProgress === 100 && (
                    <Button 
                      onClick={() => setShowResults(true)} 
                      variant="government" 
                      className="mt-6"
                    >
                      Show Results
                    </Button>
                  )} */}
                </div>
              </div>
            )}

            {showResults && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">AI Shortlisting Results</h2>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Skills</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ranking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.candidate_id}>
                        <TableCell>{candidate.candidate_id}</TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.candidate_degree}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.technical_skills.split(',').map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(candidate.status)}>
                            {getStatusLabel(candidate.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          #{candidate.ranking}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}