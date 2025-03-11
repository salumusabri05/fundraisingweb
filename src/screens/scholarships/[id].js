"use client";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function ScholarshipDetails() {
    const router = useRouter();
    const { id } = router.query;
    // Display scholarship details based on the id (placeholder)
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="salumusabri05" />
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Scholarship Details</h1>
                <p>Details for scholarship with ID: {id}</p>
                <Link href="/scholarships" className="text-blue-600">
                    Back to Scholarships
                </Link>
            </div>
        </div>
    );
}