import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Target, XCircle, Play } from "lucide-react";
import Link from "next/link";
import { UserProgress } from "../services";

interface ContinueLearningProps {
    progress: UserProgress[];
}

export function ContinueLearning({ progress }: ContinueLearningProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off or start something new</CardDescription>
            </CardHeader>
            <CardContent>
                {progress.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500 mb-4">No progress yet. Start your learning journey!</p>
                        <Link href="/">
                            <Button>Browse Certifications</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {progress.slice(0, 3).map((prog) => (
                            <div key={prog.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-medium">{prog.certification_name}</h3>
                                        {prog.passed ? (
                                            <Badge className="bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />Passed
                                            </Badge>
                                        ) : prog.score >= 70 ? (
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                <Target className="w-3 h-3 mr-1" />Close
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-800">
                                                <XCircle className="w-3 h-3 mr-1" />Needs Work
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Best Score: {prog.score}%</span>
                                            <span>Attempts: {prog.attempts}</span>
                                        </div>
                                        <Progress value={prog.score} className="h-2" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <Link href={`/quiz/${prog.certification_id}`}>
                                        <Button size="sm">
                                            <Play className="w-4 h-4 mr-2" />
                                            {prog.score > 0 ? "Retry" : "Start"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}