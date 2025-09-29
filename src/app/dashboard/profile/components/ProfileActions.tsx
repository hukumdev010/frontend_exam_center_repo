import { Button } from "@/components/ui/button";
import { Save, Edit } from "lucide-react";

interface ProfileActionsProps {
    editing: boolean;
    saving: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export function ProfileActions({ editing, saving, onEdit, onSave, onCancel }: ProfileActionsProps) {
    return (
        <div className="flex justify-between items-center pt-6">
            <div className="text-sm text-gray-600">
                <p>Complete your profile to apply for teaching privileges.</p>
                <p>Admin approval required for teaching access.</p>
            </div>
            <div className="flex gap-3">
                {editing ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button onClick={onSave} disabled={saving}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </>
                ) : (
                    <Button onClick={onEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    );
}