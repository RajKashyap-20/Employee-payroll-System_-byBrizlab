const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

function readData() {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    readData,
    writeData
};
