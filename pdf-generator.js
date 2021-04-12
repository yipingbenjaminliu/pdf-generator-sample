const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);

	var milis = new Date();
	milis = milis.getTime();

	var pdfPath = path.join('pdf', `${data.firstname}-` + new Date().valueOf() + `.pdf`);
	console.log("generating " + pdfPath)

	var options = {
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		landscape: true,
		printBackground: false,
		path: pdfPath,
		preferCSSPageSize: true
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}

var arr = [["Kyong Nevels","9396 Shipley St. Daphne, AL 36526"],
		   ["Kamala Brackens","425 Oak Ave. Hanover Park, IL 60133"],
		   ["Laurence Hasty","839 Fulton Ave. Burke, VA 22015"],
		   ["Ardell Leedy","625 Durham Court Bristow, VA 20136"],
		   ["Boyce Burlew","63 NW. Devonshire St. Randolph, MA 02368"],
		   ["Diamond Winstead","877 Santa Clara Ave. Lumberton, NC 28358"],
		   ["Cathleen Symes","8539 Kirkland Street Huntsville, AL 35803"],
		   ["Mei Allman","7129 Lakewood Ave. Winter Springs, FL 32708"],
		   ["Phylis Makin","8071 Roehampton Circle Buford, GA 30518"],
		   ["Devona Porcaro","9508 Wrangler Lane Dawsonville, GA 30534"],
		   ["Jackson Tilford","9168 Edgewater Avenue Butte, MT 59701"],
		   ["Roland Dominy","101 Warren Lane Hamburg, NY 14075"],
		   ["Ludie Levan","91 Elm Dr. Chaska, MN 55318"],
		   ["Sherrell Adair","88 Canterbury Lane Oconomowoc, WI 53066"],
		   ["Nicolasa Sowinski","8600 Winding Way Drive Gurnee, IL 60031"],
		   ["Marget Zenon","350 West Summer Street Orland Park, IL 60462"],
		   ["Chloe Shadwick","31 Constitution Ave. Sevierville, TN 37876"],
		   ["Bailey Cady","28 Court Ave. Sewell, NJ 08080"],
		   ["Farah Colby","62 South Shadow Brook Dr. Aiken, SC 29803"],
		   ["Pasty Pavlik","750 Oakland Road Harlingen, TX 78552"]]



var PromisePool = require('es6-promise-pool')

var counter = 0
var count = 0
var data = {}
var threads = arr.length;


var promiseProducer = function () {
	if (count < threads) {
		count++;
		counter++;
		data = {
			firstname: arr[counter-1][0],
			address: arr[counter-1][1],
		}
		return createPDF(data)
	} else {
		return null
	}
}

var pool = new PromisePool(promiseProducer, require('events').EventEmitter.defaultMaxListeners-1)

pool.start()
.then(function () {
	console.log('Complete')
})