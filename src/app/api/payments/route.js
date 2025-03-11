import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const { fundraiserId, amount } = await req.json();

    const fundraiser = await supabase.from("fundraisers").select("*").eq("id", fundraiserId).single();
    if (!fundraiser.data) return NextResponse.json({ error: "Fundraiser not found" }, { status: 404 });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price_data: { currency: "usd", product_data: { name: fundraiser.data.title }, unit_amount: amount * 100 }, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fundraisers/${fundraiserId}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/fundraisers/${fundraiserId}?canceled=true`,
    });

    return NextResponse.json({ id: session.id });
}
