const taskmanagement = require("../models/Taskmanagement.model.js");
const connect=require("../models/db.js");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const mysql=require("mysql");
const csv = require("fast-csv");
const multer=require("multer");
const fileupload=require('express-fileupload');

exports.create = (req, res) => {

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const todo = new taskmanagement({
    cno: req.body.cno,
    cname: req.body.cname,
    cdes: req.body.cdes,
    cstatus:req.body.cstatus
  });

  taskmanagement.create(todo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Customer."
      });
    else res.send(data);
  });
};

exports.excelfiletodb=(req,res)=>{

readXlsxFile("./Carddetails.xlsx").then((rows) => {
  
  console.log(rows);
  rows.shift();

  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "taskmanagement",
  });

  connection.connect((error) => {
    if (error) {
      console.error(error);
    } else {
      let query = "INSERT INTO todo (cname, cdes, cstatus) VALUES ?";
      connection.query(query, [rows], (error, response) => {
        console.log(error || response);
      });
    }
  });
});
res.send("Successfully Inserted");
};

exports.findAll = (req, res) => {
  taskmanagement.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};

exports.countall = (req, res) => {
  taskmanagement.count((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving customers."
      });
    else res.send(data);
  });
};


exports.findOne = (req, res) => {
  taskmanagement.findById(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Customer with id " + req.params.customerId
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  console.log(req.body);
  taskmanagement.updateById(
    req.params.customerId,
    new Customer(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Customer with id ${req.params.customerId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Customer with id " + req.params.customerId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  taskmanagement.remove(req.params.customerId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Customer with id ${req.params.customerId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Customer with id " + req.params.customerId
        });
      }
    } else res.send({ message: `Customer was deleted successfully!` });
  });
};

exports.deleteAll = (req, res) => {
  taskmanagement.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all customers."
      });
    else res.send({ message: `All Customers were deleted successfully!` });
  });
};

 exports.textfiletodb=(req,res)=>{
 let stream = fs.createReadStream("test.txt");
let myData = [];
let csvStream = csv
  .parse()
  .on("data", function (data) {
    myData.push(data);
  })
  .on("end", function () {
    myData.shift();

    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "admin",
      database: "taskmanagement",
    });

    connection.connect((error) => {
      if (error) {
        console.error(error);
      } else {
        let query = "INSERT INTO todo (cname, cdes, cstatus) VALUES ?";
        connection.query(query, [myData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
  stream.pipe(csvStream);
  res.send("Success"); 
};


exports.importExcelData2MySQL=function(filePath){

	readXlsxFile(filePath).then((rows) => {
			 
		console.log(rows);

		rows.shift();
	 		
		const connection = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'admin',
			database: 'taskmanagement'
		});
	 
		connection.connect((error) => {
			if (error) {
				console.error(error);
			} else {
				let query = 'INSERT INTO todo (cname,cdes,cstatus) VALUES ?';
				connection.query(query, [rows], (error, response) => {
				console.log(error || response);
				});
			}
		});
	})

}
 
exports.importTextData2MySQL=function(filePath){
    let stream = fs.createReadStream(filePath);
    let myData = [];
    let csvStream = csv
      .parse()
      .on("data", function (data) {
        myData.push(data);
      })
      .on("end", function () {
        myData.shift();
        var item="$";
        remove(myData,item);
        function remove(myData, item) {
            for (var i = myData.length; i--;) {
                if (myData[i] == item) {
                    myData.splice(i, 1);
                }
            }
        }
        const connection = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "admin",
          database: "taskmanagement",
        });
    
        connection.connect((error) => {
          if (error) {
            console.error(error);
          } else {
            let query = "INSERT INTO todo (cname, cdes, cstatus) VALUES ?";
            connection.query(query, [myData], (error, response) => {
              console.log(error || response);
            });
          }
        });
      });
      stream.pipe(csvStream);
    };

    
    exports.importExcelData2MySQLDB=function (filePath){
    
      readXlsxFile(filePath).then((rows) => {
			 
        console.log(rows);
    
        rows.shift();
           
        const connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'admin',
          database: 'taskmanagement'
        });
       
        connection.connect((error) => {
          if (error) {
            console.error(error);
          } else {
            let query = 'INSERT INTO todo (cname, cdes, cstatus) VALUES ?';
            connection.query(query, [rows], (error, response) => {
            console.log(error || response);
            });
          }
        });
      })
    }

    exports.importTextData2MySQLDB=function(filePath){
      let stream = fs.createReadStream(filePath);
      let myData = [];
      let csvStream = csv
        .parse()
        .on("data", function (data) {
          myData.push(data);
        })
        .on("end", function () {
          myData.shift();
          var item="$";
          remove(myData,item);
          function remove(myData, item) {
              for (var i = myData.length; i--;) {
                  if (myData[i] == item) {
                      myData.splice(i, 1);
                  }
              }
          }
          const connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "admin",
            database: "taskmanagement",
          });
      
          connection.connect((error) => {
            if (error) {
              console.error(error);
            } else {
              let query = "INSERT INTO todo (cname, cdes, cstatus) VALUES ?";
              connection.query(query, [myData], (error, response) => {
                console.log(error || response);
              });
            }
          });
        });
        stream.pipe(csvStream);
      };
    

