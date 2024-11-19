SELECT COUNT(*) AS email_exists
FROM `Users`
WHERE `mail` = ?;