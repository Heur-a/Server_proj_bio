-- Retrieves a user by email.
SELECT u.idUsers, u.name, u.lastName1, u.lastName2, u.tel, u.mail, ut.userTypeName
FROM Users u
JOIN UserTypes ut ON u.UserTypes_idUserType = ut.idUserType
WHERE u.mail = ?;
