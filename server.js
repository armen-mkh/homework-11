const mysql = require("mysql");
const util = require('util')

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

connection.query = util.promisify(connection.query)

module.exports = {

    findAllEmployees : () => {
        let queryString = "SELECT * FROM employee"
        return connection.query(queryString)
    },

    findAllRoles : () => {
        return connection.query("SELECT * FROM role")
    },
    findAllDepartments : () => {
        return connection.query("SELECT * FROM department")
    },
    findAllEmployeesByDepartment :(departmentId) => {
        let queryString = "SELECT employee.first_name, employee.last_name, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department_id = ?"
         return connection.query(queryString, departmentId)
    },
    findAllEmployeesByManager: (managerId)=> {
        return connection.query(`SELECT first_name, last_name,
         manager_id FROM employee WHERE manager_id = ?`, managerId)
    },
    findAllManagers: () => {
        return connection.query("SELECT * FROM employee WHERE manager_id IS NULL")
    },
    createEmployee : (data) => {
        return connection.query("INSERT INTO employee SET ? ", data) //SET {first_name: something, last_name:something}
    },
    createDepartment : (data) => {
        return connection.query("INSERT INTO department SET ?", data)
    },
    createRole : (role) => {
        return connection.query("INSERT INTO role SET ?", role)
    },
    updateEmployeeRole: (employeeId, roleId) => {
        return connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId])
    },
    updateEmployeeManager: (employeeId, managerId) => {
        return connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId])
    },
    removeRole: (roleId) => {
        return connection.query("DELETE FROM role WHERE id = ?", roleId)
    },
    removeDepartment: (departmentId) => {
        return connection.query("DELETE FROM department WHERE id = ?", departmentId)
    },
    removeEmployee: (employeeId) => {
        return connection.query("DELETE FROM employee WHERE id =?", employeeId)
    }

}
