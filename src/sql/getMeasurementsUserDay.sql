SELECT
    m.value,
    m.LocX,
    m.Locy,
    m.gasType_idgasType AS gasId

FROM
    `OZONE_DB`.`Measurements` m
        JOIN
    `OZONE_DB`.`Nodes` n
    ON
        m.`nodes_idnodes` = n.`idnodes`
WHERE
    n.`Users_idUsers` = ?
  AND DATE(m.`date`) = ?;
