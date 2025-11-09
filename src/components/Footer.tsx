"use client";

import React from 'react';
import Link from 'next/link';
import { Award, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg mr-3">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                                        EduNeps
                                    </h3>
                                    <p className="text-sm text-blue-400">Learning Platform</p>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Master your certifications with personalized learning paths, expert tutoring, and comprehensive exam preparation.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/categories" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Browse Subjects
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/teachers" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Find Teachers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/certificates" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Certificates
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center text-gray-400 text-sm">
                                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>support@eduneps.com</span>
                                </li>
                                <li className="flex items-center text-gray-400 text-sm">
                                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span>+1 (555) 123-4567</span>
                                </li>
                                <li className="flex items-start text-gray-400 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>123 Education St.<br />Learning City, LC 12345</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-8 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © {currentYear} EduNeps. All rights reserved.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Accessibility
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Sitemap
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;