
var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "reborn13",
  database: "bamazon"
});

function Product(item_id, product_name, price) {
    this.item_id = item_id;
    this.product_name = product_name;
    this.price = price;
  }

function customerMain(){
    connection.query(
        "SELECT item_id,product_name,price from products",
        function(err, res) {
            if (err) throw err;
            var products = [];
            for (let i = 0; i < res.length; i++) {
                products.push(new Product(res[i].item_id,res[i].product_name,res[i].price));
            }
            console.table(products);

            inquirer
            .prompt([
                {
                type: "input",
                message: "What is the Item_id of the product you'd like to buy?",
                name: "item_id",
                },
                {
                type: "input",
                message: "How many would you like to buy?",
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
                if(inqRes.item_id && inqRes.quantity){
                    connection.query(
                        "SELECT price,stock_quantity from products where ?",
                        [
                            {
                            item_id: inqRes.item_id
                            }
                        ],
                        function(err, res) {
                            if (err) throw err;
                            // Log all results of the SELECT statement
                            if (res[0].stock_quantity < inqRes.quantity){
                                console.log("Insufficient quantity!")
                                customerMain();
                            }
                            else {
                                connection.query(
                                    "UPDATE products SET ? WHERE ?",
                                    [
                                    {
                                        stock_quantity: res[0].stock_quantity - inqRes.quantity
                                    },
                                    {
                                        item_id: inqRes.item_id
                                    }
                                    ],
                                    function(err, resp) {
                                    console.log("Your total comes to: " + inqRes.quantity *res[0].price +"\n");
                                    connection.end()
                                    }
                                )
                            }
                        }
                    )
                }

            })


        }
        
    );
};

connection.connect(function(err) {
    if (err) throw err;
    customerMain();
});