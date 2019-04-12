CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;
DROP TABLE IF EXISTS products;
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
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

select * from products