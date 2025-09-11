import { useState } from "react";
import { GovHeader } from "./GovHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Calendar, DollarSign, Sparkles } from "lucide-react";

const mockInternship = {
  id: "1",
  title: "Software Development Intern",
  company: "GAIL (India) Limited",
  location: "New Delhi",
  stipend: "₹15,000/month",
  duration: "6 months",
  description: "Join our dynamic software development team and work on cutting-edge projects that impact millions of users across India. You'll be developing web applications, mobile solutions, and contributing to our digital transformation initiatives.",
  skillsRequired: ["React", "Node.js", "JavaScript", "Python", "SQL"],
  responsibilities: [
    "Develop and maintain web applications using modern frameworks",
    "Collaborate with cross-functional teams to deliver high-quality software",
    "Participate in code reviews and follow best practices",
    "Contribute to technical documentation and testing procedures"
  ]
};

const mockCandidates = [
  {
    id: 1,
    name: "Priya Sharma",
    education: "B.Tech Computer Science",
    skills: ["React", "JavaScript", "Python"],
    projects: "E-commerce Platform, Weather App",
    status: "shortlisted",
    ranking: 1
  },
  {
    id: 2,
    name: "Rahul Kumar",
    education: "B.Tech Information Technology",
    skills: ["Node.js", "MongoDB", "Express"],
    projects: "Social Media App, Blog Platform",
    status: "promising",
    ranking: 2
  },
  {
    id: 3,
    name: "Ananya Patel",
    education: "BCA",
    skills: ["JavaScript", "React", "SQL"],
    projects: "Task Manager, Portfolio Website",
    status: "shortlisted",
    ranking: 3
  },
  {
    id: 4,
    name: "Vikram Singh",
    education: "B.Tech Computer Science",
    skills: ["Python", "Django", "PostgreSQL"],
    projects: "Inventory System, CRM Tool",
    status: "not-recommended",
    ranking: 4
  },
  {
    id: 5,
    name: "Sneha Gupta",
    education: "M.Tech Software Engineering",
    skills: ["React", "Node.js", "Docker"],
    projects: "Microservices App, DevOps Pipeline",
    status: "promising",
    ranking: 5
  }
];

interface InternshipDetailPageProps {
  internshipId: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function InternshipDetailPage({ internshipId, onBack, onLogout, onNavigate }: InternshipDetailPageProps) {
  const [aiProgress, setAiProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

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
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage="internships" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{mockInternship.title}</h1>
            <p className="text-lg text-muted-foreground">{mockInternship.company}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {mockInternship.location}
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {mockInternship.stipend}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {mockInternship.duration}
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
                <p className="text-muted-foreground mb-6">{mockInternship.description}</p>
                
                <h3 className="text-lg font-semibold mb-3">Skills Required</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {mockInternship.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {mockInternship.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {responsibility}
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
                    {mockCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.id}</TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.education}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map((skill) => (
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
                  
                  {aiProgress === 100 && (
                    <Button 
                      onClick={() => setShowResults(true)} 
                      variant="government" 
                      className="mt-6"
                    >
                      Show Results
                    </Button>
                  )}
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
                    {mockCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell>{candidate.id}</TableCell>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell>{candidate.education}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.map((skill) => (
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