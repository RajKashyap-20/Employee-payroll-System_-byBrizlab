const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

(async () => {
    const employees = await fileHandler.read();
    console.log("Employee Data:", employees);
})();

app.get("/", async (req, res) => {
    const employees = await fileHandler.read();
    res.render("index", { employees });
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/add", async (req, res) => {

    const { name, department, salary } = req.body;
    const numericSalary = Number(salary);

    if (!name || name.trim() === "" || numericSalary < 0) {
        return res.redirect("/");
    }

    const employees = await fileHandler.read();

    const newEmployee = {
        id: Date.now(),
        name: name,
        department: department,
        salary: numericSalary
    };

    employees.push(newEmployee);

    await fileHandler.write(employees);

    res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {

    const employees = await fileHandler.read();
    const employee = employees.find(emp => emp.id == req.params.id);

    if (!employee) {
        return res.redirect("/");
    }

    res.render("edit", { employee });

});

app.post("/edit/:id", async (req, res) => {

    const { name, department, salary } = req.body;
    const numericSalary = Number(salary);

    if (!name || name.trim() === "" || numericSalary < 0) {
        return res.redirect("/");
    }

    const employees = await fileHandler.read();

    const index = employees.findIndex(emp => emp.id == req.params.id);

    if (index !== -1) {

        employees[index] = {
            id: employees[index].id,
            name: name.trim(),
            department: department.trim(),
            salary: numericSalary
        };

        await fileHandler.write(employees);
    }

    res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {

    let employees = await fileHandler.read();

    employees = employees.filter(emp => emp.id != req.params.id);

    await fileHandler.write(employees);

    res.redirect("/");
});

app.get("/search", async (req, res) => {

    const id = Number(req.query.id)

    const employees = await fileHandler.read()

    if(!id){
        return res.redirect("/")
    }

    const found = employees.filter(emp => emp.id === id)

    res.render("index", { employees: found })

})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
