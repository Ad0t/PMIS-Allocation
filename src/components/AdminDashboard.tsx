import { useEffect, useState } from "react";
import { GovHeader } from "./GovHeader";
import GallerySection from '@/components/GalleryComponent';
import LogoCarousel from "./LogoCarousel";
import { apiJson } from "@/lib/api";

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate?: (page: string) => void;
  currentUser?: string;
}

export function AdminDashboard({ onLogout, onNavigate, currentUser }: AdminDashboardProps) {
  const [totalInternships, setTotalInternships] = useState<number | null>(null);
  const [totalCandidates, setTotalCandidates] = useState<number | null>(null);
  const totalRows = (totalInternships ?? 0) + (totalCandidates ?? 0);

  useEffect(() => {
    let mounted = true;

    const fetchCounts = async () => {
      try {
        const internships = await apiJson<any[]>('/api/internships');
        const candidates = await apiJson<any[]>('/api/candidates');
        if (!mounted) return;
        setTotalInternships(Array.isArray(internships) ? internships.length : 0);
        setTotalCandidates(Array.isArray(candidates) ? candidates.length : 0);
      } catch (err) {
        // keep simple: log and leave counts as null
        // In production you might surface this to the UI
        // eslint-disable-next-line no-console
        console.error('Failed to fetch counts', err);
        if (mounted) {
          setTotalInternships(0);
          setTotalCandidates(0);
        }
      }
    };

    fetchCounts();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GovHeader onLogout={onLogout} onNavigate={onNavigate} currentPage="dashboard" currentUser={currentUser} />
      
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
            <h3 className="text-4xl font-bold text-primary mb-2">{totalInternships ?? '—'}</h3>
            <p className="text-lg text-muted-foreground">Total Internships</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-success mb-2">{totalCandidates ?? '—'}</h3>
            <p className="text-lg text-muted-foreground">Total Candidates</p>
          </div>
          <div className="bg-card p-8 rounded-lg border shadow-sm text-center">
            <h3 className="text-4xl font-bold text-secondary mb-2">551</h3>
            <p className="text-lg text-muted-foreground">Partner Organizations</p>
          </div>
        </div>



        <GallerySection />

        {/* Partition */}
        <div className="my-12">
          <div className="flex items-center justify-center">
            <span className="h-0.5 w-32 bg-orange-500"></span>
            <h2 className="text-4xl font-bold text-gray-800 px-8 whitespace-nowrap">Blah Blah</h2>
            <span className="h-0.5 w-32 bg-orange-500"></span>
          </div>
        </div>


        <LogoCarousel />
       

      </main>
    </div>
  );
}