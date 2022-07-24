import express, { Request, Response } from 'express';
// import Stripe from "stripe";
const Stripe = require("stripe");
const stripe = Stripe('sk_test_51L6xn9LqjnFcSSeHXVzz4s93OViK6P6Qzfzv57E46A7l9FwBn2rnq7rd8sEJrr51LwxbJnAY8klSfUhGdVR54sEI00QhPzdLeN');

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "ngn",
                    product_data: {
                        name: "Vote",
                    },
                    unit_amount: req.body.vote * 400,
                },
                quantity: 1
            },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/`,
        cancel_url: `${process.env.CLIENT_URL}/`
    });

    res.send({ url: session.url })
})


export default router;