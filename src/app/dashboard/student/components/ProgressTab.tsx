import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import { UserProgress } from "../services";

interface ProgressTabProps {
    progress: UserProgress[];
}

export function ProgressTab({ progress }: ProgressTabProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Your Progress</h2>
                <p className="text-gray-600">Track your performance across all certifications</p>
            </div>

            {progress.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-xl font-medium mb-2">No progress yet</h3>
                        <p className="text-gray-600 mb-6">Start taking quizzes to track your progress</p>
                        <Link href="/dashboard/categories">
                            <Button>Browse Certifications</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {progress.map((prog) => (
                        <Card key={prog.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {prog.certification_name}
                                            {prog.passed && (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" />Passed
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>{prog.category_name}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-600">{prog.score}%</p>
                                        <p className="text-sm text-gray-600">Best Score</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Progress</span>
                                            <span>{prog.score}%</span>
                                        </div>
                                        <Progress value={prog.score} className="h-2" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            <p>Attempts: {prog.attempts}</p>
                                            {prog.last_attempted && (
                                                <p>Last attempt: {new Date(prog.last_attempted).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                        <Link href={`/quiz/${prog.certification_id}`}>
                                            <Button size="sm">
                                                <Play className="w-4 h-4 mr-2" />
                                                {prog.score > 0 ? "Retake Quiz" : "Start Quiz"}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}