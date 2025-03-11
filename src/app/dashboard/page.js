"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FaChartLine,
    FaDollarSign,
    FaExclamationCircle,
    FaHandHoldingHeart,
    FaBullhorn,
    FaUserCircle,
    FaGraduationCap,
    FaCalendarAlt,
    FaCog,
    FaPlus,
    FaRegBell,
    FaSearch,
    FaEye,
    FaEdit,
    FaChevronRight,
    FaSpinner
} from "react-icons/fa";
import Image from "next/image";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFundraisers, setActiveFundraisers] = useState([]);
    const [pastFundraisers, setPastFundraisers] = useState([]);
    const [recentDonations, setRecentDonations] = useState([]);
    const [stats, setStats] = useState({
        totalRaised: 0,
        campaignsCreated: 0,
        donationsMade: 0,
        totalDonated: 0,
        averageDonation: 0
    });

    // Current date for deadline calculations
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Tab state for mobile view
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);

            try {
                // Get current user
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError || !userData.user) {
                    router.push("/auth/login?redirect=/dashboard");
                    return;
                }

                setUser(userData.user);

                // Fetch user profile
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", userData.user.id)
                    .single();
                if (profileData) {
                    setUserProfile(profileData);
                }

                // Fetch user's fundraisers
                const today = new Date().toISOString();

                // Active fundraisers (end date in the future)
                const { data: activeData } = await supabase
                    .from("fundraisers")
                    .select("*, donations(count)")
                    .eq("created_by", userData.user.id)
                    .gte("end_date", today)
                    .order("created_at", { ascending: false });
                if (activeData) {
                    setActiveFundraisers(activeData);
                }

                // Past fundraisers (end date in the past)
                const { data: pastData } = await supabase
                    .from("fundraisers")
                    .select("*, donations(count)")
                    .eq("created_by", userData.user.id)
                    .lt("end_date", today)
                    .order("end_date", { ascending: false });
                if (pastData) {
                    setPastFundraisers(pastData);
                }

                // Recent donations received for user's fundraisers
                const allFundraiserIds = [
                    ...((activeData || []).map((f) => f.id)),
                    ...((pastData || []).map((f) => f.id))
                ];
                const { data: donationsData } = await supabase
                    .from("donations")
                    .select(
                        `
            *,
            fundraisers!inner(
              id,
              title,
              created_by
            ),
            profiles(
              display_name,
              avatar_url
            )
          `
                    )
                    .in("fundraiser_id", allFundraiserIds)
                    .order("created_at", { ascending: false })
                    .limit(10);
                if (donationsData) {
                    setRecentDonations(donationsData);
                }

                // Calculate stats
                let totalRaised = 0;
                let campaignsCreated = (activeData?.length || 0) + (pastData?.length || 0);
                [...(activeData || []), ...(pastData || [])].forEach((fundraiser) => {
                    totalRaised += fundraiser.amount_raised || 0;
                });

                // Get user's donations made to other fundraisers
                const { data: userDonations } = await supabase
                    .from("donations")
                    .select("amount")
                    .eq("donor_id", userData.user.id);
                let donationsMade = 0;
                let totalDonated = 0;
                if (userDonations) {
                    donationsMade = userDonations.length;
                    totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
                }

                setStats({
                    totalRaised,
                    campaignsCreated,
                    donationsMade,
                    totalDonated,
                    averageDonation: donationsMade > 0 ? totalDonated / donationsMade : 0,
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, [router]);

    // Calculate time remaining for a fundraiser
    const getTimeRemaining = (endDateStr) => {
        const endDate = new Date(endDateStr);
        const timeLeft = endDate - currentDate;
        if (timeLeft < 0) return "Ended";
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        if (daysLeft === 0) return "Last day";
        if (daysLeft === 1) return "1 day left";
        return `${daysLeft} days left`;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate progress percentage
    const calculateProgress = (raised, goal) => {
        if (!goal || goal === 0) return 0;
        const percentage = (raised / goal) * 100;
        return Math.min(100, Math.round(percentage));
    };

    // Determine the action needed for a fundraiser
    const getFundraiserAction = (fundraiser) => {
        const endDate = new Date(fundraiser.end_date);
        const daysLeft = Math.floor((endDate - currentDate) / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) {
            return { type: "ended", message: "Campaign ended", color: "gray" };
        }
        if (daysLeft < 3) {
            return { type: "urgent", message: "Ending soon", color: "red" };
        }
        const progress = calculateProgress(fundraiser.amount_raised || 0, fundraiser.goal_amount);
        if (progress < 25 && daysLeft < 7) {
            return { type: "promote", message: "Needs promotion", color: "orange" };
        }
        if (progress >= 100) {
            return { type: "success", message: "Goal reached!", color: "green" };
        }
        const donationsCount = fundraiser.donations?.[0]?.count || 0;
        if (donationsCount === 0) {
            return { type: "new", message: "Share campaign", color: "blue" };
        }
        return { type: "active", message: "Active", color: "green" };
    };

    // User display name fallback
    const getDisplayName = () => {
        if (userProfile?.display_name) return userProfile.display_name;
        if (user?.email) return user.email.split("@")[0];
        return "User";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin h-10 w-10 mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header Bar */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700">
                            <FaRegBell className="text-xl" />
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                        </button>
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden">
                                {userProfile?.avatar_url ? (
                                    <img
                                        src={userProfile.avatar_url}
                                        alt={getDisplayName()}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-2xl" />
                                )}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline-block">
                {getDisplayName()}
              </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Date Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 text-sm">
                <div className="container mx-auto">
                    <p className="text-center md:text-right">{dateString}</p>
                </div>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="md:hidden border-b bg-white">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 py-3 text-center text-sm font-medium ${
                            activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("fundraisers")}
                        className={`flex-1 py-3 text-center text-sm font-medium ${
                            activeTab === "fundraisers" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                        }`}
                    >
                        Fundraisers
                    </button>
                    <button
                        onClick={() => setActiveTab("donations")}
                        className={`flex-1 py-3 text-center text-sm font-medium ${
                            activeTab === "donations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                        }`}
                    >
                        Donations
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                {/* Left Sidebar - User Profile */}
                <div className={`lg:col-span-1 ${(activeTab !== "overview" && activeTab !== "profile") && "hidden md:block"}`}>
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6 text-center">
                            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white overflow-hidden mb-4">
                                {userProfile?.avatar_url ? (
                                    <img
                                        src={userProfile.avatar_url}
                                        alt={getDisplayName()}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-5xl" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{getDisplayName()}</h2>
                            <p className="text-gray-500 mb-4">{user?.email || ""}</p>
                            <Link
                                href="#"
                                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Edit Profile
                            </Link>
                        </div>
                        <div className="border-t border-gray-100 px-6 py-4">
                            <h3 className="font-semibold text-gray-700 mb-2">My Stats</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Fundraisers Created:</span>
                                    <span className="font-medium">{stats.campaignsCreated}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Total Raised:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(stats.totalRaised)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Donations Made:</span>
                                    <span className="font-medium">{stats.donationsMade}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 text-sm">Total Donated:</span>
                                    <span className="font-medium text-green-600">{formatCurrency(stats.totalDonated)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                            <Link
                                href="#"
                                className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg text-center font-medium"
                            >
                                <FaPlus className="inline-block mr-2" /> Start New Fundraiser
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-700">Quick Links</h3>
                        </div>
                        <div className="p-2">
                            <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <FaChartLine className="mr-3 text-blue-600" />
                                <span>Browse Fundraisers</span>
                            </Link>
                            <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <FaGraduationCap className="mr-3 text-purple-600" />
                                <span>Scholarships</span>
                            </Link>
                            <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <FaCalendarAlt className="mr-3 text-green-600" />
                                <span>Upcoming Events</span>
                            </Link>
                            <Link href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <FaCog className="mr-3 text-gray-600" />
                                <span>Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className={`lg:col-span-3 space-y-6 ${activeTab !== "overview" && activeTab !== "fundraisers" && "hidden md:block"}`}>
                    {/* Action Items */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Action Items</h2>
                        </div>
                        <div className="p-6">
                            {activeFundraisers.length === 0 && pastFundraisers.length === 0 ? (
                                <div className="text-center py-6">
                                    <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <FaBullhorn className="text-2xl" />
                                    </div>
                                    <h3 className="text-gray-800 font-medium mb-2">Create your first fundraiser</h3>
                                    <p className="text-gray-600 mb-4">Start raising funds for your university project or cause</p>
                                    <Link
                                        href="#"
                                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Action cards based on fundraiser status */}
                                    {activeFundraisers.some(f => new Date(f.end_date) - currentDate < 1000 * 60 * 60 * 24 * 3) && (
                                        <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="mr-4 text-red-600">
                                                <FaExclamationCircle className="text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-red-700">Campaign ending soon</h3>
                                                <p className="text-sm text-red-600">You have a fundraiser that's ending in less than 3 days. Make a final push for donations!</p>
                                            </div>
                                            <Link
                                                href={`/fundraisers/${activeFundraisers.find(f => new Date(f.end_date) - currentDate < 1000 * 60 * 60 * 24 * 3).id}/share`}
                                                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-md ml-4 whitespace-nowrap"
                                            >
                                                Share Now
                                            </Link>
                                        </div>
                                    )}
                                    {activeFundraisers.some(f => (f.donations?.[0]?.count || 0) === 0) && (
                                        <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="mr-4 text-blue-600">
                                                <FaBullhorn className="text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-blue-700">Promote your campaign</h3>
                                                <p className="text-sm text-blue-600">You have a fundraiser with no donations yet. Share it with your network to get started!</p>
                                            </div>
                                            <Link
                                                href={`/fundraisers/${activeFundraisers.find(f => (f.donations?.[0]?.count || 0) === 0).id}/share`}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md ml-4 whitespace-nowrap"
                                            >
                                                Share
                                            </Link>
                                        </div>
                                    )}
                                    {activeFundraisers.some(f => (f.amount_raised || 0) >= f.goal_amount) && (
                                        <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="mr-4 text-green-600">
                                                <FaHandHoldingHeart className="text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-green-700">Goal reached!</h3>
                                                <p className="text-sm text-green-600">Congratulations! One of your fundraisers has reached its goal. Send updates to your donors!</p>
                                            </div>
                                            <Link
                                                href={`/fundraisers/${activeFundraisers.find(f => (f.amount_raised || 0) >= f.goal_amount).id}/update`}
                                                className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-md ml-4 whitespace-nowrap"
                                            >
                                                Post Update
                                            </Link>
                                        </div>
                                    )}
                                    {pastFundraisers.length > 0 && pastFundraisers.some(f => !f.has_thanked_donors) && (
                                        <div className="flex items-start p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                            <div className="mr-4 text-purple-600">
                                                <FaHandHoldingHeart className="text-xl" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-purple-700">Thank your donors</h3>
                                                <p className="text-sm text-purple-600">You have completed fundraisers. Send thank you notes to show your appreciation.</p>
                                            </div>
                                            <Link
                                                href={`/fundraisers/${pastFundraisers.find(f => !f.has_thanked_donors)?.id}/donors`}
                                                className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded-md ml-4 whitespace-nowrap"
                                            >
                                                Send Thanks
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Active Fundraisers */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800">My Active Fundraisers</h2>
                            <Link
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View All
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {activeFundraisers.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">You don't have any active fundraisers</p>
                                    <Link
                                        href="#"
                                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Start a fundraiser
                                    </Link>
                                </div>
                            ) : (
                                activeFundraisers.slice(0, 3).map((fundraiser) => {
                                    const progress = calculateProgress(fundraiser.amount_raised || 0, fundraiser.goal_amount);
                                    const action = getFundraiserAction(fundraiser);
                                    return (
                                        <div key={fundraiser.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex flex-col md:flex-row md:items-center">
                                                {/* Fundraiser image or placeholder */}
                                                <div className="w-full md:w-24 h-20 bg-gray-100 rounded-lg mb-3 md:mb-0 md:mr-4 overflow-hidden flex-shrink-0">
                                                    {fundraiser.image_url ? (
                                                        <div className="h-full w-full bg-center bg-cover" style={{ backgroundImage: `url(${fundraiser.image_url})` }}></div>
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                            <FaChartLine className="text-2xl" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Fundraiser details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <Link href={`/fundraisers/${fundraiser.id}`} className="font-medium text-gray-800 hover:text-blue-600">
                                                            {fundraiser.title}
                                                        </Link>
                                                        <span className={`text-xs px-2 py-1 rounded-full bg-${action.color}-100 text-${action.color}-800`}>
                              {action.message}
                            </span>
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="h-2 w-full bg-gray-200 rounded-full">
                                                            <div
                                                                className={`h-2 rounded-full bg-${progress >= 100 ? "green" : "blue"}-600`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap justify-between text-sm">
                                                        <div className="mr-4">
                                                            <span className="text-gray-600">Raised: </span>
                                                            <span className="font-medium text-green-600">{formatCurrency(fundraiser.amount_raised || 0)}</span>
                                                            <span className="text-gray-500"> of {formatCurrency(fundraiser.goal_amount)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="text-gray-500 mr-4">{getTimeRemaining(fundraiser.end_date)}</span>
                                                            <div className="flex space-x-2">
                                                                <Link
                                                                    href={`/fundraisers/${fundraiser.id}`}
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    title="View"
                                                                >
                                                                    <FaEye />
                                                                </Link>
                                                                <Link
                                                                    href={`/fundraisers/${fundraiser.id}/edit`}
                                                                    className="text-gray-600 hover:text-gray-800"
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {activeFundraisers.length > 0 && (
                            <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
                                <Link
                                    href="#"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
                                >
                                    View all my fundraisers <FaChevronRight className="ml-1 text-xs" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Donations */}
                    <div className={`bg-white rounded-lg shadow ${activeTab !== "overview" && activeTab !== "donations" && "hidden md:block"}`}>
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-bold text-gray-800">Recent Donations</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentDonations.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500">No donations received yet</p>
                                </div>
                            ) : (
                                recentDonations.slice(0, 5).map((donation) => (
                                    <div key={donation.id} className="p-4 hover:bg-gray-50 flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mr-4">
                                            {donation.profiles?.avatar_url ? (
                                                <img
                                                    src={donation.profiles.avatar_url}
                                                    alt="Donor"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <FaUserCircle className="h-full w-full text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 text-sm font-medium">
                                                {donation.profiles?.display_name || "Anonymous"}
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                Donated {formatCurrency(donation.amount)} to{" "}
                                                <Link href={`/fundraisers/${donation.fundraisers?.id}`} className="text-blue-600 hover:underline">
                                                    {donation.fundraisers?.title}
                                                </Link>
                                            </p>
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {new Date(donation.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}