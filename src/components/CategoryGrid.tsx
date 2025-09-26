"use client"; "use client"; "use client"; "use client"; "use client";



import { useRouter } from "next/navigation";



interface Category {import { useRef } from "react";

id: number;

name: string; import { useRouter } from "next/navigation";

description: string;

slug: string; import { ChevronLeft, ChevronRight } from "lucide-react"; import { useRef } from "react";

icon: string;

color: string; import { Button } from "@/components/ui/button";

}

import { useRouter } from "next/navigation";

interface CategoryGroup {

    parent: Category;interface Category {

    children: Category[];

}    id: number; import { ChevronLeft, ChevronRight } from "lucide-react"; import { useRef } from "react"; import { useRouter } from "next/navigation";



interface CategoryGridProps {
    name: string;

    groups?: CategoryGroup[];

}    description: string; import { Button } from "@/components/ui/button";



export function CategoryGrid({ groups = [] }: CategoryGridProps) {
    slug: string;

    const router = useRouter();

    icon: string; import { useRouter } from "next/navigation";

    const handleCategoryClick = (categorySlug: string) => {

        router.push(`/category/${categorySlug}`); color: string;

    };

} interface Category {

    if(groups.length === 0) {

    return (

        <div className="text-center py-8">

            <p>No categories available</p>interface CategoryGroup {id: number;import {ChevronLeft, ChevronRight} from "lucide-react";interface Category {

            </div>

    ); parent: Category;

}

children: Category[]; name: string;

return (

    <div className="space-y-8">}

        {groups.map((group) => (

            <div key={group.parent.id} className="space-y-4">    description: string;import {Button} from "@/components/ui/button";    id: number;

                <div className="flex items-center space-x-2">

                    <h2 className="text-xl font-bold text-slate-900">{group.parent.name}</h2>interface CategoryGridProps {

                        <span className="text-sm text-slate-600">({group.children.length} categories)</span>

                    </div>    groups?: CategoryGroup[];    slug: string;



                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">}

                    {group.children.map((category) => (

                        <div icon:string;    name: string;

                    key={category.id}

                    className="rounded-lg border p-4 bg-white hover:shadow-md cursor-pointer transition-all hover:scale-105"export function CategoryGrid({groups = []}: CategoryGridProps) {

                        onClick = {() => handleCategoryClick(category.slug)}

                            >    const router = useRouter();    color: string;

                    <h3 className="text-sm font-semibold mb-2">{category.name}</h3>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{category.description}</p>

                    <div className="text-xs text-blue-600 font-medium">View Certifications →</div>

                </div>    const handleCategoryClick = (categorySlug: string) => { }interface Category {description: string;

                        ))}

            </div>        router.push(`/category/${categorySlug}`);

    </div>

))}    };

        </div >

    );

}
const scroll = (scrollRef: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    interface CategoryGroup {
        id: number; slug: string;

        if(scrollRef.current) {

        const scrollAmount = 300; parent: Category;

        scrollRef.current.scrollBy({

            left: direction === "left" ? -scrollAmount : scrollAmount, children: Category[]; name: string; icon: string;

            behavior: "smooth",

        });
    }

}

    }; description: string; color: string;



if (groups.length === 0) {
    interface CategoryGridProps {

        return(

            <div className = "text-center py-12 text-slate-500" > groups ?: CategoryGroup[]; slug: string;}

                <div className="text-6xl mb-4">📂</div>

                <h3 className="text-xl font-semibold mb-2">No categories available</h3>
}

<p>Check back later for new certification categories.</p>

            </div > icon: string;

        );

    }export function CategoryGrid({ groups = [] }: CategoryGridProps) {



    return (    const router = useRouter(); color: string; interface CategoryGroup {

        <div className = "space-y-8" >

        {
            groups.map((group) => {

                const scrollRef = useRef<HTMLDivElement>(null);

                const getIconComponent = (iconName: string) => { }    parent: Category;

                return (

                    <div key={group.parent.id} className="space-y-4">        switch (iconName) {

                        <div className="flex items-center space-x-3">

                            <div className="rounded-xl p-2 bg-blue-100">            case 'computer':    children: Category[];

                                <span className="text-2xl">📚</span>

                            </div>                return "💻";

                            <div>

                                <h2 className="text-lg font-bold text-slate-900">{group.parent.name}</h2>            case 'language':interface CategoryGroup { }

                                <p className="text-sm text-slate-600">{group.parent.description}</p>

                            </div>                return "🌐";

                        </div>

            case 'academic':    parent: Category;

                        <div className="relative">

                            <Button return "🎓";

                            variant="outline"

                            size="sm"            case 'aws':    children: Category[];interface CategoryGridProps {

                                onClick = {() => scroll(scrollRef, "left")}

                            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white shadow-lg"                return "☁️";

                            >

                            <ChevronLeft className="w-4 h-4" />            case 'azure':}    categories?: Category[];

                        </Button>

                        return "🌐";

                        <Button

                            variant="outline" case 'gcp':    groups?: CategoryGroup[];

                        size="sm"

                        onClick={() => scroll(scrollRef, "right")}            case 'google-cloud':

                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-8 w-8 p-0 bg-white shadow-lg"

                            >                return "🌟";interface CategoryGridProps { }

                        <ChevronRight className="w-4 h-4" />

                    </Button>            case 'code':



                            < div            case 'programming': groups?: CategoryGroup[];

        ref = { scrollRef }

                                className = "flex gap-4 overflow-x-auto px-10 py-2 scrollbar-hide"                return "💻";

    style = {{ scrollbarWidth: 'none', msOverflowStyle: 'none' }
}

                            >            case 'database':}"use client";

{
    group.children.map((category) => (

        <div return "🗄️";

    key = { category.id }

    className = "flex-shrink-0 w-48 rounded-lg border p-3 bg-white hover:shadow-lg cursor-pointer transition-all"            case 'cybersecurity':

    onClick = {() => handleCategoryClick(category.slug)
}

                                    >            case 'shield':

                                        <h3 className="text-sm font-semibold mb-1">{category.name}</h3>

                                        <p className="text-xs text-gray-600 mb-2">{category.description}</p>                return "🛡️"; export function CategoryGrid({ groups = [] }: CategoryGridProps) {
    import { useRef } from "react";

    <div className="text-xs text-blue-600">View Certifications →</div>

                                    </div >            case 'networking':

                                ))
}

                            </div >            case 'network': const router = useRouter(); import { useRouter } from "next/navigation";

                        </div >

                    </div >                return "🌐";

                );

            })}            case 'linux': import { ChevronLeft, ChevronRight } from "lucide-react";

        </div >

    ); return "🐧";

}
            case 'devops': const getIconComponent = (iconName: string) => {
    import { Button } from "@/components/ui/button";

    return "⚙️";

            case 'chart': switch (iconName) {

    case 'data-analytics':

        return "📊"; case 'computer': interface Category {

            default:

            return "📚";                return "💻"; id: number;

}

    };            case 'language': name: string;



const getCategoryColor = (color: string) => {
    return "🌐"; description: string;

    switch (color) {

        case 'orange': case 'academic': slug: string;

            return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200';

        case 'blue': return "🎓"; icon: string;

            return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200';

        case 'rose': case 'aws': color: string;

            return 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-200';

        case 'amber': return "☁️";
    }

    return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200';

            default:            case 'azure':

return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200';

        }                return "🌐"; interface CategoryGroup {

};

            case 'gcp': parent: Category;

const handleCategoryClick = (categorySlug: string) => {

    router.push(`/category/${categorySlug}`);            case 'google-cloud': children: Category[];

};

return "🌟";}

const scroll = (scrollRef: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {

    if (scrollRef.current) {            case 'code':

        const scrollAmount = 300;

        scrollRef.current.scrollBy({ case 'programming': interface CategoryGridProps {

            left: direction === "left" ? -scrollAmount : scrollAmount,

            behavior: "smooth", return "💻"; groups?: CategoryGroup[];

        });

    }            case 'server':
}

    };

return "🖥️";

if (groups.length === 0) {

    return (            case 'terminal': export function CategoryGrid({ groups = [] }: CategoryGridProps) {

        <div className="text-center py-12 text-slate-500">

            <div className="text-6xl mb-4">📂</div>                return "⌨️";    const router = useRouter();

            <h3 className="text-xl font-semibold mb-2">No categories available</h3>

            <p>Check back later for new certification categories.</p>            case 'database':

        </div>

        ); return "🗄️"; const getIconComponent = (iconName: string) => {

        }

            case 'cybersecurity':        // For simplicity, we'll use emojis as icons since lucide icons would need individual imports

        return (

            <div className="space-y-8">            case 'shield':        switch (iconName) {

                {
                    groups.map((group) => {

                        const scrollRef = useRef<HTMLDivElement>(null); return "🛡️";            case 'aws':



                return (            case 'networking':                return "☁️";

                <div key={group.parent.id} className="space-y-4">

                    <div className="flex items-center space-x-3">            case 'network':            case 'azure':

                        <div className={`rounded-xl p-2 ${getCategoryColor(group.parent.color)}`}>

                            <span className="text-2xl">{getIconComponent(group.parent.icon)}</span>                return "🌐";                return "🌐";

                        </div>

                        <div>            case 'linux':            case 'gcp':

                            <h2 className="text-xl font-bold text-slate-900">{group.parent.name}</h2>

                            <p className="text-sm text-slate-600">{group.parent.description}</p>                return "🐧";            case 'google-cloud':

                        </div>

                    </div>            case 'devops':                return "🌟";



                    <div className="relative">                return "⚙️";            case 'code':

                        <Button

                            variant="outline" case 'chart':            case 'programming':

                        size="sm"

                        onClick={() => scroll(scrollRef, "left")}            case 'data-analytics':                return "💻";

                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-10 w-10 p-0

                        bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-gray-50"                return "📊";            case 'server':

                            >

                        <ChevronLeft className="w-4 h-4 text-gray-600" />            case 'algorithm':                return "🖥️";

                    </Button>

                    case 'data-structures-algorithms':            case 'terminal':

                    <Button

                        variant="outline" return "🧮";                return "⌨️";

                    size="sm"

                    onClick={() => scroll(scrollRef, "right")}            case 'project':            case 'database':

                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-10 w-10 p-0

                    bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-gray-50"            case 'project-management':                return "🗄️";

                            >

                    <ChevronRight className="w-4 h-4 text-gray-600" />                return "📋";            case 'cybersecurity':

                </Button>

                case 'architecture':            case 'shield':

                <div

                    ref={scrollRef} case 'system-design':                return "🛡️";

                className="flex gap-4 overflow-x-auto px-12 py-2 scrollbar-hide"

                style={{ return "🏗️"; case 'networking':

                scrollbarWidth: 'none',

                msOverflowStyle: 'none',            case 'calculator':            case 'network':

                                }}

                            >                return "🧮";                return "🌐";

                {group.children.map((category) => (

                    <div case 'atom':            case 'linux':

                key={category.id}

                className={`flex-shrink-0 w-64 rounded-xl border p-4 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105                 return "⚛️";                return "🐧";

                                                  ${getCategoryColor(category.color)} shadow-sm`}

                onClick={() => handleCategoryClick(category.slug)}            case 'dna':            case 'devops':

                                    >

                <div className="flex items-center mb-3">                return "🧬";                return "⚙️";

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 mr-3 shadow-sm">

                        <span className="text-lg">{getIconComponent(category.icon)}</span>            case 'test-tube':            case 'chart':

                    </div>

                    <div className="flex-1">                return "🧪";            case 'data-analytics':

                        <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{category.name}</h3>

                    </div>            case 'book-open':                return "📊";

                </div>

                return "📖";            case 'algorithm':

                <div className="mb-3">

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">            case 'book':            case 'data-structures-algorithms':

                        {category.description || "Explore certifications in this category"}

                    </p>                return "📚";                return "🧮";

                </div>

                case 'flag-sa':            case 'project':

                <div className="pt-1">

                    <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/70 p-2 text-center hover:bg-white/80 transition-all duration-200">                return "🇸🇦";            case 'project-management':

                        <span className="text-xs font-medium text-slate-700">

                            View Certifications →            case 'flag-cn':                return "📋";

                        </span>

                    </div>                return "🇨🇳";            case 'architecture':

                </div>

            </div>            case 'flag-fr':            case 'system-design':

                                ))
    }

                            </div >                return "🇫🇷"; return "🏗️";

                        </div >

                    </div >            case 'flag-de':            case 'calculator':

                );

})}                return "🇩🇪"; return "🧮";

        </div >

    );            case 'flag-it':            case 'atom':

}
return "🇮🇹"; return "⚛️";

            case 'flag-jp':            case 'dna':

return "🇯🇵"; return "🧬";

            case 'flag-kr':            case 'test-tube':

return "🇰🇷"; return "🧪";

            case 'flag-pt':            case 'book-open':

return "🇵🇹"; return "📖";

            case 'flag-ru':            case 'book':

return "🇷🇺"; return "📚";

            case 'flag-es':            case 'flag-sa':

return "🇪🇸"; return "🇸🇦";

            case 'flag-us':            case 'flag-cn':

return "🇺🇸"; return "🇨🇳";

            default:            case 'flag-fr':

return "📚"; return "🇫🇷";

        }            case 'flag-de':

    }; return "🇩🇪";

            case 'flag-it':

const getCategoryColor = (color: string) => {
    return "🇮🇹";

    switch (color) {
        case 'flag-jp':

        case 'orange': return "🇯🇵";

            return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200'; case 'flag-kr':

        case 'blue': return "🇰🇷";

            return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200'; case 'flag-pt':

        case 'purple': return "🇵🇹";

            return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200'; case 'flag-ru':

        case 'green': return "🇷🇺";

            return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200'; case 'flag-es':

        case 'red': return "🇪🇸";

            return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200'; default:

        case 'indigo': return "📚";

            return 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200';
    }

            case 'rose':    };

return 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:from-rose-100 hover:to-rose-200';

            case 'amber': const getCategoryColor = (color: string) => {

    return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:from-amber-100 hover:to-amber-200'; switch (color) {

        case 'teal': case 'orange':

            return 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200'; return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200 hover:border-orange-300';

        case 'cyan': case 'blue':

            return 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200'; return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300';

        case 'emerald': case 'purple':

            return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200'; return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:border-purple-300';

        case 'yellow': case 'green':

            return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200'; return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 hover:border-green-300';

        case 'gray': case 'red':

            return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200'; return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:from-red-100 hover:to-red-200 hover:border-red-300';

        case 'violet': case 'indigo':

            return 'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:from-violet-100 hover:to-violet-200'; return 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 hover:border-indigo-300';

        case 'pink': case 'violet':

            return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-200'; return 'bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 hover:from-violet-100 hover:to-violet-200 hover:border-violet-300';

        default: case 'pink':

            return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200'; return 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:from-pink-100 hover:to-pink-200 hover:border-pink-300';

    }            case 'teal':

}; return 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:from-teal-100 hover:to-teal-200 hover:border-teal-300';

            case 'cyan':

const handleCategoryClick = (categorySlug: string) => {
    return 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:from-cyan-100 hover:to-cyan-200 hover:border-cyan-300';

    router.push(`/category/${categorySlug}`);            case 'emerald':

}; return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300';

            case 'yellow':

const scroll = (scrollRef: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 hover:border-yellow-300';

    if (scrollRef.current) {            case 'gray':

        const scrollAmount = 300; return 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300';

        scrollRef.current.scrollBy({
            default:

                left: direction === "left" ? -scrollAmount : scrollAmount,                return 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200 hover:border-slate-300';

        behavior: "smooth",        }

});    };

        }

    }; const handleCategoryClick = (categorySlug: string) => {

    router.push(`/category/${categorySlug}`);

    if (groups.length === 0) { };

    return (

        <div className="text-center py-12 text-slate-500">    // Handle grouped display

            <div className="text-6xl mb-4">📂</div>    if (groups) {

                <h3 className="text-xl font-semibold mb-2">No categories available</h3>        return (

            <p>Check back later for new certification categories.</p>            <div className="space-y-6">

            </div>                {groups.map((group) => (

        );                    <div key={group.parent.slug}>

    }                        {/* Group Header */}

                <div className="flex items-center mb-3">

                    return (                            <div className="bg-white rounded-lg p-1.5 mr-2 shadow-sm">

                        <div className="space-y-8">                                <span className="text-base">{getIconComponent(group.parent.icon)}</span>

                            {groups.map((group, groupIndex) => {                            </div>

                        const scrollRef = useRef<HTMLDivElement>(null);                            <div>

                            <h2 className="text-base font-bold text-slate-800">{group.parent.name}</h2>

                            return (                                <p className="text-xs text-slate-600">{group.parent.description}</p>

                            <div key={group.parent.id} className="space-y-4">                            </div>

                            {/* Group Header */}                        </div>

                            <div className="flex items-center space-x-3">

                                <div className={`rounded-xl p-2 ${getCategoryColor(group.parent.color)}`}>                        {/* Categories Horizontal Scroll */}

                                    <span className="text-2xl">{getIconComponent(group.parent.icon)}</span>                        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>

                                    </div>                            {group.children.map((category) => (

                                        <div>                                <div

                                            <h2 className="text-xl font-bold text-slate-900">{group.parent.name}</h2>                                    key={category.id}

                                            <p className="text-sm text-slate-600">{group.parent.description}</p>                                    className={`flex-shrink-0 w-44 rounded-lg border p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 

                            </div>                                              ${getCategoryColor(category.color)} shadow-sm`}

                                        </div>                                    onClick = {() => handleCategoryClick(category.slug)}

                                >

                                    {/* Categories with horizontal scroll */}                                    <div className="flex items-center mb-2">

                                        <div className="relative">                                        <div className="bg-white rounded-lg p-1 mr-2 shadow-sm">

                                            {/* Left Arrow */}                                            <span className="text-sm">{getIconComponent(category.icon)}</span>

                                            <Button                                        </div>

                                            variant="outline"                                        <h3 className="text-xs font-semibold text-slate-900 flex-1 line-clamp-1">{category.name}</h3>

                                            size="sm"                                    </div>

                                        onClick={() => scroll(scrollRef, "left")}

                                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-10 w-10 p-0                                     <p className="text-xs text-slate-600 mb-2 line-clamp-2 leading-relaxed">

                                            bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-gray-50                                         {category.description || "Explore certifications"}

                                            hover:border-gray-300 transition-all duration-200"                                    </p>

                            >

                                        <ChevronLeft className="w-4 h-4 text-gray-600" />                                    <div className="bg-white/60 rounded-md border border-white/70 p-1.5 text-center hover:bg-white/80 transition-colors">

                                        </Button>                                        <span className="text-xs font-medium text-slate-700">

                                            View Certifications →

                                            {/* Right Arrow */}                                        </span>

                                        <Button                                    </div>

                                    variant="outline"                                </div>

                                size="sm"                            ))}

                                onClick={() => scroll(scrollRef, "right")}                        </div>

                            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full h-10 w-10 p-0                     </div>

                                         bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-gray-50                 ))}

                    hover:border-gray-300 transition-all duration-200"            </div>

                            >        );

                <ChevronRight className="w-4 h-4 text-gray-600" />    }

            </Button>

    // Handle regular categories display

            {/* Scrollable Categories */}    if (!categories || categories.length === 0) {

                <div return (

            ref={scrollRef}            <div className="text-center py-8 text-slate-500">

                className="flex gap-4 overflow-x-auto px-12 py-2 scrollbar-hide"                <div className="text-4xl mb-4">📂</div>

                style={{                 < h3 className="text-lg font-semibold mb-2">No categories available</h3>

            scrollbarWidth: 'none',                 <p className="text-sm">Check back later for new certification categories.</p>

            msOverflowStyle: 'none',            </div>

                                }}        );

                            >    }

{
    group.children.map((category) => (

        <div return (

            key = { category.id } < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" >

            className={`flex-shrink-0 w-64 rounded-xl border p-4 transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105             {categories.map((category) => (

                                                  ${getCategoryColor(category.color)} shadow-sm`} <div

    onClick={() => handleCategoryClick(category.slug)} key={category.id}

>                    className={`rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 

                                        {/* Category Header */}                              ${getCategoryColor(category.color)} shadow-lg`}

    <div className="flex items-center mb-3">                    onClick={() => handleCategoryClick(category.slug)}

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 mr-3 shadow-sm">                >

            <span className="text-lg">{getIconComponent(category.icon)}</span>                    {/* Category Header */}

        </div>                    <div className="flex items-center mb-4">

            <div className="flex-1">                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 mr-4 shadow-sm">

                <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-1">{category.name}</h3>                            <span className="text-2xl">{getIconComponent(category.icon)}</span>

            </div>                        </div>

        </div>                        <div className="flex-1">

            <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{category.name}</h3>

            {/* Category Description */}                        </div>

        <div className="mb-3">                    </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">

            {category.description || "Explore certifications in this category"}                    {/* Category Description */}

        </p>                    <div className="mb-4">

        </div>                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">

            {category.description || "Explore certifications in this category"}

            {/* View More Button */}                        </p>

        <div className="pt-1">                    </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/70 p-2 text-center hover:bg-white/80 transition-all duration-200">

            <span className="text-xs font-medium text-slate-700">                    {/* View More Button */}

                View Certifications →                    <div className="pt-2">

            </span>                        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/70 p-3 text-center hover:bg-white/80 transition-all duration-200">

            </div>                            <span className="text-sm font-medium text-slate-700">

        </div>                                View Certifications →

    </div>                            </span>

                                ))}                        </div >

                            </div >                    </div >

                        </div >                </div >

                    </div >            ))}

                );        </div >

            })}    );

}
{/* Hide scrollbars globally for this component */ }
<style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div >
    );
}