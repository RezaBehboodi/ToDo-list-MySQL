const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// INSERT TODO
app.post('/insert', (request, response) => {
    const { todo, date, description } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.insertNewTodo(todo, date, description);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});

// GET TODO
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
    
})

// UPDATE TODO
app.patch('/update', (request, response) => {
    const { id, todo,date,description } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id,todo,date,description);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
    
});

// DELETE TODO
app.delete('/delete/:id', (request, response) => {
   
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
        
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});
app.listen(process.env.PORT, () => console.log('app is running'));