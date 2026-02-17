const express = require('express');
const router = express.Router();
const guestController = require('../../controllers/receptionistControllers/realCheckoutController');

// Matches user's "checkoutroute" endpoints
router.post("/current-guests", guestController.getCurrentGuests);
router.post("/filter-guests", guestController.filterGuests);

// Advanced Checkout & Billing
router.post("/checkout-today", guestController.getCheckoutToday);
router.post("/filter-checkout", guestController.filterCheckout);
router.post("/payment-done", guestController.paymentDone);
router.post("/billing-details", guestController.getBillingDetails);

module.exports = router;
