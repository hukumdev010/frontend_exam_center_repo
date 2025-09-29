import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

interface QualificationsCardProps {
    qualifications: string;
    onQualificationsChange: (qualifications: string) => void;
    editing: boolean;
}

export function QualificationsCard({ qualifications, onQualificationsChange, editing }: QualificationsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Educational Qualifications
                </CardTitle>
                <CardDescription>
                    List your educational background, degrees, and certifications
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications & Degrees</Label>
                    <Textarea
                        id="qualifications"
                        placeholder="List your degrees, certifications, courses, and relevant qualifications..."
                        value={qualifications}
                        onChange={(e) => onQualificationsChange(e.target.value)}
                        disabled={!editing}
                        rows={4}
                    />
                </div>
            </CardContent>
        </Card>
    );
}