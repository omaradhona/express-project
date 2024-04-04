const puppeteer = require("puppeteer");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

//app.set("view engine", "ejs");

const data = require("./data.json");

const folderPath = './templates';
//console.log(fs.readdirSync(folderPath));
//console.log(fs.readdirSync(path.join(folderPath, fs.readdirSync(folderPath)[0])))

var arr = [];
var originalPath;
var modifiedPath;
var fileName;
//console.log(path.extname(path.join(folderPath, fs.readdirSync(folderPath)[0], arr[0])))

function populateJson(){
    fs.readdirSync(folderPath).map(folder => {
        data[folder] = {}
        fs.readdirSync(path.join(folderPath, folder))
            .filter(file => path.extname(path.join(folderPath, folder, file)) == ".html")
            .map(htmlFile => {
                arr.push(htmlFile);
                originalPath = path.resolve(folderPath, folder, htmlFile);
                modifiedPath = "file:///" + originalPath.replaceAll("\\", "/")
                fileName = path.basename(htmlFile, ".html");

                run(modifiedPath, folder, htmlFile, fileName)            
            });
    })
}

//populateJson();

//console.log(originalPath)
//modifiedPath = "file:///" + originalPath.replaceAll("\\", "/")
//console.log(modifiedPath)
//run(modifiedPath)
//console.log(arr)
//require('child_process').exec("start http://localhost:4000/");







const staticPath = path.join(__dirname, "/public");

app.use(express.static(staticPath));


app.get("/data", (req, res) => {
    res.send(data);
})

app.listen(4000, () => {
    console.log(`Example app listening on port 4000`)
})

//require('child_process').exec("start http://localhost:4000/");
//window.localStorage.setItem("data", JSON.stringify(data));
//const fs = require('fs');

//let object = JSON.parse(fs.readFileSync('data.json'));
//console.log(object.html);

//console.log(data.html);


async function run(url, category, template, fileName){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const html = await page.$eval('body', el => el.innerHTML);
    const css = await page.$eval('style', el => el.innerHTML);

    await browser.close();

    data[category][template] = {
        html: html,
        css: css,
        path: url,
        name: fileName
    }

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

//run(modifiedPath, "wilunch");