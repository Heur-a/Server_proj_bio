-- Updates a user based on email.
UPDATE Users
SET name = ?, lastName1 = ?, lastName2 = ?, tel = ?, password = ?
WHERE mail = ?;
