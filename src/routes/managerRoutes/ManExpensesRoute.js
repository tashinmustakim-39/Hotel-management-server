const express = require('express');
const router = express.Router();
const managementController = require('../../controllers/managerControllers/ManExpensesController');

router.post('/hotel-expenses', managementController.getHotelExpenses);
router.post('/transaction-earnings', managementController.getTransactionEarnings);
router.post('/monthly-transactions', managementController.getMonthlyTransactions);
router.post('/maintenance-ledger', managementController.addMaintenanceEntry);
router.get('/maintenance-ledger', managementController.getMaintenanceLedger);

module.exports = router;
