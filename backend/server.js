const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");

const PORT = process.env.PORT;
const departmentRoutes = require("./routes/department.routes");
const ordonnanceRoutes = require("./routes/ordonnance.routes");
const statsRoutes = require("./routes/stats.routes");

const DB = require("./DB/conn");
const sendEmail = require("./utils/resetPassword");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

DB();

// reset password
app.post("/send_recovery_email", (req, res) => {
  sendEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

app.use("/contact", require("./routes/contact.routes"));
app.use("/admin", require("./routes/admin.routes"));
app.use("/patient", require("./routes/patient.routes"));
app.use("/medecin", require("./routes/medecin.routes"));
app.use("/rendezvous", require("./routes/rdv.routes"));
app.use("/factures", require("./routes/facture.routes"));
app.use("/ordonnances", ordonnanceRoutes);
app.use("/departments", departmentRoutes);
app.use("/stats", statsRoutes);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
