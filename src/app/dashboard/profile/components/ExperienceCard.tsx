import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

interface ExperienceCardProps {
    experience: string;
    onExperienceChange: (experience: string) => void;
    editing: boolean;
}

export function ExperienceCard({ experience, onExperienceChange, editing }: ExperienceCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Experience
                </CardTitle>
                <CardDescription>
                    Describe your work experience and relevant background
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="experience">Work Experience</Label>
                    <Textarea
                        id="experience"
                        placeholder="Describe your professional experience, previous teaching roles, projects, and relevant work history..."
                        value={experience}
                        onChange={(e) => onExperienceChange(e.target.value)}
                        disabled={!editing}
                        rows={4}
                    />
                </div>
            </CardContent>
        </Card>
    );
}