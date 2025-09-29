import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, Globe } from "lucide-react";

interface OnlinePresenceCardProps {
    github_url: string;
    linkedin_url: string;
    website_url: string;
    onGithubChange: (url: string) => void;
    onLinkedinChange: (url: string) => void;
    onWebsiteChange: (url: string) => void;
    editing: boolean;
}

export function OnlinePresenceCard({
    github_url,
    linkedin_url,
    website_url,
    onGithubChange,
    onLinkedinChange,
    onWebsiteChange,
    editing
}: OnlinePresenceCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Online Presence
                </CardTitle>
                <CardDescription>
                    Share your professional online profiles and portfolio
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            GitHub Profile
                        </Label>
                        <Input
                            id="github"
                            placeholder="https://github.com/username"
                            value={github_url}
                            onChange={(e) => onGithubChange(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            LinkedIn Profile
                        </Label>
                        <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/in/username"
                            value={linkedin_url}
                            onChange={(e) => onLinkedinChange(e.target.value)}
                            disabled={!editing}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Personal Website/Portfolio
                    </Label>
                    <Input
                        id="website"
                        placeholder="https://yourwebsite.com"
                        value={website_url}
                        onChange={(e) => onWebsiteChange(e.target.value)}
                        disabled={!editing}
                    />
                </div>
            </CardContent>
        </Card>
    );
}