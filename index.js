npm install puppeteer
const puppeteer = require('puppeteer');

async function getFlightPrices(source, destination, date) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://www.makemytrip.com/flight/search?srcCity=${source}&destCity=${destination}&deptDate=${date}`;

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  
  await page.waitForSelector('.fli-list');

  const flightPrices = await page.evaluate(() => {
    const airlines = Array.from(document.querySelectorAll('.fli-intl-lhs .fli-list'));
    const prices = {};

    airlines.forEach((airline) => {
      const name = airline.querySelector('.airline-info .airways-name span').textContent;
      const price = airline.querySelector('.fli-list-body-section .price-section .actual-price').textContent;
      prices[name.toLowerCase()] = price;
    });

    return prices;
  });

  await browser.close();

  return flightPrices;
}


const source = "Delhi";
const destination = "Jaipur";
const date = "15 April 2023";

getFlightPrices(source, destination, date)
  .then((flightPrices) => {
    console.log(flightPrices);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
