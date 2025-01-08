SELECT
    U.mail AS user_email,
    N.uuid,
    CONCAT(DATE_FORMAT(MAX(M.date), '%d/%m/%Y'), CHAR(10), DATE_FORMAT(MAX(M.date), '%H:%i:%s')) AS last_measurement_date,
    (SELECT M1.value
     FROM OZONE_DB.Measurements M1
     WHERE M1.nodes_idnodes = N.idnodes
       AND M1.date = MAX(M.date)
     LIMIT 1) AS measurement_value,
    CASE
        WHEN MAX(M.date) < CURRENT_DATE - INTERVAL 1 DAY THEN 'Inactivo'
        ELSE 'Activo'
        END AS status
FROM Nodes N
         LEFT JOIN OZONE_DB.Measurements M
                   ON N.idnodes = M.nodes_idnodes
         LEFT JOIN Users U
                   ON N.Users_idUsers = U.idUsers
WHERE M.date IS NOT NULL
GROUP BY N.idnodes, N.uuid, N.Users_idUsers, U.mail
ORDER BY N.idnodes;
