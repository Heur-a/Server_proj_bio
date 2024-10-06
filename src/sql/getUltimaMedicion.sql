/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:59:38 
 * @Last Modified by:   Alex Escrivà Caravaca 
 * @Last Modified time: 2024-10-06 16:59:38 
 */

-- -----------------------------------------------------
-- SQL file to get the last measurement
-- -----------------------------------------------------

SELECT * FROM Mediciones ORDER BY hora DESC LIMIT 1;
