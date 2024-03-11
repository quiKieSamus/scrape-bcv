const express = require("express");
const scrape = require("./scrape");
const fs = require('fs');
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

// path to cache file
const CACHEDFILEPATH = __dirname + "/tasa.txt";
// control variable that'll change according to when the cache file is updated
// resets to false when its a new day
let isCacheFileUpdated = false;

// function to check time, everytime bcv updates the ammount, it does it on 4pm
function isIt4pmorLater() {
    const date = new Date();
    const hour = date.getHours();
    return hour <= 16;
}

async function makeCacheFile(filePath = CACHEDFILEPATH, content) {
    return new Promise((resolved, reject) => {
        fs.lstat(__dirname, (err, stat) => {
            if (err) throw err;
            if (stat.isFile(filePath)) {
                fs.writeFileSync(filePath, content);
                return resolved(true);
            }
            fs.writeFileSync(filePath, content);
            return resolved(true);
        });
    });

}

const getCacheFile = (filePath = CACHEDFILEPATH) => fs.readFileSync(filePath, { encoding: "utf-8" });

const changeIsUpdatedStatus = (status) => isCacheFileUpdated = status;

const chromiumDir = "/usr/bin/chromium"

app.get("/tasa", async (req, res) => {
    try {
        if (!isIt4pmorLater()) {
            // response with cache file
            // means it's 3:59pm or less
            if (isCacheFileUpdated) changeIsUpdatedStatus(false);
            const file = getCacheFile();
            return res.json({ tasa: file });
        }
        // it's more than 4pm, we either response with cache file (if it has already been scraped) or have to scrape bcv
        // check if file has been updated
        if (!isCacheFileUpdated) {
            // file has not been updated, we scrape and then update
            let tasa = await scrape(chromiumDir,
                "https://bcv.org.ve/",
                `/html/body/div[4]/div/div[2]/div/div[1]/div[1]/section[1]/div/div[2]/div/div[7]/div/div/div[2]/strong`);
            tasa = parseFloat(tasa.trim().replace(",", ".")).toFixed(2);
            if (await makeCacheFile(CACHEDFILEPATH, tasa)) changeIsUpdatedStatus(true);
            return res.json({ tasa: tasa });
        }
        // file has already been updated, so we response with it
        const file = getCacheFile();
        res.json({ tasa: file });
    } catch (e) {
        res.end();
    }
});


app.get("*", (req, res) => res.redirect("/tasa"));

app.listen(8000, "localhost", () => console.log("Server on port 8000"));