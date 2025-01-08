SELECT N.idnodes as id, N.uuid,N.Users_idUsers as UserId, MAX(M.date) AS last_measurement_date
FROM Nodes N
         LEFT JOIN OZONE_DB.Measurements M
                   ON N.idnodes = M.nodes_idnodes
GROUP BY N.idnodes
ORDER BY N.idnodes;

;

