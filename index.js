const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { log } = require('console');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render('home', { files: files });
    })

})

app.get('/file/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
        res.render('show', { filename: req.params.filename, filedata: filedata })
    })

})

app.get('/edit/:filename', function (req, res) {
    res.render('edit', { filename: req.params.filename })

})

app.post('/edit', function (req, res) {
    // fs.rename(`./files/${req.body.previous.trim()}`, `./files/${req.body.new.trim()}`, function (err) {
    //     res.redirect('/');
    const oldPath = `./files/${req.body.previous}`;
    const newPath = `./files/${req.body.new}`;
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');

    })

})


app.post('/create', function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}`, req.body.details, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    })

})

app.listen(3000, () => {
    console.log(`Server running on localhost:${3000}`)
});

