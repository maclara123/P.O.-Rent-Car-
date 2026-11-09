-- -----------------------------------------------------
-- Script gerado a partir de trabalho_locação.mwb (MySQL Workbench)
-- Schema: mydb
-- -----------------------------------------------------

SET NAMES utf8mb4;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`estado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`estado` (
  `idestado` INT NOT NULL,
  `nome` CHAR(2) NOT NULL,
  PRIMARY KEY (`idestado`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`cidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`cidade` (
  `idcidade` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(45) NOT NULL,
  `estado_idestado` INT NOT NULL,
  PRIMARY KEY (`idcidade`, `estado_idestado`),
  UNIQUE INDEX `idcidade_UNIQUE` (`idcidade` ASC),
  UNIQUE INDEX `Nome_UNIQUE` (`Nome` ASC),
  INDEX `fk_cidade_estado1_idx` (`estado_idestado` ASC),
  CONSTRAINT `fk_cidade_estado1`
    FOREIGN KEY (`estado_idestado`)
    REFERENCES `mydb`.`estado` (`idestado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Pessoa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Pessoa` (
  `idPessoa` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(100) NULL,
  `CPF/CNPJ` CHAR(11) NOT NULL,
  `Telefone` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `CNH/Cat.` VARCHAR(45) NOT NULL,
  `RG/IE` VARCHAR(45) NULL,
  `Genero` VARCHAR(45) NULL,
  `cidade_idcidade` INT NOT NULL,
  `cidade_estado_idestado` INT NOT NULL,
  PRIMARY KEY (`idPessoa`, `cidade_idcidade`, `cidade_estado_idestado`),
  UNIQUE INDEX `CPF_UNIQUE` (`CPF/CNPJ` ASC),
  UNIQUE INDEX `idPessoa_UNIQUE` (`idPessoa` ASC),
  INDEX `fk_Pessoa_cidade1_idx` (`cidade_idcidade` ASC, `cidade_estado_idestado` ASC),
  CONSTRAINT `fk_Pessoa_cidade1`
    FOREIGN KEY (`cidade_idcidade`, `cidade_estado_idestado`)
    REFERENCES `mydb`.`cidade` (`idcidade`, `estado_idestado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Funcionario` (
  `idFuncionario` INT NOT NULL AUTO_INCREMENT,
  `Cargo` VARCHAR(50) NULL,
  `Carteira_trabalho` VARCHAR(45) NOT NULL,
  `Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idFuncionario`),
  INDEX `fk_Funcionario_Pessoa1_idx` (`Pessoa_idPessoa` ASC),
  CONSTRAINT `fk_Funcionario_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Cliente` (
  `idCliente` INT NOT NULL AUTO_INCREMENT,
  `Pessoa_idPessoa` INT NOT NULL,
  PRIMARY KEY (`idCliente`),
  INDEX `fk_Cliente_Pessoa1_idx` (`Pessoa_idPessoa` ASC),
  CONSTRAINT `fk_Cliente_Pessoa1`
    FOREIGN KEY (`Pessoa_idPessoa`)
    REFERENCES `mydb`.`Pessoa` (`idPessoa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Combustivel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Combustivel` (
  `idCombustivel` INT NOT NULL AUTO_INCREMENT,
  `Tipo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCombustivel`),
  UNIQUE INDEX `Tipo_UNIQUE` (`Tipo` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Veiculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Veiculo` (
  `idVeiculo` INT NOT NULL AUTO_INCREMENT,
  `Modelo` VARCHAR(100) NOT NULL,
  `Marca` VARCHAR(50) NOT NULL,
  `Ano` INT NOT NULL,
  `Placa` VARCHAR(10) NOT NULL,
  `KM` INT NOT NULL,
  `Cor` VARCHAR(45) NULL,
  `Combustivel` VARCHAR(45) NULL,
  `N_motor` VARCHAR(45) NULL,
  `Renavan` VARCHAR(45) NULL,
  `Opicionais` VARCHAR(45) NULL,
  `Combustivel_idCombustivel` INT NOT NULL,
  `Funcionario_idFuncionario` INT NOT NULL,
  `Cliente_idCliente` INT NOT NULL,
  PRIMARY KEY (`idVeiculo`, `Combustivel_idCombustivel`, `Funcionario_idFuncionario`, `Cliente_idCliente`),
  UNIQUE INDEX `Placa_UNIQUE` (`Placa` ASC),
  INDEX `fk_Veiculo_Combustivel1_idx` (`Combustivel_idCombustivel` ASC),
  CONSTRAINT `fk_Veiculo_Combustivel1`
    FOREIGN KEY (`Combustivel_idCombustivel`)
    REFERENCES `mydb`.`Combustivel` (`idCombustivel`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Locação/Checkin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Locação/Checkin` (
  `idLocação` INT NOT NULL,
  `Data` DATE NOT NULL,
  `KM_Saida` VARCHAR(45) NULL,
  `nivel_combustivel` VARCHAR(45) NULL,
  `Locação/Checkincol` VARCHAR(45) NULL,
  `Veiculo_idVeiculo` INT NOT NULL,
  `Funcionario_idFuncionario` INT NOT NULL,
  `Cliente_idCliente` INT NOT NULL,
  PRIMARY KEY (`idLocação`, `Veiculo_idVeiculo`, `Funcionario_idFuncionario`, `Cliente_idCliente`),
  UNIQUE INDEX `idLocação_UNIQUE` (`idLocação` ASC),
  INDEX `fk_Locação/Checkin_Veiculo_idx` (`Veiculo_idVeiculo` ASC),
  INDEX `fk_Locação/Checkin_Funcionario1_idx` (`Funcionario_idFuncionario` ASC),
  INDEX `fk_Locação/Checkin_Cliente1_idx` (`Cliente_idCliente` ASC),
  CONSTRAINT `fk_Locação/Checkin_Veiculo`
    FOREIGN KEY (`Veiculo_idVeiculo`)
    REFERENCES `mydb`.`Veiculo` (`idVeiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Locação/Checkin_Funcionario1`
    FOREIGN KEY (`Funcionario_idFuncionario`)
    REFERENCES `mydb`.`Funcionario` (`idFuncionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Locação/Checkin_Cliente1`
    FOREIGN KEY (`Cliente_idCliente`)
    REFERENCES `mydb`.`Cliente` (`idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Reserva`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Reserva` (
  `idReserva` INT NOT NULL AUTO_INCREMENT,
  `Data_Periodo` VARCHAR(45) NULL,
  `Veiculo_idVeiculo` INT NOT NULL,
  `Veiculo_Combustivel_idCombustivel` INT NOT NULL,
  `Veiculo_Funcionario_idFuncionario` INT NOT NULL,
  `Veiculo_Cliente_idCliente` INT NOT NULL,
  PRIMARY KEY (`idReserva`, `Veiculo_idVeiculo`, `Veiculo_Combustivel_idCombustivel`, `Veiculo_Funcionario_idFuncionario`, `Veiculo_Cliente_idCliente`),
  INDEX `fk_Reserva_Veiculo1_idx` (`Veiculo_idVeiculo` ASC, `Veiculo_Combustivel_idCombustivel` ASC, `Veiculo_Funcionario_idFuncionario` ASC, `Veiculo_Cliente_idCliente` ASC),
  CONSTRAINT `fk_Reserva_Veiculo1`
    FOREIGN KEY (`Veiculo_idVeiculo`, `Veiculo_Combustivel_idCombustivel`, `Veiculo_Funcionario_idFuncionario`, `Veiculo_Cliente_idCliente`)
    REFERENCES `mydb`.`Veiculo` (`idVeiculo`, `Combustivel_idCombustivel`, `Funcionario_idFuncionario`, `Cliente_idCliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Devoluçao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Devoluçao` (
  `idDevoluçao` INT NOT NULL AUTO_INCREMENT,
  `Km_retorno` VARCHAR(45) NULL,
  `Nivel_combustivel` VARCHAR(45) NULL,
  `Devoluçaocol` DATE NULL,
  PRIMARY KEY (`idDevoluçao`),
  UNIQUE INDEX `idDevoluçao_UNIQUE` (`idDevoluçao` ASC)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Fotos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Fotos` (
  `idFotos` INT NOT NULL AUTO_INCREMENT,
  `Locação/Checkin_idLocação` INT NOT NULL,
  `Locação/Checkin_Veiculo_idVeiculo` INT NOT NULL,
  `Devoluçao_idDevoluçao` INT NOT NULL,
  PRIMARY KEY (`idFotos`, `Locação/Checkin_idLocação`, `Locação/Checkin_Veiculo_idVeiculo`, `Devoluçao_idDevoluçao`),
  UNIQUE INDEX `idFotos_UNIQUE` (`idFotos` ASC),
  INDEX `fk_Fotos_Locação/Checkin1_idx` (`Locação/Checkin_idLocação` ASC, `Locação/Checkin_Veiculo_idVeiculo` ASC),
  INDEX `fk_Fotos_Devoluçao1_idx` (`Devoluçao_idDevoluçao` ASC),
  CONSTRAINT `fk_Fotos_Locação/Checkin1`
    FOREIGN KEY (`Locação/Checkin_idLocação`, `Locação/Checkin_Veiculo_idVeiculo`)
    REFERENCES `mydb`.`Locação/Checkin` (`idLocação`, `Veiculo_idVeiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Fotos_Devoluçao1`
    FOREIGN KEY (`Devoluçao_idDevoluçao`)
    REFERENCES `mydb`.`Devoluçao` (`idDevoluçao`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Forma_de_Pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Forma_de_Pagamento` (
  `idForma_de_Pagamento` INT NOT NULL AUTO_INCREMENT,
  `Tipo` VARCHAR(45) NOT NULL,
  `Locação/Checkin_idLocação` INT NOT NULL,
  `Locação/Checkin_Veiculo_idVeiculo` INT NOT NULL,
  PRIMARY KEY (`idForma_de_Pagamento`, `Locação/Checkin_idLocação`, `Locação/Checkin_Veiculo_idVeiculo`),
  UNIQUE INDEX `idForma_de_Pagamento_UNIQUE` (`idForma_de_Pagamento` ASC),
  UNIQUE INDEX `Tipo_UNIQUE` (`Tipo` ASC),
  INDEX `fk_Forma_de_Pagamento_Locação/Checkin1_idx` (`Locação/Checkin_idLocação` ASC, `Locação/Checkin_Veiculo_idVeiculo` ASC),
  CONSTRAINT `fk_Forma_de_Pagamento_Locação/Checkin1`
    FOREIGN KEY (`Locação/Checkin_idLocação`, `Locação/Checkin_Veiculo_idVeiculo`)
    REFERENCES `mydb`.`Locação/Checkin` (`idLocação`, `Veiculo_idVeiculo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
