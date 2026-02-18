const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const employees = fileHandler.readData();
    res.render("index", { employees });
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", (req, res) => {
    const { name, department, salary } = req.body;
    const numericSalary = Number(salary);

    if (!name || name.trim() === "" || numericSalary < 0) {
        return res.redirect("/");
    }

    const employees = fileHandler.readData();

    const newEmployee = {
        id: Date.now(),
        name: name.trim(),
        department: department.trim(),
        salary: numericSalary
    };

    employees.push(newEmployee);
    fileHandler.writeData(employees);

    res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
    const employees = fileHandler.readData();
    const employee = employees.find(emp => emp.id == req.params.id);

    if (!employee) {
        return res.redirect("/");
    }

    res.render("edit", { employee });
});

app.post("/edit/:id", (req, res) => {
    const { name, department, salary } = req.body;
    const numericSalary = Number(salary);

    if (!name || name.trim() === "" || numericSalary < 0) {
        return res.redirect("/");
    }

    const employees = fileHandler.readData();
    const index = employees.findIndex(emp => emp.id == req.params.id);

    if (index !== -1) {
        employees[index] = {
            id: employees[index].id,
            name: name.trim(),
            department: department.trim(),
            salary: numericSalary
        };

        fileHandler.writeData(employees);
    }

    res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
    let employees = fileHandler.readData();
    employees = employees.filter(emp => emp.id != req.params.id);
    fileHandler.writeData(employees);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
