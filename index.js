const express = require("express");
const scrape = require("./scrape");
const app = express();
const db = require("./src/db/db");
const databaseData = require("./src/databaseData");
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
        let tasa = await scrape("https://bcv.org.ve");
        tasa = parseFloat(tasa.trim().replace(",", ".")).toFixed(2);
        res.json({ tasa: tasa });
    } catch (e) {
        const moneda = await databaseData.getMonedas(db);
        const bolivar = moneda.filter((item) => item.simbolo.toLowerCase() === 'bs');
        res.json({ tasa: bolivar.factor, error: "No se obtuvo la tasa del bcv"});
        res.end();
    } finally {
        res.end();
    }
});


app.listen(8000);