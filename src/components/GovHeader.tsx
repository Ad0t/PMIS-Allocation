import { Button } from "@/components/ui/button";
import { LogOut, Menu, User } from "lucide-react";
import mcaLogo from "@/assets/Ministry_of_Corporate_Affairs_India.png";
import pmInternshipLogo from "@/assets/PMIS_Logo.png";

interface GovHeaderProps {
  currentUser?: string;
  onLogout?: () => void;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

export function GovHeader({ currentUser = "Admin User", onLogout, onNavigate, currentPage = "dashboard" }: GovHeaderProps) {
  return (
    <header className="bg-card border-b-4 border-primary shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar with logos */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center space-x-6">
            <img src={mcaLogo} alt="Ministry of Corporate Affairs" className="h-16 w-auto" />
            <img src={pmInternshipLogo} alt="PM Internship Scheme" className="h-16 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{currentUser}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation bar */}
        <nav className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                className={currentPage === "dashboard" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
                onClick={() => onNavigate?.("dashboard")}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                className={currentPage === "internships" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
                onClick={() => onNavigate?.("internships")}
              >
                Internships
              </Button>
              <Button 
                variant="ghost" 
                className={currentPage === "candidates" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
                onClick={() => onNavigate?.("candidates")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}