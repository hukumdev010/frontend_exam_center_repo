"use client"; "use client"; "use client";



import { useRouter } from "next/navigation";



interface Category {import { useRef } from "react"; "use client";

id: number;

name: string; import { ChevronLeft, ChevronRight } from "lucide-react";

description: string;

slug: string; import { Button } from "@/components/ui/button"; import { useRef } from "react";

icon: string;

color: string; import { useRouter } from "next/navigation"; import { ChevronLeft, ChevronRight } from "lucide-react";

}

import { Button } from "@/components/ui/button";

interface CategoryGroup {

    parent: Category;interface Category {import { useRouter } from "next/navigation";

children: Category[];

}    id: number;



interface CategoryGroupsDisplayProps { name: string;interface Category {

    groups: CategoryGroup[];

}    description: string; id: number;



export function CategoryGroupsDisplay({ groups }: CategoryGroupsDisplayProps) {
    slug: string; name: string;

    const router = useRouter();

    icon: string; description: string;

    const getIconComponent = (iconName: string) => {

        const icons: { [key: string]: string } = {
            color: string; slug: string;

            'computer': "💻",

            'language': "🌍",
        }    icon: string;

        'academic': "📚",

            'aws': "☁️", color: string;

        'azure': "🌐",

            'google-cloud': "🌟", interface CategoryGroup { }

        'gcp': "🌟",

            'programming': "💻", parent: Category;

        'code': "💻",

            'database': "🗄️", children: Category[]; interface CategoryGroup {

            'cybersecurity': "🛡️",

            'shield': "🛡️",
        }    parent: Category;

        'networking': "🌐",

            'network': "🌐", children: Category[];

        'linux': "🐧",

            'devops': "⚙️", interface CategoryGroupsDisplayProps { }

        'data-analytics': "📊",

            'chart': "📊", groups: CategoryGroup[];

        'project-management': "📋",

            'project': "📋",}interface CategoryGroupsDisplayProps {

                'system-design': "🏗️",

                'architecture': "🏗️", groups: CategoryGroup[];

    'book': "📚",

        'book-open': "📖",export function CategoryGroupsDisplay({ groups }: CategoryGroupsDisplayProps) { }

    'calculator': "🧮",

        'atom': "⚛️",    const router = useRouter();

    'dna': "🧬",

        'test-tube': "🧪",    const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({}); export function CategoryGroupsDisplay({ groups }: CategoryGroupsDisplayProps) {

            'flask': "🧪"

        }; const router = useRouter();

    return icons[iconName] || "📚";

}; const scroll = (groupSlug: string, direction: "left" | "right") => {
    const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});



    const getCategoryColor = (color: string) => {
        const scrollContainer = scrollRefs.current[groupSlug];

        const colors: { [key: string]: string } = {

            'blue': 'bg-blue-50 border-blue-200 hover:bg-blue-100', if(scrollContainer) {
                const scroll = (groupSlug: string, direction: "left" | "right") => {

                    'rose': 'bg-rose-50 border-rose-200 hover:bg-rose-100',

                        'amber': 'bg-amber-50 border-amber-200 hover:bg-amber-100',            const scrollAmount = 280; const scrollContainer = scrollRefs.current[groupSlug];

                    'orange': 'bg-orange-50 border-orange-200 hover:bg-orange-100',

                        'green': 'bg-green-50 border-green-200 hover:bg-green-100', scrollContainer.scrollBy({
                            if(scrollContainer) {

                                'purple': 'bg-purple-50 border-purple-200 hover:bg-purple-100',

                                    'red': 'bg-red-50 border-red-200 hover:bg-red-100', left: direction === "left" ? -scrollAmount : scrollAmount,            const scrollAmount = 280;

                                'teal': 'bg-teal-50 border-teal-200 hover:bg-teal-100',

                                    'cyan': 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100', behavior: "smooth", scrollContainer.scrollBy({

                                        'gray': 'bg-gray-50 border-gray-200 hover:bg-gray-100'

                                    };
                            }); left: direction === "left" ? -scrollAmount : scrollAmount,

        return colors[color] || 'bg-slate-50 border-slate-200 hover:bg-slate-100';

                };
            }                behavior: "smooth",



            const getParentColor = (color: string) => { };
        });

        const colors: { [key: string]: string } = {

            'blue': 'from-blue-600 to-blue-700',
        }

        'rose': 'from-rose-600 to-rose-700',

            'amber': 'from-amber-600 to-amber-700'    const getIconComponent = (iconName: string) => { };

    };

    return colors[color] || 'from-slate-600 to-slate-700'; switch (iconName) {

    };

            case 'computer': const getIconComponent = (iconName: string) => {

    const handleCategoryClick = (categorySlug: string) => {

        router.push(`/category/${categorySlug}`); return "💻";        // For simplicity, we'll use emojis as icons since lucide icons would need individual imports

    };

            case 'language': switch (iconName) {

    if (groups.length === 0) {

    return (                return "🌍";            case 'computer':

    <div className="text-center py-8 text-slate-500">

        <div className="text-4xl mb-4">📂</div>            case 'academic':                return "💻";

        <h3 className="text-lg font-semibold mb-2">No categories available</h3>

        <p className="text-sm">Check back later for new certification categories.</p>                return "📚";            case 'language':

    </div>

        );            case 'aws': return "🌍";

}

return "☁️";            case 'academic':

return (

    <div className="space-y-6">            case 'azure':                return "🎓";

        {groups.map((group) => (

            <div key={group.parent.slug}>                return "🌐";            case 'aws':

                {/* Group Header */}

                <div className="flex items-center mb-4">            case 'gcp':                return "☁️";

                    <div className="bg-white rounded-lg p-2 mr-3 shadow-sm">

                        <span className="text-lg">{getIconComponent(group.parent.icon)}</span>            case 'google-cloud':            case 'azure':

                    </div>

                    <div>                return "🌟";                return "🌐";

                        <h2 className={`text-lg font-bold bg-gradient-to-r ${getParentColor(group.parent.color)} bg-clip-text text-transparent`}>

                            {group.parent.name}            case 'code':            case 'gcp':

                        </h2>

                        <p className="text-xs text-slate-600">{group.parent.description}</p>            case 'programming':            case 'google-cloud':

                    </div>

                </div>                return "💻";                return "🌟";



                {/* Categories Horizontal Scroll */}            case 'server':            case 'code':

                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>

                    {group.children.map((category) => (                return "🖥️";            case 'programming':

                    <div

                        key={category.id} case 'database':                return "💻";

                    className={`flex-shrink-0 w-48 rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${getCategoryColor(category.color)}`}

                    onClick={() => handleCategoryClick(category.slug)}                return "🗄️";            case 'server':

                            >

                    <div className="flex items-center mb-2">            case 'shield':                return "🖥️";

                        <div className="bg-white rounded-lg p-1.5 mr-2 shadow-sm">

                            <span className="text-sm">{getIconComponent(category.icon)}</span>            case 'cybersecurity':            case 'terminal':

                        </div>

                        <h3 className="text-xs font-semibold text-slate-900 flex-1">{category.name}</h3>                return "🛡️";                return "⌨️";

                    </div>

                    case 'network':            case 'database':

                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">

                        {category.description || "Explore certifications"}            case 'networking':                return "🗄️";

                    </p>

                    return "🌐";            case 'cybersecurity':

                    <div className="bg-white/60 rounded-md border p-1.5 text-center hover:bg-white/80 transition-colors">

                        <span className="text-xs font-medium text-slate-700">            case 'linux':            case 'shield':

                            View Certifications →

                        </span>                return "🐧";                return "🛡️";

                    </div>

                </div>            case 'devops':            case 'networking':

                        ))}

            </div>                return "⚙️";            case 'network':

    </div>

))}            case 'chart': return "🌐";

        </div >

    );            case 'data-analytics':            case 'linux':

}
return "📊"; return "🐧";

            case 'algorithm':            case 'devops':

            case 'data-structures-algorithms': return "⚙️";

return "🧮";            case 'chart':

            case 'project':            case 'data-analytics':

            case 'project-management': return "📊";

return "📋";            case 'algorithm':

            case 'architecture':            case 'data-structures-algorithms':

            case 'system-design': return "🧮";

return "🏗️";            case 'project':

            case 'calculator':            case 'project-management':

return "🧮"; return "📋";

            case 'atom':            case 'architecture':

return "⚛️";            case 'system-design':

            case 'dna': return "🏗️";

return "🧬";            case 'calculator':

            case 'test-tube': return "🧮";

return "🧪";            case 'atom':

            case 'book-open': return "⚛️";

return "📖";            case 'dna':

            case 'book': return "🧬";

return "📚";            case 'test-tube':

            case 'flag-de': return "🧪";

return "🇩🇪";            case 'book-open':

            case 'flag-fr': return "📖";

return "🇫🇷";            case 'book':

            case 'flag-es': return "📚";

return "🇪🇸";            case 'flag-sa':

            case 'flag-us': return "🇸🇦";

return "🇺🇸";            case 'flag-cn':

            case 'flask': return "🇨🇳";

return "🧪";            case 'flag-fr':

            default: return "🇫🇷";

return "📚";            case 'flag-de':

        }                return "🇩🇪";

    };            case 'flag-it':

return "🇮🇹";

const getCategoryColor = (color: string) => {            case 'flag-jp':

    switch (color) {                return "🇯🇵";

            case 'blue':            case 'flag-kr':

return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200'; return "🇰🇷";

            case 'rose':            case 'flag-pt':

return 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-200'; return "🇵🇹";

            case 'amber':            case 'flag-ru':

return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200'; return "🇷🇺";

            case 'orange':            case 'flag-es':

return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200'; return "🇪🇸";

            case 'purple':            case 'flag-us':

return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200'; return "🇺🇸";

            case 'green':            case 'flask':

return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200'; return "🧪";

            case 'red':            default:

return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200'; return "📚";

            case 'teal':        }

return 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200';    };

            case 'cyan':

return 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200'; const getCategoryColor = (color: string) => {

            case 'emerald': switch (color) {

                return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200';            case 'orange':

            case 'yellow': return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300';

return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200';            case 'blue':

            case 'gray': return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300';

return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200';            case 'purple':

            default: return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300';

return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200';            case 'green':

        }                return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300';

    };            case 'red':

return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200 hover:border-red-300';

const getParentColor = (color: string) => {            case 'indigo':

    switch (color) {                return 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300';

            case 'blue':            case 'violet':

return 'from-blue-600 to-blue-700'; return 'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:from-violet-100 hover:to-violet-200 hover:border-violet-300';

            case 'rose':            case 'pink':

return 'from-rose-600 to-rose-700'; return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-200 hover:border-pink-300';

            case 'amber':            case 'teal':

return 'from-amber-600 to-amber-700'; return 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200 hover:border-teal-300';

            default:            case 'cyan':

return 'from-slate-600 to-slate-700'; return 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200 hover:border-cyan-300';

        }            case 'emerald':

    }; return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300';

            case 'yellow':

const handleCategoryClick = (categorySlug: string) => {
    return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 hover:border-yellow-300';

    router.push(`/category/${categorySlug}`);            case 'gray':

}; return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300';

            case 'rose':

if (groups.length === 0) {
    return 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-200 hover:border-rose-300';

    return (            case 'amber':

    <div className="text-center py-8 text-slate-500">                return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200 hover:border-amber-300';

        <div className="text-4xl mb-4">📂</div>            default:

        <h3 className="text-lg font-semibold mb-2">No categories available</h3>                return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200 hover:border-slate-300';

        <p className="text-sm">Check back later for new certification categories.</p>        }

    </div>
};

        );

    }    const handleCategoryClick = (categorySlug: string) => {

    router.push(`/category/${categorySlug}`);

    return (    };

<div className="space-y-6">

    {groups.map((group) => (    if (categoryGroups.length === 0) {

        <div key={group.parent.slug} className="relative">        return (

            {/* Group Header */}            <div className="text-center py-12 text-slate-500">

                <div className="flex items-center mb-4">                <div className="text-6xl mb-4">📂</div>

                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 mr-3 shadow-sm">                <h3 className="text-xl font-semibold mb-2">No categories available</h3>

                        <span className="text-lg">{getIconComponent(group.parent.icon)}</span>                <p>Check back later for new certification categories.</p>

                    </div>            </div>

                <div>        );

                    <h2 className={`text-lg font-bold bg-gradient-to-r ${getParentColor(group.parent.color)} bg-clip-text text-transparent`}>    }

                        {group.parent.name}

                    </h2>    return (

                    <p className="text-xs text-slate-600">{group.parent.description}</p>        <div className="space-y-12">

                    </div>            {categoryGroups.map((group) => (

                    </div>                <div key={group.parent.id} className="w-full">

                    {/* Group Header */}

                    {/* Scroll Navigation - Only show if more than 5 items */}                    <div className="mb-6">

                        {group.children.length > 5 && (<div className="flex items-center mb-4">

                            <>                            <div className={`rounded-2xl p-4 mr-4 ${getCategoryColor(group.parent.color)} shadow-lg`}>

                                <Button                                <span className="text-4xl">{getIconComponent(group.parent.icon)}</span>

                                variant="outline"                            </div>

                                size="sm"                            <div>

                                    onClick={() => scroll(group.parent.slug, "left")}                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{group.parent.name}</h2>

                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-7 w-7 p-0                                 <p className="text-lg text-slate-600">{group.parent.description}</p>

                                    bg-white/90 backdrop-blur-sm shadow-md border-slate-200 hover:bg-slate-50"                            </div>

                            >                        </div>

                            <ChevronLeft className="w-3 h-3 text-slate-600" />                        <div className="w-full h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full"></div>

                        </Button>                    </div>



                    <Button                    {/* Categories Grid - 4 columns on xl, 3 on lg, 2 on md, 1 on sm */}

                        variant="outline"                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        size="sm"                        {group.children.map((category) => (

                            onClick = {() => scroll(group.parent.slug, "right")}                            <div

                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-7 w-7 p-0                                 key={category.id}

                                         bg-white/90 backdrop-blur-sm shadow-md border-slate-200 hover:bg-slate-50"                                className={`rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 

                            >                                          ${getCategoryColor(category.color)} shadow-md`}

                                <ChevronRight className="w-3 h-3 text-slate-600" />                                onClick={() => handleCategoryClick(category.slug)}

                    </Button>                            >

                </>                                {/* Category Header */}

                    )}                                <div className="flex items-center mb-3">

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 mr-3 shadow-sm">

                        {/* Categories Horizontal Scroll Container */}                                        <span className="text-xl">{getIconComponent(category.icon)}</span>

                        <div                                    </div>

                    ref={(el) => (scrollRefs.current[group.parent.slug] = el)}                                    <div className="flex-1">

                        className="flex gap-3 overflow-x-auto scrollbar-hide px-6 py-1"                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-tight">

                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}                                            {category.name}

                    >                                        </h3>

                        {group.children.map((category) => (                                    </div>

                    <div                                </div>

                key={category.id}

                className={`flex-shrink-0 w-48 rounded-lg border p-3 transition-all duration-200 hover:shadow-md cursor-pointer                                 {/* Category Description */}

                                          ${getCategoryColor(category.color)} shadow-sm hover:scale-105`}                                <div className="mb-3">

                    onClick={() => handleCategoryClick(category.slug)}                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">

                            >                                        {category.description || "Explore certifications in this category"}

                        {/* Category Header */}                                    </p>

                    <div className="flex items-center mb-2">                                </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1.5 mr-2 shadow-sm">

                        <span className="text-sm">{getIconComponent(category.icon)}</span>                                {/* View More Button */}

                    </div>                                <div className="pt-2">

                        <div className="flex-1">                                    <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/70 p-2 text-center hover:bg-white/80 transition-all duration-200">

                            <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">{category.name}</h3>                                        <span className="text-xs font-medium text-slate-700">

                        </div>                                            View Certifications →

                        </div>                                        </span>

                </div>

                {/* Category Description */}                                </div>

            <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">                            </div>

                                    {category.description || "Explore certifications in this category"}                        ))}

</p>                    </div >

                </div >

    {/* View More Button */ }            ))}

                                <div className="bg-white/60 backdrop-blur-sm rounded-md border border-white/70 p-1.5 text-center hover:bg-white/80 transition-all duration-200">        </div>

                                    <span className="text-xs font-medium text-slate-700">    );

                                        View Certifications →}
                                    </span>
                                </div >
                            </div >
                        ))}
                    </div >
                </div >
            ))}
        </div >
    );
}