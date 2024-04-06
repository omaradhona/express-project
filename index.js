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
                templateImage = "templates/" + folder + "/" + fileName + ".jpg";

                // "templates/" + category + template + "jpg"
                run(modifiedPath, folder, htmlFile, fileName, templateImage)            
            });
    })
}

//populateJson();

//const staticPath = path.join(__dirname, "/public");

//app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.get("/data", (req, res) => {
    res.sendFile(path.join(__dirname, "data.json"));
})

app.get("/templates/hero-sections/hero-section-digital.html", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", "hero-sections", "hero-section-digital.html"));
})

app.get("/templates/:folder/:file", (req, res) => {
    res.sendFile(path.join(__dirname, "templates", req.params.folder, req.params.file));
})

app.listen(4000, () => {
    console.log(`Example app listening on port 4000`)
})


//require('child_process').exec("start http://localhost:4000/");



async function run(url, category, template, fileName, templateImage){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const html = await page.$eval('body', el => el.innerHTML);
    const css = await page.$eval('style', el => el.innerHTML);
    const ele = await page.$("body");

    if(category == "navbars"){
        await page.setViewport({ width: 580, height: 300 })
    }
    else{
        await page.setViewport({ width: 1280, height: 720 });
    }
    
    await ele.screenshot({ path: templateImage })

    await browser.close();

    data[category][template] = {
        html: html,
        css: css,
        path: url,
        name: fileName,
        image: templateImage
    }

    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

//run(modifiedPath, "wilunch");

async function scr(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("file:///D:/Projects/templates-factory/templates/navbars/navbar-wilunch.html");

    const html = await page.$eval('body', el => el.innerHTML);
    const css = await page.$eval('style', el => el.innerHTML);
    const ele = await page.$("body");
    const width = await page.$eval("nav", el => getComputedStyle(el).getPropertyValue("width"))
    const height = await page.$eval("nav", el => getComputedStyle(el).getPropertyValue("height"))
    
    /*
    await page.setViewport({ 
        width: parseInt(width.slice(0, width.length - 2)),
        height: parseInt(height.slice(0, height.length - 2))
    });
    */
    await page.setViewport({ width: 580, height: 300 })
    await ele.screenshot({ path: "image.jpeg" })

    await browser.close();
}


//scr();