import { Award, Users } from "lucide-react";

interface QuickFiltersProps {
    activeTab: 'certifications' | 'teachers';
    onFilterSelect?: (filterType: 'category' | 'subject', value: string) => void;
    onFilterClick?: (filter: string) => void;
}

export default function QuickFilters({ activeTab, onFilterSelect, onFilterClick }: QuickFiltersProps) {
    if (activeTab === 'certifications') {
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Quick Filters
                </h3>

                {/* Categories */}
                <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-3">Categories</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {['Technology', 'Business', 'Design', 'Marketing', 'Science', 'Finance'].map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    onFilterClick?.(category);
                                    onFilterSelect?.('category', category);
                                }}
                                className="p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-left border border-blue-100"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Level & Price */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-xs font-medium text-gray-600 mb-2">Level</h4>
                        <select className="w-full text-xs border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>All Levels</option>
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-600 mb-2">Price</h4>
                        <select className="w-full text-xs border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Any Price</option>
                            <option>Free</option>
                            <option>Under $50</option>
                            <option>$50-200</option>
                            <option>$200+</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Quick Filters
            </h3>

            {/* Subjects */}
            <div>
                <h4 className="text-xs font-medium text-gray-600 mb-3">Subjects</h4>
                <div className="grid grid-cols-2 gap-2">
                    {['Math', 'Science', 'English', 'Programming', 'Business', 'Art'].map((subject) => (
                        <button
                            key={subject}
                            onClick={() => onFilterSelect?.('subject', subject)}
                            className="p-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-left border border-purple-100"
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating & Experience */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Rating</h4>
                    <select className="w-full text-xs border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option>Any Rating</option>
                        <option>4.5+ ⭐</option>
                        <option>4.0+ ⭐</option>
                        <option>3.5+ ⭐</option>
                    </select>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-gray-600 mb-2">Experience</h4>
                    <select className="w-full text-xs border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option>Any Experience</option>
                        <option>1-3 years</option>
                        <option>3-5 years</option>
                        <option>5+ years</option>
                    </select>
                </div>
            </div>
        </div>
    );
}