SELECT
    U.mail AS user_email,
    N.uuid,
    MAX(M.date) AS last_measurement_date
FROM Nodes N
         LEFT JOIN OZONE_DB.Measurements M
                   ON N.idnodes = M.nodes_idnodes
         LEFT JOIN Users U
                   ON N.Users_idUsers = U.idUsers
GROUP BY N.idnodes, N.uuid, N.Users_idUsers, U.mail, N.idnodes, N.uuid, N.Users_idUsers
ORDER BY N.idnodes;


;

