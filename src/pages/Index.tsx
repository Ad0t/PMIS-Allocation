import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { CandidateListingPage } from "@/components/CandidateListingPage";
import { InternshipsPage } from "@/components/InternshipsPage";
import { CandidatesPage } from "@/components/CandidatesPage";
import { CompaniesPage } from "@/components/CompaniesPage";
import { ReportsPage } from "@/components/ReportsPage";

type AppState = "login" | "dashboard" | "candidates" | "internships" | "candidates-db" | "companies" | "reports";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("login");
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>("");

  const handleLogin = (username: string, password: string) => {
    // In a real app, you'd validate credentials here
    console.log("Login attempt:", { username, password });
    setCurrentState("dashboard");
  };

  const handleLogout = () => {
    setCurrentState("login");
    setSelectedInternshipId("");
  };

  const handleInternshipClick = (id: string) => {
    setSelectedInternshipId(id);
    setCurrentState("candidates");
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
    setSelectedInternshipId("");
  };

  const handleNavigate = (page: string) => {
    if (page === "candidates") {
      setCurrentState("candidates-db");
    } else {
      setCurrentState(page as AppState);
    }
  };

  if (currentState === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentState === "candidates") {
    return (
      <CandidateListingPage
        internshipId={selectedInternshipId}
        onBack={handleBackToDashboard}
        onLogout={handleLogout}
      />
    );
  }

  if (currentState === "internships") {
    return (
      <InternshipsPage
        onLogout={handleLogout}
        onViewApplicants={handleInternshipClick}
        onNavigate={handleNavigate}
        currentPage="internships"
      />
    );
  }

  if (currentState === "candidates-db") {
    return (
      <CandidatesPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage="candidates"
      />
    );
  }

  if (currentState === "companies") {
    return (
      <CompaniesPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage="companies"
      />
    );
  }

  if (currentState === "reports") {
    return (
      <ReportsPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage="reports"
      />
    );
  }

  return (
    <AdminDashboard
      onInternshipClick={handleInternshipClick}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
};

export default Index;
