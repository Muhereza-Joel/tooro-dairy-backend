const pool = require("../databaseConnection");
const moment = require("moment");

const getUsersCount = (callback) => {
  pool.query("SELECT COUNT(*) AS userCount FROM users", (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      const usersCount = result[0].userCount;
      callback(null, { count: usersCount });
    }
  });
};

const getActiveSubscriptions = (callback) => {
  pool.query(
    "SELECT COUNT(*) AS activeSubscriptions FROM subscriptions",
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        const activeAccounts = result[0].activeSubscriptions;
        callback(null, { count: activeAccounts });
      }
    }
  );
};

const getBalancesTotal = (callback) => {
  pool.query(
    "SELECT SUM(balance) AS totalBalance FROM stock",
    (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        const sumOfAllBalances = result[0].totalBalance;
        callback(null, { sumOfBalances: sumOfAllBalances });
      }
    }
  );
};

const getTotalSalesForToday = (callback) => {
  const dateToday = moment().format("YYYY-MM-DD");

  pool.query(
    "SELECT SUM(total) AS totalSales FROM sales WHERE DATE(created_at) = ?",
    [dateToday],
    (error, result) => {
        if(error){
            callback(error, null);
        } else {
            const salesTotal = result[0].totalSales || 0;
            callback(null, {salesToday: salesTotal})
        }
    }
  );
};

const getTotalSalesForThisWeek = (callback) => {
    const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');

    pool.query(
        'SELECT SUM(total) AS totalSales FROM sales WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?',
        [startOfWeek, endOfWeek],
        (error, results) => {
          if (error) {
            console.error('Error getting total sales this week:', error);
            callback(error, null);
          } else {
            const totalSales = results[0].totalSales || 0; // Default to 0 if no sales are made this week
            callback(null, {salesThisWeek : totalSales});
          }
        }
      );
}

const getTotalSalesForThisMonth = (callback) => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    pool.query(
        'SELECT SUM(total) AS totalSales FROM sales WHERE DATE(created_at) >= ? AND DATE(created_at) <= ?',
        [startOfMonth, endOfMonth],
        (error, results) => {
          if (error) {
            console.error('Error getting total sales this month:', error);
            callback(error, null);
          } else {
            const totalSales = results[0].totalSales || 0; // Default to 0 if no sales are made this month
            callback(null, { salesThisMonth :totalSales });
          }
        }
      );

}

module.exports = {
  getUsersCount,
  getActiveSubscriptions,
  getBalancesTotal,
  getTotalSalesForToday,
  getTotalSalesForThisWeek,
  getTotalSalesForThisMonth
};
