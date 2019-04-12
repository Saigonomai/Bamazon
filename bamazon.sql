CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;
DROP TABLE IF EXISTS products;
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  product_sales INT default 0,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES
("pen","stationary",8,100),
("pencil","stationary",5,100),
('60" tv',"electronics",200,10),
("eraser","stationary",4,150),
("amazon echo","electronics",250,20),
("baseball bat","sports",15,80),
("10 stack, 8x11 paper","stationary",5,200),
("basketball net","sports",80,50);

select * from products;

DROP TABLE IF EXISTS departments;
CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NOT NULL,
  over_head_costs INT default 0,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs) VALUES
("stationary",100),
("electronics",2500),
("sports",250);

select * from departments;

SELECT departments.department_id,departments.department_name,departments.over_head_costs, SUM(products.product_sales) as product_sales, (SUM(products.product_sales) - departments.over_head_costs) as total_profit FROM departments LEFT JOIN products on departments.department_name = products.department_name GROUP BY department_name;
