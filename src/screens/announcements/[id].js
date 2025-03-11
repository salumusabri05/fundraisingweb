"use client";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AnnouncementDetails() {
    const router = useRouter();
    const { id } = router.query;

    // Placeholder for announcement details based on the id.
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Announcement Details</h1>
                <p>Details for announcement with ID: {id}</p>
                <Link href="/announcements" className="text-blue-600">
                    Back to Announcements
                </Link>
            </div>
        </div>
    );
}