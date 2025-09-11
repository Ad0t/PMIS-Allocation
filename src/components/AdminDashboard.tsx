import { GovHeader } from "./GovHeader";
import GallerySection from '@/components/GalleryComponent';
import LogoCarousel from "./LogoCarousel";

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
}

export function AdminDashboard({ onLogout, onNavigate }: AdminDashboardProps) {

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage="dashboard" />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to the PM Internship Scheme's Smart Allocation Engine
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Navigate to the Internships hub to begin matching talented candidates with opportunities.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">x</h3>
            <p className="text-lg text-muted-foreground">Total Internships</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-success mb-2">y</h3>
            <p className="text-lg text-muted-foreground">Total Candidates</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-secondary mb-2">z</h3>
            <p className="text-lg text-muted-foreground">Partner Organizations</p>
          </div>
        </div>

        {/* Partition */}
        {/* <div className="my-12">
          <div className="flex items-center justify-center">
            <span className="h-0.5 w-32 bg-orange-500"></span>
            <h2 className="text-4xl font-bold text-gray-800 px-8 whitespace-nowrap">Blah Blah</h2>
            <span className="h-0.5 w-32 bg-orange-500"></span>
          </div>
        </div> */}

        <GallerySection />

        <div className="my-12">
          <div className="flex items-center justify-center">
            <span className="h-0.5 w-32 bg-orange-500"></span>
            <h2 className="text-4xl font-bold text-gray-800 px-8 whitespace-nowrap">Blah Blah</h2>
            <span className="h-0.5 w-32 bg-orange-500"></span>
          </div>
        </div>


        <LogoCarousel />
        {/* Statistics Cards
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">x</h3>
            <p className="text-lg text-muted-foreground">Total Internships</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-success mb-2">y</h3>
            <p className="text-lg text-muted-foreground">Total Candidates</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-secondary mb-2">z</h3>
            <p className="text-lg text-muted-foreground">Partner Organizations</p>
          </div>
        </div> */}

      </main>
    </div>
  );
}