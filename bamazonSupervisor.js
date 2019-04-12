var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "reborn13",
  database: "bamazon"
});

function Report(department_id, department_name, over_head_costs, product_sales, total_profit) {
    this.department_id = department_id;
    this.department_name = department_name;
    this.over_head_costs = over_head_costs;
    this.product_sales = product_sales;
    this.total_profit = total_profit;
}

function supervisorMain(){
    inquirer
    .prompt([
        {
            type: "list",
            message: "Menu:",
            name: "action",
            choices: ["View Product Sales by Department", "Create New Department"]        }
    ])
    .then(function(inqRes) {
        if (inqRes.action){
            switch (inqRes.action) {
                case "View Product Sales by Department":
                    connection.query(
                        "SELECT departments.department_id,departments.department_name,departments.over_head_costs, SUM(products.product_sales) as product_sales, (SUM(products.product_sales) - departments.over_head_costs) as total_profit FROM departments LEFT JOIN products on departments.department_name = products.department_name GROUP BY department_name;",
                        function(err, res) {
                            if (err) throw err;
                            var reports = [];
                            for (let i = 0; i < res.length; i++) {
                                reports.push(new Report(res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit));
                            }
                            console.table(reports);
                            connection.end();
                        }
                    );
                    break;

                case "Create New Department":
                    addDep();
                    break;            
            }
        }

         
    });

}

function addDep(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "department_name",
        },
        {
            type: "input",
            message: "What are this department's overhead costs?",
            name: "cost",
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
        if(inqRes.cost && inqRes.department_name){
            connection.query(
                "INSERT INTO departments (department_name, over_head_costs) VALUES ?",
                [[
                    [inqRes.department_name,inqRes.cost]
                ]],
                function(err, resp) {
                    console.log("Department Successfully Added!");
                    connection.end();
                }
            )
        }
    });

}

connection.connect(function(err) {
    if (err) throw err;
    supervisorMain();
});