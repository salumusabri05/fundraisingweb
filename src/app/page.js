"use client"; // This directive enables client-side rendering in Next.js

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import {
    FaPlus, FaChartLine, FaSearch, FaMedal,
    FaCalendarAlt, FaBullhorn, FaGraduationCap, FaHeart, FaAngleRight
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

/**
 * Home Page Component for a generic fundraising platform.
 * This page is designed for all communities and emphasizes various charitable initiatives.
 * Detailed inline comments are provided throughout the code.
 */
export default function Home() {
    // State management for various sections: fundraisers, featured campaigns, categories, announcements, opportunities, and events.
    const [fundraisers, setFundraisers] = useState([]);
    const [featuredFundraisers, setFeaturedFundraisers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [opportunities, setOpportunities] = useState([]); // renamed scholarships to opportunities for a broader audience
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // useEffect to load static (mock) data for various sections on page load.
    useEffect(() => {
        // Mock data for announcements (these can be urgent fund or charity notices)
        const mockAnnouncements = [
            {
                id: 1,
                title: "Emergency Relief Fund for Local Community",
                description: "Support families affected by the recent natural disaster.",
                urgency: "high",
                date: "2025-03-08",
                image: "/images/emergency-fund.jpg"
            },
            {
                id: 2,
                title: "Community Volunteer Gala - Join Us!",
                description: "Become a part of our annual event to help community rebuilding efforts.",
                urgency: "medium",
                date: "2025-04-15",
                image: "/images/volunteer-gala.jpg"
            },
            {
                id: 3,
                title: "COVID-19 Relief Fund",
                description: "Providing support to those impacted by the pandemic.",
                urgency: "high",
                date: "2025-03-10",
                image: "/images/covid-support.jpg"
            }
        ];

        // Mock data for opportunities (previously scholarships)
        const mockOpportunities = [
            {
                id: 1,
                title: "Community Leadership Grant",
                amount: "$10,000",
                deadline: "2025-04-30",
                department: "Community",
                image: "/images/leadership-grant.jpg"
            },
            {
                id: 2,
                title: "Arts & Culture Fund",
                amount: "$5,000",
                deadline: "2025-05-15",
                department: "Arts",
                image: "/images/arts-fund.jpg"
            },
            {
                id: 3,
                title: "Small Business Support Grant",
                amount: "$7,500",
                deadline: "2025-04-10",
                department: "Business",
                image: "/images/business-grant.jpg"
            },
            {
                id: 4,
                title: "Tech Innovation Award",
                amount: "$12,000",
                deadline: "2025-05-01",
                department: "Technology",
                image: "/images/tech-award.jpg"
            }
        ];

        // Mock data for upcoming events (general community events)
        const mockEvents = [
            {
                id: 1,
                title: "Annual Community Charity Run",
                date: "2025-04-05",
                location: "City Park",
                image: "/images/charity-run.jpg"
            },
            {
                id: 2,
                title: "Local Business Networking Dinner",
                date: "2025-03-20",
                location: "Downtown Convention Center",
                image: "/images/networking-dinner.jpg"
            },
            {
                id: 3,
                title: "Sustainability Initiative Launch",
                date: "2025-03-15",
                location: "Community Hall",
                image: "/images/sustainability.jpg"
            }
        ];

        // Apply mock data to component state
        setAnnouncements(mockAnnouncements);
        setOpportunities(mockOpportunities);
        setUpcomingEvents(mockEvents);

        // Setup generic categories for all communities with appropriate icons and colors.
        setCategories([
            { id: 1, name: "Community Projects", icon: "🤝", color: "bg-blue-500" },
            { id: 2, name: "Sports & Fitness", icon: "🏆", color: "bg-green-500" },
            { id: 3, name: "Research & Innovation", icon: "🔬", color: "bg-purple-500" },
            { id: 4, name: "Cultural Events", icon: "🎭", color: "bg-yellow-500" },
            { id: 5, name: "Local Businesses", icon: "🏪", color: "bg-red-500" },
            { id: 6, name: "Social Causes", icon: "❤️", color: "bg-indigo-500" }
        ]);
    }, []);

    // useEffect to fetch fundraisers data from Supabase.
    // In production, this would fetch live data from your database.
    useEffect(() => {
        async function fetchFundraisers() {
            setLoading(true);
            try {
                // Fetch all fundraisers and sort by most recent creation date.
                const { data: allFundraisers, error } = await supabase
                    .from("fundraisers")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Error fetching fundraisers:", error);
                    return;
                }

                // Set the fetched data into state.
                setFundraisers(allFundraisers);

                // Determine featured fundraisers based on progress ratio.
                // This is a simple algorithm; you may enhance it as needed.
                const featured = allFundraisers
                    .filter(f => f.amount_raised && f.goal_amount)
                    .sort((a, b) => (b.amount_raised / b.goal_amount) - (a.amount_raised / a.goal_amount))
                    .slice(0, 3);

                setFeaturedFundraisers(featured);
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFundraisers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar with current user username */}
            <Navbar username="salumusabri05" />

            {/* Hero Section: Main banner with a motivational message for all communities */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-4 leading-tight">
                            Making a Difference Together
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Support community initiatives, drive impactful projects, and engage in meaningful charity events.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/fundraisers/new/" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Start a Campaign
                            </Link>
                            <Link
                                href="../screens/donate/page.js"
                                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Donate Now
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Wave Separator below the hero section */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="fill-current text-gray-50">
                        <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
                    </svg>
                </div>
            </div>

            {/* Search and Categories Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6 -mt-16 relative z-20 border border-gray-100">
                    {/* Search bar to look up campaigns, opportunities, events, etc. */}
                    <div className="mb-6">
                        <SearchBar placeholder="Search campaigns, opportunities, or events..." />
                    </div>
                    {/* Category cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.id}`}
                                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
                            >
                                <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform duration-200`}>
                                    {category.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Urgent Charity Announcements Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBullhorn className="text-red-600" /> Urgent Announcements
                    </h2>
                    <Link href="../screens/announcements/announcements.js" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        View All <FaAngleRight />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`rounded-lg shadow-md overflow-hidden border ${
                                announcement.urgency === 'high' ? 'border-red-400 bg-red-50' : 'border-yellow-400 bg-yellow-50'
                            }`}
                        >
                            {/* Image Section with urgency icon overlay */}
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-transparent opacity-60"></div>
                                <div className="flex items-center justify-center h-full text-white text-5xl">
                                    {announcement.urgency === 'high' ? '🚨' : '📢'}
                                </div>
                                <div className={`absolute top-0 right-0 ${
                                    announcement.urgency === 'high' ? 'bg-red-600' : 'bg-yellow-600'
                                } text-white px-3 py-1 text-sm font-bold`}>
                                    {announcement.urgency === 'high' ? 'URGENT' : 'NOTICE'}
                                </div>
                            </div>
                            {/* Content section for announcement details */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-2">{announcement.title}</h3>
                                <p className="text-gray-700 text-sm mb-3">{announcement.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">Posted: {announcement.date}</span>
                                    <Link
                                        href={`/announcements/${announcement.id}`}
                                        className={`px-4 py-1 text-white text-sm rounded-full ${
                                            announcement.urgency === 'high' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
                                        }`}
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Featured Fundraisers Section */}
            <div className="bg-blue-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Campaigns</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">These campaigns are making a significant impact in our communities. Help them achieve their goals!</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredFundraisers.map((fund) => (
                            <Link
                                key={fund.id}
                                href={`/fundraisers/${fund.id}`}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                            >
                                <div className="h-56 bg-gradient-to-r from-blue-400 to-indigo-500 relative overflow-hidden">
                                    {fund.image_url ? (
                                        <img
                                            src={fund.image_url}
                                            alt={fund.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            <FaMedal className="text-7xl group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-yellow-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-md">
                                        Featured
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{fund.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{fund.description}</p>
                                    {fund.amount_raised && fund.goal_amount && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-bold text-green-700">${fund.amount_raised.toLocaleString()}</span>
                                                <span className="text-gray-600">Goal: ${fund.goal_amount.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                                                    style={{ width: `${Math.min(100, (fund.amount_raised / fund.goal_amount) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-right text-xs text-gray-500 mt-1">
                                                {Math.round((fund.amount_raised / fund.goal_amount) * 100)}% Complete
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-center">
                                        <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition-colors duration-200">
                                            Support This Cause
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Opportunities Section (formerly Scholarships) */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaGraduationCap className="text-purple-600" /> Opportunity Highlights
                    </h2>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        View All Opportunities <FaAngleRight />
                    </Link>
                </div>
                <div className="relative">
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={5000}
                        centerMode={true}
                        centerSlidePercentage={33.33}
                        className="opportunity-carousel"
                    >
                        {opportunities.map((opp) => (
                            <div key={opp.id} className="px-2 pb-6">
                                <div className="bg-gradient-to-b from-purple-600 to-indigo-800 text-white rounded-xl shadow-lg overflow-hidden h-80">
                                    <div className="h-32 bg-purple-900 relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 to-transparent opacity-70"></div>
                                        <div className="flex items-center justify-center h-full text-white text-5xl">
                                            {opp.department === 'Community' && '🤝'}
                                            {opp.department === 'Arts' && '🎭'}
                                            {opp.department === 'Business' && '💼'}
                                            {opp.department === 'Technology' && '💻'}
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white text-purple-800 rounded-full px-3 py-1 text-xs font-bold">
                                            {opp.department}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold mb-2">{opp.title}</h3>
                                        <div className="mb-3">
                                            <span className="text-2xl font-bold text-purple-100">{opp.amount}</span>
                                            <span className="text-purple-200 text-sm"> Grant</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-purple-200 mb-4">
                                            <FaCalendarAlt />
                                            <span>Deadline: {opp.deadline}</span>
                                        </div>
                                        <Link
                                            href={`/opportunities/${opp.id}`}
                                            className="block w-full bg-white text-purple-700 hover:bg-purple-100 text-center py-2 rounded-lg font-medium transition-colors duration-200"
                                        >
                                            Apply Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>

            {/* All Fundraisers Section */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">All Campaigns</h2>
                        <Link href="/fundraisers/new/" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow transition-all flex items-center gap-2">
                            <FaPlus /> Start a Campaign
                        </Link>
                    </div>
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading campaigns...</p>
                        </div>
                    )}
                    {!loading && fundraisers.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="text-5xl text-gray-300 mx-auto mb-4">📊</div>
                            <h3 className="text-xl font-medium text-gray-700">No campaigns yet</h3>
                            <p className="text-gray-500 mt-2">Be the first to create a fundraising campaign!</p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {fundraisers.map((fund) => (
                            <Link
                                key={fund.id}
                                href={`/fundraisers/${fund.id}`}
                                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-blue-200 flex flex-col"
                            >
                                <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                                    {fund.image_url ? (
                                        <img
                                            src={fund.image_url}
                                            alt={fund.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            <FaChartLine className="text-4xl" />
                                        </div>
                                    )}
                                    {fund.amount_raised && fund.goal_amount && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-4 py-2">
                                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                                <div
                                                    className="bg-green-500 h-2.5 rounded-full"
                                                    style={{ width: `${Math.min(100, (fund.amount_raised / fund.goal_amount) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h2 className="text-lg font-bold text-gray-800 mb-2">{fund.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{fund.description}</p>
                                    <div className="mt-auto">
                                        {fund.amount_raised && fund.goal_amount ? (
                                            <div className="text-sm">
                                                <span className="font-medium text-green-600">${fund.amount_raised.toLocaleString()}</span>
                                                <span className="text-gray-500"> of ${fund.goal_amount.toLocaleString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-blue-600 font-medium">View details</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {fundraisers.length > 0 && (
                        <div className="text-center mt-10">
                            <Link
                                href="/fundraisers/"
                                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                            >
                                See All Campaigns
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Community Events Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaCalendarAlt className="text-orange-500" /> Upcoming Community Events
                    </h2>
                    <Link href="../screens/events/events.js" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        View All Events <FaAngleRight />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                        >
                            <div className="h-40 bg-gradient-to-r from-orange-400 to-red-500 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-transparent opacity-60"></div>
                                <div className="flex items-center justify-center h-full text-white text-5xl">
                                    {event.title.includes("Run") && '🏃‍♂️'}
                                    {event.title.includes("Dinner") && '🍽️'}
                                    {event.title.includes("Initiative") && '🌱'}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <FaCalendarAlt className="text-orange-500" />
                                    <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <div className="w-4 h-4 flex items-center justify-center">📍</div>
                                    <span>{event.location}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                                    <span className="text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors">
                                        Learn More
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Impact Stats Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">$1.2M+</div>
                            <div className="text-blue-100">Raised This Year</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">324</div>
                            <div className="text-blue-100">Successful Campaigns</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">56</div>
                            <div className="text-blue-100">Opportunities Funded</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold mb-2">15,000+</div>
                            <div className="text-blue-100">Community Donors</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Community Says</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonial Card 1 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-3a2 2 0 114 0H8z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="font-semibold text-gray-800">John Doe</p>
                                <p className="text-xs text-gray-500">Community Member</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            "This platform has transformed the way our community supports each other. Proud to be part of this journey!"
                        </p>
                    </div>
                    {/* Testimonial Card 2 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-3a2 2 0 114 0H8z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="font-semibold text-gray-800">Jane Smith</p>
                                <p className="text-xs text-gray-500">Volunteer</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            "An intuitive platform that makes supporting worthy campaigns effortless."
                        </p>
                    </div>
                    {/* Testimonial Card 3 */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2-3a2 2 0 114 0H8z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="font-semibold text-gray-800">Robert Lee</p>
                                <p className="text-xs text-gray-500">Entrepreneur</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            "A game-changer for community fundraising. It has boosted engagement and support across all causes."
                        </p>
                    </div>
                </div>
            </div>
            {/* Footer Component */}
            <Footer/>
        </div>
    );
}