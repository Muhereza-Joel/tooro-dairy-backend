const express = require("express");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3002;
// const host = "0.0.0.0";
const host = "localhost";

app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'dmis',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in a production environment with HTTPS
}));

app.use('/tdmis/api/v1/auth', authRoutes);

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
