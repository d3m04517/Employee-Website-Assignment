var employees = [];
var departments = [];
var empCount = 0;
const fs = require('fs');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('d86638m7un4fp8', 'iqoqvroyjofpeo', '40b47522196f728ed150c372858af052e0ee3ee1a2defe6ade1595e6c6d3046f', {
    host: 'ec2-107-21-95-70.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    last_name: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    martialStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.intialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function() {}).then(function(employee) {
            resolve('successfully initialized');
        }).catch(function(error) {
            reject('unable to sync the database');
        });
    })
}

module.exports.getAllEmployees = function() {
    return new Promise((resolve, reject) => {
        Employee.findAll().then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getEmployeesByStatus = function(status) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                status: status
            }
        }).then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getEmployeesByDepartment = function(department) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                department: department
            }
        }).then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getEmployeesByManager = function(manager) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        }).then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getEmployeeByNum = function(num) {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                employeeNum: num
            }
        }).then(function(data) {
            resolve(data[0]);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getManagers = function() {
    return new Promise((resolve, reject) => {
        Employee.findAll({
            where: {
                isManager: true
            }
        }).then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.getDepartments = function() {
    return new Promise((resolve, reject) => {
        Department.findAll().then(function(data) {
            resolve(data);
        }).catch(function() {
            reject("No results returned.");
        });
    })
}

module.exports.addEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for (var emp in employeeData) {
            if (employeeData[emp] == "") {
                employeeData[emp] = null;
            }
        }

        Employee.create({
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.status,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(function() {
            resolve("Employee Added to DB.")
        }).catch(function() {
            reject("Unable to create Employee.");
        });
    })
}

module.exports.updateEmployee = function(employeeData) {
    return new Promise((resolve, reject) => {
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (var emp in employeeData) {
            if (employeeData[emp] == "") {
                employeeData[emp] = null;
            }
        }
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            last_name: employeeData.last_name,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            martialStatus: employeeData.status,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }, {
            where: {
                employeeNum: employeeData.employeeNum
            }

        }).then(function() {
            resolve("Employee Updated.");
        }).catch(function() {
            reject("Unable to update employee.");
        });

    })
}

module.exports.addDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (var i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(function() {
            resolve("Department added.");
        }).catch(function() {
            reject("Unable to add department.");
        });
    })
}

module.exports.updateDepartment = function(departmentData) {
    return new Promise((resolve, reject) => {
        for (var i in departmentData) {
            if (departmentData[i] == "") {
                departmentData[i] = null;
            }
        }
        Department.update({
            departmentName: departmentData.departmentName
        }, {
            where: {
                departmentId: departmentData.departmentId
            }
        }).then(function() {
            resolve("Department updated.");
        }).catch(function() {
            reject("Unable to update department.");
        });
    })
}

module.exports.getDepartmentById = function(id) {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: { departmentId: id }
        }).then(function(data) {
            resolve(data[0]);
        }).catch(function() {
            reject("no results returned");
        });
    })
}

module.exports.deleteEmployeeByNum = function(empNum) {
    return new Promise((resolve, reject) => {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        }).then(function() {
            resolve("destroyed");
        }).catch(function() {
            reject("was rejected");
        });
    })
}