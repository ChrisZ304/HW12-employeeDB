DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Corporate"), ("Bio-Engineering"), ("Media"), ("Foreign Relations"), ("Science"), ("Tech") 
INSERT INTO role (title, salary, department_id)
VALUES ("Billionaire-CEO", "300000", "1"), ("Billionaire-Playboy", "300000", "6"), ("Photographer", "90000", "3"), ("Scientist", "100000", "5"), ("Super-Soldier", "200000", "2"), ("Alien-Superhuman", "400000", "4");

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bruce", "Wayne", "1", "1"), ("Tony", "Stark", "2", "1"), ("Peter", "Parker", "3", "1"), ("Bruce", "Banner", "4", "1"), ("Steve", "Rogers", "5", "1"), ("Clark", "Kent", "6", "1")
-- Query for view all --
SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC;

-- Query for view all roles --
SELECT  r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id;

--Query for getting employees --
SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee

-- Query for updating --
UPDATE employee SET role_id = ? WHERE id = ?;
UPDATE employee SET CONCAT_WS(' ', first_name last_name) = ? WHERE id = ?

-- Query for Delete --
DELETE FROM employee WHERE id = ? 
DELETE FROM department WHERE id = ?
DELETE FROM role WHERE id = ?

