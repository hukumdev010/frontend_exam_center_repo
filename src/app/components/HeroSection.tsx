import { Award, TrendingUp, Globe } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
                <div className="text-center">
                    <div className="flex justify-center mb-3">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
                            <Award className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Professional Certification Platform</span>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                        Master New
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"> Skills</span>
                        & Get Certified
                    </h1>

                    <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
                        Discover expert-led courses and earn industry-recognized certifications
                    </p>

                    {/* Compact Stats */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">10K+</span> Learners
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-gray-900">500+</span> Certifications
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-indigo-600" />
                            <span className="font-semibold text-gray-900">50+</span> Countries
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}