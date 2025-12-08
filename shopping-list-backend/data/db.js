const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "mockDb.json");

function loadDb() {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}

function saveDb(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

module.exports = {
    loadDb,
    saveDb
};
