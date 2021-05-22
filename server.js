const mysql = require('mysql');
const inquirer = require('inquirer');
const { printTable } = require('console-table-printer');
let roles;
let departments;
let managers;
let employees;

 connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
    database: "employeeDB"
  });


  connection.connect(function(err) {
    if (err) throw err;
    start();
    getDepartments();
    getRoles();
    getManagers();
    getEmployees();
  });

  start = () => {

    inquirer
      .prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"]
      })
      .then(function(answer) {
        if (answer.choices === "ADD") {
          addData();
        }
        else if (answer.choices === "VIEW") {
          viewData();
        } 
        else if (answer.choices === "UPDATE") {
          updateData();
        }
        else if (answer.choices === "DELETE") {
          deleteData();
        }
        else if (answer.choices === "EXIT") {
          
          connection.end();
        }
        else{
          connection.end();
        }
      });
  }

getRoles = () => {
  connection.query("SELECT id, title FROM role", (err, res) => {
    if (err) throw err;
    roles = res;
    // console.table(roles);
  })
};

getDepartments = () => {
  connection.query("SELECT id, name FROM department", (err, res) => {
    if (err) throw err;
    departments = res;
    // console.log(departments);
  })
};

getManagers = () => {
  connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
    if (err) throw err;
    managers = res;
    // console.table(managers);
  })
};

getEmployees = () => {
  connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee", (err, res) => {
    if (err) throw err;
    employees = res;
    // console.table(employees);
  })
};

addData = () => {
  inquirer.prompt([
    {
      name: "add",
      type: "list",
      message: "What would you like to add?",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE", "EXIT"]
    }
  ]).then(function(answer) {
    if (answer.add === "DEPARTMENT") {
      console.log("Add a new: " + answer.add);
      addDepartment();
    }
    else if (answer.add === "ROLE") {
      console.log("Add a new: " + answer.add);
      addRole();
    }
    else if (answer.add === "EMPLOYEE") {
      console.log("Add a new: " + answer.add);
      addEmployee();
    } 
    else if (answer.add === "EXIT") {
     
      connection.end();
    } else {
      connection.end();
    }
  })
};

addDepartment = () => {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "What department would you like to add?"
    }
  ]).then(function(answer) {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, res) => {
      if (err) throw err;
      console.log(answer.department + " department added Successfully!" );
      getDepartments();
      start();
    }) 
  })
};

addRole = () => {
  let departmentOptions = [];
  for ( i = 0; i < departments.length; i++) {
    departmentOptions.push(Object(departments[i]));
  };

  inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "What role would you like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for this role?"
    },
    {
      name: "department_id",
      type: "list",
      message: "What is the department for this role?",
      choices: departmentOptions
    },
  ]).then(function(answer) {
    for (i = 0; i < departmentOptions.length; i++) {
      if (departmentOptions[i].name === answer.department_id) {
        department_id = departmentOptions[i].id
      }
    }
    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.role}', '${answer.salary}', ${department_id})`, (err, res) => {
      if (err) throw err;

      console.log(answer.role + " role added successfully!");
      getRoles();
      start();
    }) 
  })
};

addEmployee = () => {
  getRoles();
  getManagers();
  let roleOptions = [];
  for (i = 0; i < roles.length; i++) {
    roleOptions.push(Object(roles[i]));
  };
  let managerOptions = [];
  for (i = 0; i < managers.length; i++) {
    managerOptions.push(Object(managers[i]));
  }
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role_id",
      type: "list",
      message: "What is the role of this employee?",
      choices: function() {
        let choiceArray = [];
        for ( i = 0; i < roleOptions.length; i++) {
          choiceArray.push(roleOptions[i].title)
        }
        return choiceArray;
      }
    },
    {
      name: "manager_id",
      type: "list",
      message: "Who is the employee's manager?",
      choices: function() {
        let choiceArray = [];
        for ( i = 0; i < managerOptions.length; i++) {
          choiceArray.push(managerOptions[i].managers)
        }
        return choiceArray;
      }
    }
  ]).then(function(answer) {
    for (let i = 0; i < roleOptions.length; i++) {
      if (roleOptions[i].title === answer.role_id) {
        role_id = roleOptions[i].id
      }
    }

    for (let i = 0; i < managerOptions.length; i++) {
      if (managerOptions[i].managers === answer.manager_id) {
        manager_id = managerOptions[i].id
      }
    }

    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, (err, res) => {
      if (err) throw err;

      console.log("New employee " + answer.first_name + " " + answer.last_name + ", added successfully!");
      getEmployees();
      start()
    }) 
  })
};

viewData = () => {
  inquirer.prompt([
    {
      name: "viewChoice",
      type: "list",
      message: "What would you like to view?",
      choices: ["DEPARTMENTS", "ROLES", "EMPLOYEES", "EXIT"]
    }
  ]).then(answer => {
    if (answer.viewChoice === "DEPARTMENTS") {
      viewDepartments();
    }
    else if (answer.viewChoice === "ROLES") {
      viewRoles();
    }
    else if (answer.viewChoice === "EMPLOYEES") {
      viewEmployees();
    }
    else if (answer.viewChoice === "EXIT") {
      
      connection.end();
    } else {
      connection.end();
    }
  })
};

viewDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    
    printTable(res);
    start();
  });
};

viewRoles = () => {
  connection.query("SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id", (err, res) => {
    if (err) throw err;
    
    printTable(res);
    start();
  });
};

viewEmployees = () => {
  connection.query('SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC', (err, res) => {
    if (err) throw err;
    
    printTable(res);
    start();
  });
};

updateData = () => {
  inquirer.prompt([
    {
      name: "update",
      type: "list",
      message: "What would you like to update?",
      choices: ["Update employee role", "Update employee manager", "EXIT"]
    }
  ]).then(answer => {
    if (answer.update === "Update employee role") {
      updateEmployeeRole();
    }
    else if (answer.update === "Update employee manager") {
      updateEmployeeManager();
    }
    else if(answer.update === "EXIT") {
      
      connection.end();
    } else {
      connection.end();
    }
  })
};

updateEmployeeRole = () => {
  let employeeOptions = [];

  for ( i = 0; i < employees.length; i++) {
    employeeOptions.push(Object(employees[i]));
  }
  inquirer.prompt([
    {
      name: "updateRole",
      type: "list",
      message: "Which employee's role do you want to update?",
      choices: function () {
        let choiceArray = [];
        for (var i = 0; i < employeeOptions.length; i++) {
          choiceArray.push(employeeOptions[i].Employee_Name);
        }
        return choiceArray;
      }
    }
  ]).then(answer => {
    let roleOptions = [];
    for ( i = 0; i < roles.length; i++) {
      roleOptions.push(Object(roles[i]));
    };
    for ( i = 0; i < employeeOptions.length; i++) {
      if (employeeOptions[i].Employee_Name === answer.updateRole) {
        employeeSelected = employeeOptions[i].id
      }
    }
    inquirer.prompt([
      {
        name: "newRole",
        type: "list",
        message: "Select a new role:",
        choices: function() {
          let choiceArray = [];
          for ( i = 0; i < roleOptions.length; i++) {
            choiceArray.push(roleOptions[i].title)
          }
          return choiceArray;
        }
      }
    ]).then(answer => {
for ( i = 0; i < roleOptions.length; i++) {
  if (answer.newRole === roleOptions[i].title) {
    newChoice = roleOptions[i].id
    connection.query(`UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
      if (err) throw err;
    };
  }
}
console.log("Role successfully updated to ID: " + newChoice + "!" );
getEmployees();
getRoles();
start();
    })
  })
};
  

updateEmployeeManager = () => {
  let employeeOptions = [];

  for ( i = 0; i < employees.length; i++) {
    employeeOptions.push(Object(employees[i]));
  }
  inquirer.prompt([
    {
      name: "updateManager",
      type: "list",
      message: "Which employee's manager do you want to update?",
      choices: function () {
        let choiceArray = [];
        for ( i = 0; i < employeeOptions.length; i++) {
          choiceArray.push(employeeOptions[i].Employee_Name);
        }
        return choiceArray;
      }
    }
  ]).then(answer => {
    getEmployees();
    getManagers();
    let managerOptions = [];
    for ( i = 0; i < managers.length; i++) {
      managerOptions.push(Object(managers[i]));
    };
    for ( i = 0; i < employeeOptions.length; i++) {
      if (employeeOptions[i].Employee_Name === answer.updateManager) {
        employeeSelected = employeeOptions[i].id
      }
    }
    inquirer.prompt([
      {
        name: "newManager",
        type: "list",
        message: "Select a new manager:",
        choices: function() {
          let choiceArray = [];
          for ( i = 0; i < managerOptions.length; i++) {
            choiceArray.push(managerOptions[i].managers)
          }
          return choiceArray;
        }
      }
    ]).then(answer => {
for ( i = 0; i < managerOptions.length; i++) {
  if (answer.newManager === managerOptions[i].managers) {
    newChoice = managerOptions[i].id
    connection.query(`UPDATE employee SET manager_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
      if (err) throw err;
    };
    console.log( "Manager successfully updated to ID: " + newChoice + "!");
  }
}
getEmployees();
getManagers();
start();
    })
  })
};

deleteData = () => {
  inquirer.prompt([
    {
      name: "delete",
      type: "list",
      message: "Select something to delete:",
      choices: ["Delete department", "Delete role", "Delete employee", "EXIT"]
    }
  ]).then(answer => {
    if (answer.delete === "Delete department") {
      deleteDepartment();
    }
    else if (answer.delete === "Delete role") {
      deleteRole();
    }
    else if (answer.delete === "Delete employee") {
      deleteEmployee();
    } else if(answer.delete === "EXIT") {
      
      connection.end();
    }
     else {
      connection.end();
    }
  })
};

deleteDepartment = () => {
  let departmentOptions = [];
  for ( i = 0; i < departments.length; i++) {
    departmentOptions.push(Object(departments[i]));
  }

  inquirer.prompt([
    {
      name: "deleteDepartment",
      type: "list",
      message: "Please select a department to delete:",
      choices: function() {
        let choiceArray = [];
        for ( i = 0; i < departmentOptions.length; i++) {
          choiceArray.push(departmentOptions[i])
        }
        return choiceArray;
      }
    }
  ]).then(answer => {
    for ( i = 0; i < departmentOptions.length; i++) {
      if (answer.deleteDepartment === departmentOptions[i].name) {
        newChoice = departmentOptions[i].id
        connection.query(`DELETE FROM department Where id = ${newChoice}`), (err, res) => {
          if (err) throw err;
        };
        console.log("Department: " + answer.deleteDepartment + ", deleted succesfully!");
      }
    }
    getDepartments();
    start();
  })
};

deleteRole = () => {
  let roleOptions = [];
  for ( i = 0; i < roles.length; i++) {
    roleOptions.push(Object(roles[i]));
  }

  inquirer.prompt([
    {
      name: "deleteRole",
      type: "list",
      message: "Please select a role to delete:",
      choices: function() {
        let choiceArray = [];
        for ( i = 0; i < roleOptions.length; i++) {
          choiceArray.push(roleOptions[i].title)
        }
        return choiceArray;
      }
    }
  ]).then(answer => {
    for ( i = 0; i < roleOptions.length; i++) {
      if (answer.deleteRole === roleOptions[i].title) {
        newChoice = roleOptions[i].id
        connection.query(`DELETE FROM role Where id = ${newChoice}`), (err, res) => {
          if (err) throw err;
        };
        console.log("Role: " + answer.deleteRole + ", deleted succesfully!");
      }
    }
    getRoles();
    start();
  })
};

deleteEmployee = () => {
  let employeeOptions = [];
  for ( i = 0; i < employees.length; i++) {
    employeeOptions.push(Object(employees[i]));
  }

  inquirer.prompt([
    {
      name: "deleteEmployee",
      type: "list",
      message: "Which employee would you like to delete?",
      choices: function() {
        let choiceArray = [];
        for ( i = 0; i < employeeOptions.length; i++) {
          choiceArray.push(employeeOptions[i].Employee_Name)
        }
        return choiceArray;
      }
    }
  ]).then(answer => {
    for ( i = 0; i < employeeOptions.length; i++) {
      if (answer.deleteEmployee === employeeOptions[i].Employee_Name) {
        newChoice = employeeOptions[i].id
        connection.query(`DELETE FROM employee Where id = ${newChoice}`), (err, res) => {
          if (err) throw err;
        };
        console.log("Employee: " + answer.deleteEmployee + ", deleted succesfully!");
      }
    }
    getEmployees();
    start();
  })
};

