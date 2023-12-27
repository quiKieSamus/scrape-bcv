const express = require("express");
const scrape = require("./scrape");
const app = express();
/**Cross Origin Resource Sharing
 * An http header that tells the server
 * which locations besides from the server can use
 * or implement their resources
 */
const cors = require("cors");
console.clear();
app.use(cors({
    origin: "*"
}));

app.get("/tasa", async (req, res) => {
    try {
        let tasa = await scrape(`C:\\Users\\RUBEN\\chromium\\win64-1241081\\chrome-win\\chrome.exe`,
            "https://bcv.org.ve/",
            `/html/body/div[4]/div/div[2]/div/div[1]/div[1]/section[1]/div/div[2]/div/div[7]/div/div/div[2]/strong`);
        tasa = parseFloat(tasa.trim().replace(",", ".")).toFixed(2);
        res.json({ tasa: tasa });
    } catch (e) {
        res.end();
    }
});


app.listen(8000);