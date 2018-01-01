/*********************************************************************************
 * WEB322 – Assignment 07
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part of this
 * assignment has been copied manually or electronically from any other source (including web sites) or
 * distributed to other students.
 *
 * Name: Lewis Kim Student ID: 115935157 Date: Dec 31, 2017
 *
 * Online (Heroku) Link: ________________________________________________________
 *
 ********************************************************************************/

const dataServiceComments = require("./data-service-comments.js");
var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service.js");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
var clientSessions = require("client-sessions");
var dataServiceAuth = require("./data-service-auth");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clientSessions({
    cookieName: "session",
    secret: "web322_A7",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

var HTTP_PORT = process.env.PORT || 8080;

function onHTTPStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/about", function(req, res) {
    dataServiceComments.getAllComments().then(function(dataFromPromise) {
        res.render("about", { data: dataFromPromise });
    }).catch(() => {
        res.render("about");
    });
});

app.get("/employees", ensureLogin, function(req, res) {
    if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then(function(info) {
            res.render("employeeList", { data: info, title: "Employees" });
        }).catch(function(err) {
            console.log(err);
        })
    } else if (req.query.status) {
        data.getEmployeesByStatus(req.query.status).then(function(info) {
            res.render("employeeList", { data: info, title: "Employees" });
        }).catch(function(err) {
            console.log(err);
        })
    } else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then(function(info) {
            res.render("employeeList", { data: info, title: "Employees" });
        }).catch(function(err) {
            console.log(err);
        })
    } else {
        data.getAllEmployees().then(function(info) {
            res.render("employeeList", { data: info, title: "Employees" });
        }).catch(function(err) {
            console.log(err);
        })
    }
});


app.get("/employee/:empNum", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum)
        .then((data) => {
            viewData.data = data; //store employee data in the "viewData" object as "data"
        }).catch(() => {
            viewData.data = null; // set employee to null if there was an error
        }).then(data.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"

            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.data.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.data == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.post("/employee/update", ensureLogin, (req, res) => {
    data.updateEmployee(req.body).then(function(info) {
        res.redirect("/employees");
    })
});

app.get('/managers', ensureLogin, function(req, res) {
    data.getManagers().then(function(info) {
        res.render("employeeList", { data: info, title: "Employees(Managers)" });
    }).catch(function(err) {
        res.render("employeeList", { data: {}, title: "Employees (Managers)" });
    })
});

app.get('/departments', ensureLogin, function(req, res) {
    data.getDepartments().then(function(info) {
        res.render("departmentList", { data: info, title: "Departments" });
    }).catch(function(err) {
        res.render("departmentList", { data: {}, title: "Departments" });
    })
});
app.get('/employees/add', ensureLogin, function(req, res) {
    data.getDepartments().then(function(data) {
        res.render("addEmployee", { departments: data });
    }).catch(function() {
        res.render("addEmployee", { departments: [] });
    })
});
app.post('/employees/add', ensureLogin, function(req, res) {
    data.addEmployee(req.body).then(function(info) {
        res.redirect("/employees");
    })
})
app.get('/departments/add', ensureLogin, function(req, res) {
    res.render("addDepartment");
});

app.post('/departments/add', ensureLogin, function(req, res) {
    data.addDepartment(req.body).then(function(info) {
        res.redirect("/departments");
    })
});

app.post('/department/update', ensureLogin, function(req, res) {
    data.updateDepartment(req.body).then(function(info) {
        res.redirect("/departments");
    })
});

app.get('/department/:departmentId', ensureLogin, function(req, res) {
    data.getDepartmentById(req.params.departmentId).then(function(info) {
        res.render("department", { data: info });
    }).catch(function() {
        res.status(404).send("Department not found.");
    })
});

app.get('/employee/delete/:empNum', ensureLogin, function(req, res) {
    data.deleteEmployeeByNum(req.params.empNum).then(function() {
        res.redirect('/employees');
    }).catch(function() {
        res.status(500).send("Unable to Remove Employee / Employee Not Found");
    })
});

app.post("/about/addComment", (req, res) => {
    dataServiceComments.addComment(req.body).then(function() {
        res.redirect("/about");
    }).catch(function(err) {
        console.log(err);
        res.redirect("/about");
    });
});

app.post("/about/addReply", (req, res) => {
    dataServiceComments.addReply(req.body).then(() => {
        res.redirect("/about");
    }).catch((err) => {
        console.log(err);
        res.redirect("/about");
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body).then(() => {
        res.render("register", { successMessage: "User created" });
    }).catch((err) => {
        res.render("register", { errorMessage: err, user: req.body.user });
    });
});

app.post("/login", (req, res) => {
    dataServiceAuth.checkUser(req.body).then(() => {
        req.session.user = {
            username: req.body.user
        };
        res.redirect("/employees");
    }).catch((err) => {
        res.render("login", { errorMessage: err, user: req.body.user });
    });
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.use(express.static('public'));

app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: 'layout',
    helpers: {
        equal: function(lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set("view engine", ".hbs");

app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found</h1>");
});


data.intialize().then(dataServiceComments.initialize)
    .then(dataServiceAuth.initialize)
    .then(function() { app.listen(HTTP_PORT, onHTTPStart) }).catch(function() {
        console.log("Could not listen to port.");
    });