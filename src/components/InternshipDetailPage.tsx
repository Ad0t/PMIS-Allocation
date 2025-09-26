// In src/components/InternshipDetailPage.tsx

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

// Updated Candidate interface to match the 'results' table structure
interface Candidate {
  CandidateID: string;
  Projects: string;
  Rank: number;
  Score: number;
  Technical_Skills: string;
}


export function InternshipDetailPage({ internshipId, onBack, onLogout, onNavigate, currentUser }: InternshipDetailPageProps) {
  const [internship, setInternship] = useState<Internship | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [aiProgress, setAiProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiJson<Internship>(`/api/internships/${internshipId}`)
      .then((internshipData) => {
        setInternship(internshipData);
      })
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, [internshipId]);
  
  const runAiShortlisting = async () => {
    setShowProgress(true);
    setActiveTab("applicants");
    setAiProgress(30);
    
    try {
      const results = await apiJson(`/api/shortlist/${internshipId}`);
      const shortlistedCandidates = results.data[0]; 
      setAiProgress(100);
      setTimeout(() => {
        setCandidates(shortlistedCandidates);
        setShowProgress(false);
        setShowResults(true);
      }, 12000); // A short delay for a smoother UI transition
    } catch (error) {
      console.error('Error running AI shortlisting:', error);
      setShowProgress(false);
    }
  };
  
  if (loading || !internship) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-xl">
                {loading ? "Loading internship details..." : "Internship not found."}
            </p>
        </div>
    );
  }

  const getStatusVariant = (rank: number) => {
    if (rank <= 5) return "success";
    if (rank <= 10) return "default";
    return "secondary";
  };
  
  const getStatusLabel = (rank: number) => {
    if (rank <= 5) return "Top Candidate";
    if (rank <= 10) return "Recommended";
    return "Considerable";
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
                  <Button onClick={runAiShortlisting} variant="government" className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    Run AI Shortlisting
                  </Button>
                </div>
                <p className="text-muted-foreground">Click "Run AI Shortlisting" to view the ranked candidates for this internship.</p>
              </div>
            )}

            {showProgress && (
              <div className="bg-card p-12 rounded-lg border shadow-sm text-center">
                <div className="max-w-md mx-auto">
                  <Sparkles className="h-12 w-12 mx-auto mb-6 text-primary animate-pulse" />
                  <h2 className="text-xl font-semibold mb-4">Fetching Shortlisted Candidates...</h2>
                  <p className="text-muted-foreground mb-8">
                    Please wait while we load the results.
                  </p>
                  <Progress value={aiProgress} className="mb-4" />
                  <p className="text-sm text-muted-foreground">{aiProgress}% Complete</p>
                </div>
              </div>
            )}

            {showResults && (
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">AI Shortlisting Results</h2>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Candidate ID</TableHead>
                      <TableHead>Technical Skills</TableHead>
                      <TableHead>Required Skills</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.CandidateID}>
                        <TableCell className="font-semibold">#{candidate.Rank}</TableCell>
                        <TableCell className="font-medium">{candidate.CandidateID}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {candidate.Technical_Skills && typeof candidate.Technical_Skills === 'string' ? (
                              <>
                                {candidate.Technical_Skills.split(',').slice(0, 4).map((skill) => (
                                  <Badge key={skill.trim()} variant="secondary" className="text-xs">
                                    {skill.trim()}
                                  </Badge>
                                ))}
                                {candidate.Technical_Skills.split(',').length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{candidate.Technical_Skills.split(',').length - 4} more
                                    </Badge>
                                )}
                              </>
                            )  : (
                              <Badge variant="outline" className="text-xs">No skills listed</Badge>
                            // {candidate.Technical_Skills.split(',').slice(0, 4).map((skill) => (
                            //   <Badge key={skill.trim()} variant="secondary" className="text-xs">
                            //     {skill.trim()}
                            //   </Badge>
                            // ))}
                            // {candidate.Technical_Skills.split(',').length > 4 && (
                            //     <Badge variant="outline" className="text-xs">
                            //         +{candidate.Technical_Skills.split(',').length - 4} more
                            //     </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                          {internship.skills_required}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {(candidate.Score * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(candidate.Rank)}>
                            {getStatusLabel(candidate.Rank)}
                          </Badge>
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