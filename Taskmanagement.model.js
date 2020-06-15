const sql = require("./db.js");

const taskmanagement = function(todo) {
  this.cno = todo .cno;
  this.cname = todo .cname;
  this.cdes = todo .cdes;
  this.cstatus=todo.cstatus;
};

taskmanagement.create = (newCustomer, result) => {
  sql.query("INSERT INTO todo SET ?", newCustomer, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", {cno: res.insertId, ...newCustomer });
    result(null, { id: res.insertId, ...newCustomer });
  });
};

taskmanagement.findById = (cno, result) => {
  sql.query(`SELECT * FROM todo WHERE cno = ${cno}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found customer: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

taskmanagement.getAll = result => {
  sql.query("SELECT * FROM todo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("customers: ", res);
    result(null, res);
  });
};

taskmanagement.count = result => {
  sql.query("SELECT COUNT(*) as count FROM todo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("count: ", res);
    result(null, res);
  });
};

taskmanagement.updateById = (cno, todo, result) => {
  sql.query(
    "UPDATE todo SET cname = ?, cdes= ? ,cstatus=? WHERE cno = ?",
    [ todo .cname, todo .cdes, todo.cstatus,cno],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated customer: ", { cno: cno, ...todo });
      result(null, { cno: cno, ...todo });
    }
  );
};

taskmanagement.remove = (cno, result) => {
  sql.query("DELETE FROM todo WHERE cno = ?", cno, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted customer with id: ", cno);
    result(null, res);
  });
};

taskmanagement.removeAll = result => {
  sql.query("DELETE FROM todo", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} todo `);
    result(null, res);
  });
};

module.exports = taskmanagement;
