import { Users } from "lucide-react";
import { Teacher } from "@/types/category-browser";

interface TeacherCardProps {
    teacher: Teacher;
    onClick: (teacherId: number) => void;
}

export function TeacherCard({ teacher, onClick }: TeacherCardProps) {
    return (
        <div
            className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-blue-100/50 p-6 
                     shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer 
                     hover:scale-105 transform hover:border-blue-200"
            onClick={() => onClick(teacher.id)}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full 
                                  flex items-center justify-center text-white font-bold text-lg">
                        {(teacher.user_name || teacher.user_email)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 
                                     transition-colors duration-300 line-clamp-1">
                            {teacher.user_name || teacher.user_email}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                            <Users className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-slate-600">Teacher</span>
                        </div>
                    </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${teacher.is_available
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                    {teacher.is_available ? '✓ Available' : '○ Busy'}
                </span>
            </div>

            {teacher.bio && (
                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {teacher.bio}
                </p>
            )}

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {teacher.experience_years && (
                        <div className="flex items-center space-x-2 text-slate-600">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>{teacher.experience_years}+ years exp</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-2 text-slate-600">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span>{teacher.qualification_count || 0} certs</span>
                    </div>
                </div>
                {teacher.hourly_rate_one_on_one && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between">
                        <span className="text-sm text-blue-700 font-medium">1-on-1 Rate</span>
                        <span className="text-lg font-bold text-blue-600">
                            ${teacher.hourly_rate_one_on_one}/hr
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}