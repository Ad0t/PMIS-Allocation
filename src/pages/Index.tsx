import { useState } from "react";
import { LoginPage } from "@/components/LoginPage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { CandidateListingPage } from "@/components/CandidateListingPage";
import { InternshipDetailPage } from "@/components/InternshipDetailPage";
import { InternshipsPage } from "@/components/InternshipsPage";
import { CandidatesPage } from "@/components/CandidatesPage";
import { apiPath } from "@/lib/api"; 

type AppState = "login" | "dashboard" | "candidates" | "internships" | "internship-detail" | "candidates-db" | "companies" | "reports";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("login");
  const [selectedInternshipId, setSelectedInternshipId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(apiPath('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentUser(data.username);
        setCurrentState("dashboard");
      } else {
        // Handle failed login, e.g., show an error message
        console.error("Login failed:", data.message);
        // You can also use a state to display the error to the user
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setCurrentState("login");
    setSelectedInternshipId("");
    setCurrentUser("");
  };

  const handleInternshipClick = (id: string) => {
    setSelectedInternshipId(id);
    setCurrentState("internship-detail");
  };

  const handleBackToInternships = () => {
    setCurrentState("internships");
    setSelectedInternshipId("");
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
        currentUser={currentUser}
      />
    );
  }

  if (currentState === "internships") {
    return (
      <InternshipsPage
        onLogout={handleLogout}
        onInternshipClick={handleInternshipClick}
        onNavigate={handleNavigate}
        currentPage="internships"
        currentUser={currentUser}
      />
    );
  }

  if (currentState === "internship-detail") {
    return (
      <InternshipDetailPage
        internshipId={selectedInternshipId}
        onBack={handleBackToInternships}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />
    );
  }

  if (currentState === "candidates-db") {
    return (
      <CandidatesPage
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage="candidates"
        currentUser={currentUser}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentUser={currentUser}
    />
  );
};

export default Index;
