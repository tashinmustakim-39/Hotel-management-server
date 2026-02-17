const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/managerControllers/employeeController');

router.post('/employees', employeeController.getEmployees);
router.post('/employee-details', employeeController.getEmployeeDetails);
router.post('/update-hourly-pay', employeeController.updateHourlyPay);
router.post('/departments', employeeController.getDepartments);
router.post('/add-employee', employeeController.addEmployee);
router.post('/update-employee', employeeController.updateEmployee);
router.post('/filter-employees', employeeController.filterEmployees);

module.exports = router;
