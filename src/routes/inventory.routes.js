const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.get('/inventory/:hotelID', inventoryController.getInventory);
router.post('/add-item', inventoryController.addItem);
router.post('/order-item', inventoryController.orderItem);
router.get('/transactions/:hotelID', inventoryController.getTransactions);
router.post('/receive-order', inventoryController.receiveOrder);
router.post('/update-transaction', inventoryController.updateTransaction);
router.get('/transaction-summary/:hotelID', inventoryController.getTransactionSummary);

module.exports = router;
