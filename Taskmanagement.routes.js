module.exports = app => {
  const taskmanagement = require("../controllers/Taskmanagement.controller.js");
  const multer = require('multer');
  const express=require('express');
  const csv = require('fast-csv');
  const fileuplod=require('express-fileupload');
 
//   global.__basedir = __dirname;
 
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 	   cb(null, __basedir + '/uploads/')
// 	},
// 	filename: (req, file, cb) => {
// 	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
// 	}
// });

// const upload = multer({storage: storage});

  app.post("/taskmanagement/createTask", taskmanagement.create);

  app.get("/taskmanagement/findall", taskmanagement.findAll);
  
  app.get("/taskmanagemet/count", taskmanagement.countall);
  
  app.get("/taskmanagementfindbyid/:customerId", taskmanagement.findOne);

  app.put("/taskmanagenetupdatebyid/:customerId", taskmanagement.update);

  app.delete("/taskmanagementdeletebyid/:customerId", taskmanagement.delete);

  app.delete("/taskmanagement/deleteall", taskmanagement.deleteAll);
  
  //app.post("/taskmanagement/excelfiletodb", taskmanagement.excelfiletodb);

  //app.post("/taskmanagement/textfiletodb", taskmanagement.textfiletodb); 

//   app.post('/taskmanagement/uploadexcelfile', upload.single("uploadfile"), (req, res) =>{
//     taskmanagement.importExcelData2MySQL(__basedir + '/uploads/' + req.file.filename);
//     res.json({
//           'msg': 'File uploaded/import successfully!', 'file': req.file
//         });
//   });
    
//   app.post('/taskmanagement/uploadtextfile', upload.single("uploadfile"), (req, res) =>{
//     taskmanagement.importTextData2MySQL(__basedir + '/uploads/' + req.file.filename);
//   res.json({
//         'msg': 'File uploaded/import successfully!', 'file': req.file
//       });
// });


app.post('/taskmanagement/upload',(req, res) =>{
  let filepath = req.files.uploadfile.tempFilePath;
  taskmanagement.importExcelData2MySQLDB(filepath);
  res.json({
        msg: 'File uploaded/import successfully!', 
        file: req.file
    });
});

app.post('/taskmanagement/textupload',(req, res) =>{
  let filepath = req.files.uploadfile.tempFilePath;
  taskmanagement.importTextData2MySQLDB(filepath);
  res.json({
        msg: 'File uploaded/import successfully!', 
        file: req.file
    });
});
}  
  
