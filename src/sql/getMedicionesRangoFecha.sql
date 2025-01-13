SELECT * from Measurements
WHERE DATE(date) BETWEEN ? AND ?
ORDER BY date;