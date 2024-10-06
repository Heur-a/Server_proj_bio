/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:58:22 
 * @Last Modified by:   Alex Escrivà Caravaca 
 * @Last Modified time: 2024-10-06 16:58:22 
 */



-- This is an optional script to grant access to the server user to the server database
-- This script is executed by the server container when the server database is created
-- If you want to use this script, you must change the user name on this Script

GRANT SELECT, INSERT, UPDATE ON *.* TO 'server'@'%';

-- Actualitzar els privilegis per assegurar-se que tenen efecte immediatament
FLUSH PRIVILEGES;

