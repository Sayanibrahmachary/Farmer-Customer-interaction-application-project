import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Stripe from "stripe";
import dotenv from "dotenv";

import customerRouter from "./routes/customer.routes.js";
import farmerRouter from "./routes/farmer.routes.js";
import deliveryBoyRouter from "./routes/deliveryBoy.routes.js";
import productRouter from "./routes/product.routes.js";
import commentRouter from "./routes/comment.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use env variable for security

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET, POST, PATCH, PUT, DELETE, HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/deliveryBoy", deliveryBoyRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);


app.post("/api/v1/payment/create-checkout-session", async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            console.error("❌ No valid products received in request:", req.body);
            return res.status(400).json({ error: "No products provided" });
        }

        let totalAmountInCents = 0; // Initialize total

        const lineItems = products.map((product) => {
            if (!product.productName || !product.pay || !product.amount) {
                console.error("❌ Invalid product data:", product);
                return res.status(400).json({ error: "Invalid product data" });
            }

            let amountInCents;

            if (product.kgOrg === "kg") {
                amountInCents = product.amount * product.pay * 100; // Convert ₹ to cents
            } else {
                let pricePerGram = product.pay / 1000;
                amountInCents = pricePerGram * product.amount * 100;
            }

            amountInCents = Math.round(amountInCents); // ✅ Ensure integer value
            totalAmountInCents += amountInCents; // Add to total

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.productName,
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            };
        });

        // 🚨 **Minimum amount check** (₹32 = 30 pence)
        if (totalAmountInCents < 3200) {
            console.error(`❌ Payment failed: Total amount ₹${totalAmountInCents / 100} is too low.`);
            return res.status(400).json({
                error: `The total amount must be at least ₹32 to meet Stripe's minimum.`,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });

        //console.log("✅ Stripe Session Created:", session);
        res.json({ id: session.id });
    } catch (error) {
        console.error("❌ Stripe Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});


export { app, stripe };