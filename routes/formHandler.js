const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
router.post('/submit', async (req, res) => {
    const { urls, fields } = req.body
    const data = await scrapeData(urls, fields)
    res.json(data);
});

async function scrapeData(urls, fields) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const scrapedData = [];

    for (let id = 0; id < urls.length; id++) {
        try {
            const data = {};
            await page.goto(urls[id], {
                waitUntil: 'networkidle2',
                timeout: 60000
            });
            for (let i = 0; i < fields.length; i++) {
                data[fields[i].key] =  await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.innerText : null;
                }, fields[i].selector);
            }
            scrapedData.push(data)

        } catch (error) {
            console.error(`Error fetching data for ID ${id}:`, error);
        }
    }
    await browser.close();

    return scrapedData
}

module.exports = router;
