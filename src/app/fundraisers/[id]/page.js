"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

export default function FundraiserPage({ params }) {
    const { id } = params;
    const [fundraiser, setFundraiser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchFundraiser() {
            let { data, error } = await supabase.from("fundraisers").select("*").eq("id", id).single();
            if (error) console.error(error);
            else setFundraiser(data);
        }
        fetchFundraiser();
    }, [id]);

    if (!fundraiser) return <p>Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-5">
            <h1 className="text-3xl font-bold">{fundraiser.title}</h1>
            <p>{fundraiser.description}</p>
            <p className="text-gray-500">Goal: ${fundraiser.goal_amount}</p>
            <p className="text-green-600">Raised: ${fundraiser.current_amount}</p>
            <DonateButton fundraiserId={fundraiser.id} />
        </div>
    );
}

function DonateButton({ fundraiserId }) {
    const [loading, setLoading] = useState(false);

    async function handleDonate() {
        setLoading(true);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
        const { data, error } = await fetch(`/api/payments`, {
            method: "POST",
            body: JSON.stringify({ fundraiserId, amount: 10 }), // $10 donation example
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());

        if (error) {
            alert("Payment error.");
            setLoading(false);
        } else {
            await stripe.redirectToCheckout({ sessionId: data.id });
        }
    }

    return (
        <button onClick={handleDonate} className="bg-blue-500 text-white px-4 py-2 rounded mt-3">
            {loading ? "Processing..." : "Page $10"}
        </button>
    );
}
