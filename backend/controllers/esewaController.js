import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const initiateEsewaPayment = async (req, res) => {
    const { amount, orderId } = req.body;

    const esewaConfig = {
        amt: amount,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: amount,
        pid: orderId,
        scd: process.env.ESEWA_MERCHANT_ID,
        su: `${process.env.BASE_URL}/api/payment/esewa/success`,
        fu: `${process.env.BASE_URL}/api/payment/esewa/failure`
    };

    const esewaUrl = `https://esewa.com.np/epay/main?amt=${esewaConfig.amt}&pdc=${esewaConfig.pdc}&psc=${esewaConfig.psc}&txAmt=${esewaConfig.txAmt}&tAmt=${esewaConfig.tAmt}&pid=${esewaConfig.pid}&scd=${esewaConfig.scd}&su=${encodeURIComponent(esewaConfig.su)}&fu=${encodeURIComponent(esewaConfig.fu)}`;

    res.json({ esewaUrl });
};

export const esewaSuccess = async (req, res) => {
    const { amt, rid, pid, scd } = req.query;

    // Validate the transaction with eSewa
    try {
        const response = await axios.post('https://esewa.com.np/epay/main', {
            amt,
            rid,
            pid,
            scd
        });

        if (response.data === "Success") {
            // Mark order as paid in your database
            // TODO: Update your order status to 'paid' based on pid
            res.redirect(`/order/success?pid=${pid}`);
        } else {
            res.redirect(`/order/failure?pid=${pid}`);
        }
    } catch (error) {
        console.error('Esewa Payment Validation Error:', error);
        res.redirect(`/order/failure?pid=${pid}`);
    }
};

export const esewaFailure = (req, res) => {
    const { pid } = req.query;
    // TODO: Handle payment failure logic here
    res.redirect(`/order/failure?pid=${pid}`);
};
