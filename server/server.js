const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 5000;

app.use(bodyParser.json());

let jsonData = [];
fs.readFile('data.json', 'utf8', (err, data) => {
  if (!err) {
    jsonData = JSON.parse(data);
  }
});

app.get('/data', (req, res) => {
  res.json(jsonData);
});

app.post('/data', (req, res) => {
  const newData = req.body;
  newData.id = Date.now();
  jsonData.push(newData);
  fs.writeFile('data.json', JSON.stringify(jsonData), err => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
  res.json(newData);
});

app.put('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedData = req.body;
  const index = jsonData.findIndex(item => item.id === id);
  if (index !== -1) {
    jsonData[index] = { ...jsonData[index], ...updatedData };
    fs.writeFile('data.json', JSON.stringify(jsonData), err => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
    res.json(jsonData[index]);
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

app.delete('/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = jsonData.findIndex(item => item.id === id);
  if (index !== -1) {
    jsonData.splice(index, 1);
    fs.writeFile('data.json', JSON.stringify(jsonData), err => {
      if (err) {
        console.error('Error writing to file:', err);
      }
    });
    res.json({ message: 'Data deleted successfully' });
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
