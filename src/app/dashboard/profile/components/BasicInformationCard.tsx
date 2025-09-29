import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface BasicInformationCardProps {
    bio: string;
    onBioChange: (bio: string) => void;
    editing: boolean;
}

export function BasicInformationCard({ bio, onBioChange, editing }: BasicInformationCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                </CardTitle>
                <CardDescription>
                    Tell us about yourself and your background
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                        id="bio"
                        placeholder="Write a brief professional bio describing your background, expertise, and teaching philosophy..."
                        value={bio}
                        onChange={(e) => onBioChange(e.target.value)}
                        disabled={!editing}
                        rows={4}
                    />
                    <p className="text-xs text-gray-500">
                        This will be visible to students when they book your sessions.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}