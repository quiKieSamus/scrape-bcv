class databaseData {
    static async getMonedas(dbCon) {
        const query = "SELECT * FROM moneda";
        return new Promise(async (resolve, reject) => {
            dbCon.query(query, (err, res, fields) => {
                if (err) throw err;
                resolve(res);
            });
        });
    }

    static async updateMonedaFactor (simbolo, factor, dbCon) {
        const query = `UPDATE moneda SET factor=${factor} WHERE simbolo='${simbolo}'`;
        return new Promise(async (resolve, reject) => {
            await dbCon.query(query, (err, res, fields) => {
                if (err) {
                    reject(false);
                    throw err;
                }
                resolve(true);
            });
        });
    }
}

module.exports = databaseData;