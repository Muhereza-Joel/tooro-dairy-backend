const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require('path');
const authRoutes = require("./routes/auth");
const stockRoutes = require("./routes/stock");
const salesRoutes = require("./routes/sales");
const salesReportsRoutes = require('./routes/salesReports');
const subscriptionsRoutes = require('./routes/subscriptions');
const metricsRoutes = require('./routes/metrics');

const app = express();
const port = process.env.PORT || 3002;
// const host = "0.0.0.0";
const host = "localhost";


app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'dmis',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in a production environment with HTTPS
}));

app.use('/tdmis/api/v1/auth', authRoutes);
app.use('/tdmis/api/v1/stock', stockRoutes);
app.use('/tdmis/api/v1/sales', salesRoutes);
app.use('/tdmis/api/v1/sales/reports', salesReportsRoutes);
app.use('/tdmis/api/v1/sales/subscriptions', subscriptionsRoutes);
app.use('/tdmis/api/v1/metrics', metricsRoutes);

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
