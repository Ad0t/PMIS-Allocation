import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface InternshipTileProps {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  applicants: number;
  status: "active" | "closed";
  onClick?: (id: string) => void;
}

export function InternshipTile({
  id,
  title,
  company,
  companyLogo,
  location,
  applicants,
  status,
  onClick
}: InternshipTileProps) {
  const isActive = status === "active";
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
        isActive 
          ? "border-success hover:border-success/80 bg-success-light/10" 
          : "border-warning hover:border-warning/80 bg-warning-light/10 opacity-75"
      )}
      onClick={() => onClick?.(id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <img src={companyLogo} alt={company} className="h-12 w-12 rounded-lg object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {company.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground">{company}</p>
            </div>
          </div>
          <Badge 
            variant={isActive ? "default" : "secondary"}
            className={cn(
              "text-xs",
              isActive ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"
            )}
          >
            {isActive ? "Active" : "Closed"}
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
            <span>{applicants} applicants</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}