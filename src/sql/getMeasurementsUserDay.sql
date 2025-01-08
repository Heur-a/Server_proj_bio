SELECT
    m.*
FROM
    `OZONE_DB`.`Measurements` m
        JOIN
    `OZONE_DB`.`Nodes` n
    ON
        m.`nodes_idnodes` = n.`idnodes`
WHERE
    n.`Users_idUsers` = ?
  AND DATE(m.`date`) = ?;
