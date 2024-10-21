-- MySQL Script generated by MySQL Workbench
-- Mon Oct 21 20:28:35 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema OZONE_DB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema OZONE_DB
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS `OZONE_DB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin ;
SHOW WARNINGS;
USE `OZONE_DB` ;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`GasTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`GasTypes` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`GasTypes` (
  `idgasType` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `gasName` VARCHAR(45) NOT NULL DEFAULT 'GAS',
  PRIMARY KEY (`idgasType`),
  UNIQUE INDEX `gasName_UNIQUE` (`gasName` ASC) VISIBLE,
  UNIQUE INDEX `idgasType_UNIQUE` (`idgasType` ASC) VISIBLE)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`UserTypes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`UserTypes` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`UserTypes` (
  `idUserType` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userTypeName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idUserType`),
  UNIQUE INDEX `UserTypecol_UNIQUE` (`userTypeName` ASC) VISIBLE,
  UNIQUE INDEX `idUserType_UNIQUE` (`idUserType` ASC) VISIBLE)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`Users` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`Users` (
  `idUsers` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `name` VARCHAR(40) NULL,
  `lastName1` VARCHAR(40) NULL,
  `lastName2` VARCHAR(40) NULL,
  `tel` VARCHAR(12) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `UserTypes_idUserType` INT UNSIGNED NOT NULL,
  `mail` VARCHAR(70) NULL,
  PRIMARY KEY (`idUsers`, `UserTypes_idUserType`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `idUsers_UNIQUE` (`idUsers` ASC) VISIBLE,
  INDEX `fk_Users_UserTypes1_idx` (`UserTypes_idUserType` ASC) VISIBLE,
  UNIQUE INDEX `mail_UNIQUE` (`mail` ASC) VISIBLE,
  CONSTRAINT `fk_Users_UserTypes1`
    FOREIGN KEY (`UserTypes_idUserType`)
    REFERENCES `OZONE_DB`.`UserTypes` (`idUserType`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`Nodes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`Nodes` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`Nodes` (
  `idnodes` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(45) NOT NULL,
  `Users_idUsers` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idnodes`, `Users_idUsers`),
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  UNIQUE INDEX `idnodes_UNIQUE` (`idnodes` ASC) VISIBLE,
  INDEX `fk_Nodes_Users1_idx` (`Users_idUsers` ASC) VISIBLE,
  CONSTRAINT `fk_Nodes_Users1`
    FOREIGN KEY (`Users_idUsers`)
    REFERENCES `OZONE_DB`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`Measurements`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`Measurements` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`Measurements` (
  `idMeasurements` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `value` FLOAT ZEROFILL NOT NULL,
  `LocX` FLOAT ZEROFILL NULL,
  `LocY` FLOAT ZEROFILL NULL,
  `date` DATETIME NOT NULL,
  `nodes_idnodes` INT UNSIGNED NOT NULL,
  `gasType_idgasType` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idMeasurements`, `nodes_idnodes`, `gasType_idgasType`),
  INDEX `fk_Measurements_gasType_idx` (`gasType_idgasType` ASC) VISIBLE,
  INDEX `fk_Measurements_nodes1_idx` (`nodes_idnodes` ASC) VISIBLE,
  UNIQUE INDEX `idMeasurements_UNIQUE` (`idMeasurements` ASC) VISIBLE,
  CONSTRAINT `fk_Measurements_gasType`
    FOREIGN KEY (`gasType_idgasType`)
    REFERENCES `OZONE_DB`.`GasTypes` (`idgasType`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Measurements_nodes1`
    FOREIGN KEY (`nodes_idnodes`)
    REFERENCES `OZONE_DB`.`Nodes` (`idnodes`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `OZONE_DB`.`DailyDistance`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `OZONE_DB`.`DailyDistance` ;

SHOW WARNINGS;
CREATE TABLE IF NOT EXISTS `OZONE_DB`.`DailyDistance` (
  `idDailyDistance` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `distance` FLOAT ZEROFILL NULL,
  `day` DATE NOT NULL,
  `Users_idUsers` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idDailyDistance`, `Users_idUsers`),
  INDEX `fk_DailyDistance_Users1_idx` (`Users_idUsers` ASC) VISIBLE,
  CONSTRAINT `fk_DailyDistance_Users1`
    FOREIGN KEY (`Users_idUsers`)
    REFERENCES `OZONE_DB`.`Users` (`idUsers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SHOW WARNINGS;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `OZONE_DB`.`GasTypes`
-- -----------------------------------------------------
START TRANSACTION;
USE `OZONE_DB`;
INSERT INTO `OZONE_DB`.`GasTypes` (`idgasType`, `gasName`) VALUES (1, 'ozone');
INSERT INTO `OZONE_DB`.`GasTypes` (`idgasType`, `gasName`) VALUES (2, 'CO2');

COMMIT;


-- -----------------------------------------------------
-- Data for table `OZONE_DB`.`UserTypes`
-- -----------------------------------------------------
START TRANSACTION;
USE `OZONE_DB`;
INSERT INTO `OZONE_DB`.`UserTypes` (`idUserType`, `userTypeName`) VALUES (1, 'admin');
INSERT INTO `OZONE_DB`.`UserTypes` (`idUserType`, `userTypeName`) VALUES (2, 'user');

COMMIT;

