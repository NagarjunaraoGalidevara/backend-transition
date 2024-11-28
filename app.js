const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const axios = require("axios");

const checklistRules = require("./rules");

const path = require("path");
const dbPath = path.join(__dirname, "checklist.db");

let db;

const app = express();
app.use(express.json());
app.use(cors());


const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server running on port 3000.");
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();


const API_URL =
  "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";


  
const evaluateRules = (data) =>
  checklistRules.map((rule) => ({
    name: rule.name,
    status: rule.condition(data) ? "Passed" : "Failed",
  }));


app.get("/checklist", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const results = evaluateRules(data);

    res.json({ success: true, results });
  } catch (error) {
    console.error("Error fetching API data:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
});



// const API_URL =
//     "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";

// // Helper function to evaluate a rule

// const evaluateRule = (rule, data) => {
//     const condition = new Function("data", `return ${rule.condition}`);
//     return condition(data);
// };

// // get checklist using GET HTTP request method

// app.get("/checklist", async (req, res) => {
//     try {
//         const response = await axios.get(API_URL);
//         const data = response.data;

//         const rulesQuery = `SELECT * FROM checklist`;
//         const rules = await db.all(rulesQuery);

//         const results = rules.map((rule) => ({
//             ruleName: rule.rule_name,
//             status: evaluateRule(rule, data) ? "Passed" : "Failed",
//         }));

//         res.send(results);
//     } catch (error) {
//         console.log("Error:", error.message);
//         res.status(500).send("Error fetching checklist data.");
//     }
// });


// // Add new rule in checklist using POST HTTP request method

// app.post("/checklist", async (req, res) => {
//     const { ruleName, field, condition } = req.body;
//     const addRuleQuery = `
//     INSERT INTO checklist (rule_name, field, condition)
//     VALUES ('${ruleName}', '${field}', '${condition}');`;
//     await db.run(addRuleQuery);
//     res.send("Rule added successfully.");
// });

// // Update an existing rule using PUT HTTP request method

// app.put("/checklist/:id", async (req, res) => {
//     const { id } = req.params;
//     const { ruleName, field, condition } = req.body;
//     const updateRuleQuery = `
//     UPDATE checklist
//     SET rule_name = '${ruleName}', field = '${field}', condition = '${condition}'
//     WHERE id = ${id};
//   `;
//     await db.run(updateRuleQuery);
//     res.send("Rule updated successfully.");
// });

// // get specific rule using GET HTTP request method

// app.get("/checklist/:id", async (req, res) => {
//     const { id } = req.params;
//     const getOneRule = `SELECT * FROM checklist WHERE id = ${id};`;
//     const getChecklist = await db.get(getOneRule);
//     res.send(getChecklist)
// })

// // Delete a rule using DELETE HTTP request method

// app.delete("/checklist/:id", async (req, res) => {
//     const { id } = req.params;
//     const deleteRuleQuery = `DELETE FROM checklist WHERE id = ${id};`;
//     await db.run(deleteRuleQuery);

//     res.send("Rule deleted successfully.");
// });