import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ApprovalStatusCardProps {
    approval_status: 'pending' | 'approved' | 'rejected' | null;
    admin_notes: string;
}

export function ApprovalStatusCard({ approval_status, admin_notes }: ApprovalStatusCardProps) {
    if (!approval_status) return null;

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    {approval_status === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : approval_status === 'rejected' ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                    )}
                    <div>
                        <p className="font-semibold">
                            Application Status:
                            <Badge
                                className="ml-2"
                                variant={
                                    approval_status === 'approved' ? 'default' :
                                        approval_status === 'rejected' ? 'destructive' :
                                            'secondary'
                                }
                            >
                                {approval_status.charAt(0).toUpperCase() + approval_status.slice(1)}
                            </Badge>
                        </p>
                        {admin_notes && (
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Admin Notes:</strong> {admin_notes}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}