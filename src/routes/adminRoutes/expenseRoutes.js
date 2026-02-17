const express = require('express');
const router = express.Router();
const expenseController = require('../../controllers/adminControllers/expenseController');

// Get Inventory Cost by Month
router.get('/inventory-summary/:hotelId', expenseController.getInventorySummary);

// Get Maintenance Cost by Month
router.get('/maintenance-summary/:hotelId', expenseController.getMaintenanceSummary);

// Get Salary by Department
router.get('/salary-summary/:hotelId', expenseController.getSalarySummary);

// Get Monthly Revenue from Transactions
router.get('/transaction-summary-admin/:hotelId', expenseController.getTransactionRevenue);

// Financial Summary for Totals
router.get('/financial-summary/:hotelId', expenseController.getFinancialSummary);

module.exports = router;
