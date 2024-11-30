# noinspection SqlInsertValuesForFile

/*
 * @Author: Alex Escrivà Caravaca 
 * @Date: 2024-10-06 16:59:56 
 * @Last Modified by:   Alex Escrivà Caravaca 
 * @Last Modified time: 2024-10-06 16:59:56 
 */

-- -----------------------------------------------------
-- SQL file to insert a measurement
-- -----------------------------------------------------


INSERT INTO Measurements (value, LocX, LocY, date, nodes_idnodes, gasType_idgasType) VALUES   (?,?,?,NOW(),?,?)