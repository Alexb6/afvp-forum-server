-- -----------------------------------------------------
-- Schema afvp_site
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `afvp_site`;

CREATE SCHEMA IF NOT EXISTS `afvp_site` DEFAULT CHARACTER SET utf8;

USE `afvp_site`;

-- -----------------------------------------------------
-- Table `afvp_site`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`role`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`subscription`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`subscription`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`subscription` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`member`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`member` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `gender` ENUM('Mr', 'Mrs') NOT NULL,
  `family_name` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `fullname_slug` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `pass_confirm` VARCHAR(255) NOT NULL,
  `pass_changed_dt` DATETIME NULL DEFAULT NULL,
  `pass_reset_token` VARCHAR(255) NULL DEFAULT NULL,
  `pass_reset_expired_dt` DATETIME NULL DEFAULT NULL,
  `photo` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(150) NULL DEFAULT NULL,
  `speciality` VARCHAR(255) NULL DEFAULT NULL,
  `hobby` MEDIUMTEXT NULL DEFAULT NULL,
  `created_dt` DATE NULL DEFAULT NULL COMMENT 'Date of the request to join the association',
  `subscription_dt` DATE NULL DEFAULT NULL COMMENT 'Membership payment date',
  `active_limit_dt` DATE NULL DEFAULT NULL COMMENT 'Membership active limit date',
  `donor` TINYINT NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL,
  `subscription_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`category`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`category` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `member_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`post`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`post` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `updatetime` DATETIME NOT NULL,
  `body` LONGTEXT NOT NULL,
  `category_id` INT(11) NOT NULL,
  `member_id` INT(11) NOT NULL,
  `parent_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`donor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `afvp_site`.`donor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gender` ENUM('Mr', 'Mrs') NOT NULL,
  `family_name` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `fullname_slug` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `pass_confirm` VARCHAR(255) NOT NULL,
  `pass_reset_token` VARCHAR(255) NOT NULL,
  `pass_reset_expired_dt` DATETIME NULL DEFAULT NULL,
  `photo` VARCHAR(255) NULL DEFAULT NULL,
  `is_firm` TINYINT NULL DEFAULT NULL,
  `created_date` DATE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `afvp_site`.`payment_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `afvp_site`.`payment_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `afvp_site`.`donation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `afvp_site`.`donation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_type_id` INT NOT NULL,
  `donor_id` INT NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Indexes creation
-- -----------------------------------------------------
ALTER TABLE `afvp_site`.`member`
  ADD INDEX `fk_memb_role_id_idx` (`role_id` ASC);

ALTER TABLE `afvp_site`.`member`
  ADD INDEX `fk_memb_subscription_id_idx` (`subscription_id` ASC);

ALTER TABLE `afvp_site`.`member`
  ADD INDEX `memb_name_idx` (`family_name` ASC, `first_name` ASC);

ALTER TABLE `afvp_site`.`member`
  ADD INDEX `memb_email_idx` (`email` ASC);

ALTER TABLE `afvp_site`.`category`
  ADD INDEX `fk_cate_member_id_idx` (`member_id` ASC);

ALTER TABLE `afvp_site`.`category`
  ADD INDEX `cate_name_idx` (`name` ASC);

ALTER TABLE `afvp_site`.`post`
  ADD INDEX `fk_post_member_id_idx` (`member_id` ASC);

ALTER TABLE `afvp_site`.`post`
  ADD INDEX `fk_post_parent_id_idx` (`parent_id` ASC);

ALTER TABLE `afvp_site`.`post`
  ADD INDEX `fk_post_category_id_idx` (`category_id` ASC);

ALTER TABLE `afvp_site`.`post`
  ADD INDEX `post_title_idx` (`title` ASC);

ALTER TABLE `afvp_site`.`post`
  ADD INDEX `post_datetime_idx` (`datetime` ASC);

ALTER TABLE `afvp_site`.`donation`
  ADD INDEX `fk_dona_donor_id_idx` (`donor_id` ASC);

ALTER TABLE `afvp_site`.`donation`
  ADD INDEX `fk_dona_paym_id_idx` (`payment_type_id` ASC);

-- -----------------------------------------------------
-- Foreign Keys creation
-- -----------------------------------------------------
ALTER TABLE `afvp_site`.`member`
  ADD CONSTRAINT `fk_memb_role_id_idx` FOREIGN KEY (`role_id`) REFERENCES `afvp_site`.`role` (`id`) ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`member`
  ADD CONSTRAINT `fk_memb_subscription_id_idx` FOREIGN KEY (`subscription_id`) REFERENCES `afvp_site`.`subscription` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`category`
  ADD CONSTRAINT `fk_cate_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`post`
  ADD CONSTRAINT `fk_post_category_id_idx` FOREIGN KEY (`category_id`) REFERENCES `afvp_site`.`category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`post`
  ADD CONSTRAINT `fk_post_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`post`
  ADD CONSTRAINT `fk_post_parent_id_idx` FOREIGN KEY (`parent_id`) REFERENCES `afvp_site`.`post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donation`
  ADD CONSTRAINT `fk_dona_donor_id_idx` FOREIGN KEY (`donor_id`) REFERENCES `afvp_site`.`donor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donation`
  ADD CONSTRAINT `fk_dona_memb_id_idx` FOREIGN KEY (`donor_id`) REFERENCES `afvp_site`.`member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donation`
  ADD CONSTRAINT `fk_dona_paym_id_idx` FOREIGN KEY (`payment_type_id`) REFERENCES `afvp_site`.`payment_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

