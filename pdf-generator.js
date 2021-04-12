const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");

async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template-test.html'), 'utf8');
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

// const data = {
// 	firstname: "Anthony Edward Stark",
// 	address: "200 Park Ave, New York, NY 10166, USA",
// }

// for (var i = 0; i < arr.length; i++) {
//     var data = {
// 		firstname: arr[i][0],
// 		address: arr[i][1],
// 	}
// 	console.log(data)
// 	createPDF(data)
// }


var PromisePool = require('es6-promise-pool')

var promiseProducer = function() {
	for (var i = 0; i < arr.length; i++) {
		var data = {

		}
		console.log(data)
		createPDF(data)
	}
}

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

var pool = new PromisePool(promiseProducer, 5)

pool.start()
.then(function () {
	console.log('Complete')
})