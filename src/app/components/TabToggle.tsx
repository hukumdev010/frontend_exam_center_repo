interface TabToggleProps {
    activeTab: 'certifications' | 'teachers';
    onTabChange: (tab: 'certifications' | 'teachers') => void;
}

export default function TabToggle({ activeTab, onTabChange }: TabToggleProps) {
    return (
        <div className="flex bg-gray-100 rounded-lg p-1">
            <button
                onClick={() => onTabChange('certifications')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'certifications'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                Certifications
            </button>
            <button
                onClick={() => onTabChange('teachers')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'teachers'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                Teachers
            </button>
        </div>
    );
}