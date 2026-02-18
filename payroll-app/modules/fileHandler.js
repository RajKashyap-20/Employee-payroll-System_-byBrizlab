const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

async function read() {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data || "[]");
    } catch (err) {
        return [];
    }
}

async function write(data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Write error:", err);
    }
}

module.exports = { read, write };
