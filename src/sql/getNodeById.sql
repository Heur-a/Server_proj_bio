SELECT Nodes.uuid FROM Nodes
    INNER JOIN OZONE_DB.Users U on Nodes.Users_idUsers = U.idUsers
                  WHERE idUsers = ?