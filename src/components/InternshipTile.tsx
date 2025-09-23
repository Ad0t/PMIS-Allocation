import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface InternshipTileProps {
  internship_id: string;
  internship_title: string;
  company_name: string;
  companyLogo?: string;
  location: string;
  capacity: number;
  // applicants: number;
  status: "Open" | "Closed";
  onClick?: (id: string) => void;
}

export function InternshipTile({
  internship_id,
  internship_title,
  company_name,
  companyLogo,
  location,
  capacity,
  status,
  onClick
}: InternshipTileProps) {
  const isActive = status === "Open";
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
        isActive 
          ? "border-success hover:border-success/80 bg-success-light/10" 
          : "border-warning hover:border-warning/80 bg-warning-light/10 opacity-75"
      )}
      onClick={() => onClick?.(internship_id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <img src={companyLogo} alt={company_name} className="h-12 w-12 rounded-lg object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {company_name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg leading-tight">{internship_title}</h3>
              <p className="text-sm text-muted-foreground">{company_name}</p>
            </div>
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "text-xs",
              isActive ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
            )}
          >
            {isActive ? "Open" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{capacity} applicants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}