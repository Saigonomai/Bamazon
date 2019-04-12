var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "reborn13",
    database: "bamazon"
  });


function Product(item_id, product_name, price, stock_quantity) {
    this.item_id = item_id;
    this.product_name = product_name;
    this.price = price;
    this.stock_quantity = stock_quantity;
}


function managerMain() {
    inquirer
    .prompt([
        {
            type: "list",
            message: "Menu:",
            name: "action",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        }
    ])
    .then(function(inqRes) {
        if(inqRes.action){
            switch (inqRes.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInv();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    addProduct();
                    break;

            }
        }
    });
};

function viewProducts(){
    connection.query(
        "SELECT item_id,product_name,price,stock_quantity from products",
        function(err, res) {
            if (err) throw err;
            var products = [];
            for (let i = 0; i < res.length; i++) {
                products.push(new Product(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity));
            }
            console.table(products);
            connection.end();
        }
    );
};

function viewLowInv(){
    connection.query(
        "SELECT item_id,product_name,price,stock_quantity from products WHERE stock_quantity < 5",
        function(err, res) {
            if (err) throw err;
            var products = [];
            for (let i = 0; i < res.length; i++) {
                products.push(new Product(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity));
            }
            console.table(products);
            connection.end();
        }
    );
};

function addInv(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What product(item_id) would you like to add more of?",
            name: "inc",
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                    if(value >= 0){
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }
        }

    ])
    .then(function(inqRes) {
        if(inqRes.inc && inqRes.quantity){
            connection.query(
                "SELECT item_id,stock_quantity from products WHERE ?",
                [
                    {
                        item_id: inqRes.inc
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: (res[0].stock_quantity + inqRes.quantity)
                        },
                        {
                            item_id: res[0].item_id
                        }
                        ],
                        function(err, resp) {
                        console.log("Inventory Updated!\n");
                        connection.end();
                        }
                    );
                }
            );   
        }
    });  
};

function addProduct(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the product name?",
            name: "product_name",
        },
        {
            type: "input",
            message: "What department is this product from?",
            name: "department_name",
        },
        {
            type: "input",
            message: "How much does this product cost?",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) {
                    if(value >= 0){
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                    if(value >= 0){
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }
        }

    ])
    .then(function(inqRes) {
        if (inqRes.product_name && inqRes.department_name && inqRes.price && inqRes.quantity) {
            connection.query(
                "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?",
                [
                [
                    [inqRes.product_name, inqRes.department_name,inqRes.price,inqRes.quantity]
                ]
                ],
                function(err, resp) {
                    console.log("Product Successfully Added!");
                    connection.end();
                }
            )
        }
    });

}


connection.connect(function(err) {
    if (err) throw err;
    managerMain();
});