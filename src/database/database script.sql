-- -----------------------------------------------------
-- Schema afvp_site
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `afvp_site`;

CREATE SCHEMA IF NOT EXISTS `afvp_site` DEFAULT CHARACTER SET utf8;

USE `afvp_site`;

-- -----------------------------------------------------
-- Table `afvp_site`.`role`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`roles`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`subscription`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`subscriptions`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`subscriptions` (
  `id` INT NOT NULL,
  `member_id` INT(11) NOT NULL,
  `subscriptiontype_id` INT(11) NOT NULL,
  `created_dt` DATE NULL DEFAULT NULL ,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`subscription_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`subscription_types`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`subscription_types` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`member`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`members`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`members` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `gender` ENUM('Mr', 'Mrs') NOT NULL,
  `family_name` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `email_verified` TINYINT,
  `email_verification_token` VARCHAR(255),
  `password` VARCHAR(255) NOT NULL,
  `pass_confirm` VARCHAR(255) NOT NULL,
  `pass_changed_dt` DATETIME NULL DEFAULT NULL,
  `pass_reset_token` VARCHAR(255) NULL DEFAULT NULL,
  `pass_reset_expired_dt` DATETIME NULL DEFAULT NULL,
  `photo_url` VARCHAR(255) NULL DEFAULT NULL,
  `address01` VARCHAR(255) NULL DEFAULT NULL,
  `address02` VARCHAR(255) NULL DEFAULT NULL,
  `address03` VARCHAR(255) NULL DEFAULT NULL,
  `country` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(150) NULL DEFAULT NULL,
  `speciality` VARCHAR(255) NULL DEFAULT NULL,
  `hobby` MEDIUMTEXT NULL DEFAULT NULL,
  `created_dt` DATE NULL DEFAULT NULL COMMENT 'Date of the request to join the association',
  `subscription_dt` DATE NULL DEFAULT NULL COMMENT 'Membership payment date',
  `active_limit_dt` DATE NULL DEFAULT NULL COMMENT 'Membership active limit date',
  `is_active` TINYINT NULL DEFAULT NULL COMMENT 'Membership active status',
  `status` ENUM('tovalidate', 'inregistration', 'registered', 'rejected') NOT NULL COMMENT 'Statuses for the membership application process',
  `donor` TINYINT NULL DEFAULT NULL,
  `board_member` TINYINT NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL,
  `subscriptiontype_id` INT(11) NOT NULL,
  `deactivated_at` DATE NULL DEFAULT NULL COMMENT 'Member deactivation date'
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`categories`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `member_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `afvp_site`.`post`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`posts`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`posts` (
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
DROP TABLE IF EXISTS `afvp_site`.`donors`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`donors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `gender` ENUM('Mr', 'Mrs') NOT NULL,
  `family_name` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `email_verified` TINYINT,
  `email_verification_token` VARCHAR(255),
  `password` VARCHAR(255) NOT NULL,
  `pass_confirm` VARCHAR(255) NOT NULL,
  `pass_reset_token` VARCHAR(255) NOT NULL,
  `pass_reset_expired_dt` DATETIME NULL DEFAULT NULL,
  `photo_url` VARCHAR(255) NULL DEFAULT NULL,
  `address01` VARCHAR(255) NULL DEFAULT NULL,
  `address02` VARCHAR(255) NULL DEFAULT NULL,
  `address03` VARCHAR(255) NULL DEFAULT NULL,
  `country` VARCHAR(255) NULL DEFAULT NULL,
  `is_firm` TINYINT NULL DEFAULT NULL,
  `role_id` INT(11) NOT NULL,
  `created_date` DATE NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `afvp_site`.`payment_type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`payment_types`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`payment_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `afvp_site`.`donation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `afvp_site`.`donations`;

CREATE TABLE IF NOT EXISTS `afvp_site`.`donations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `payment_type_id` INT NOT NULL,
  `member_id` INT NOT NULL,
  `donor_id` INT NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Indexes creation
-- -----------------------------------------------------
ALTER TABLE `afvp_site`.`members`
  ADD INDEX `fk_memb_role_id_idx` (`role_id` ASC);

ALTER TABLE `afvp_site`.`members`
  ADD INDEX `fk_memb_subscription_id_idx` (`subscription_id` ASC);

ALTER TABLE `afvp_site`.`members`
  ADD INDEX `memb_name_idx` (`family_name` ASC, `first_name` ASC);

ALTER TABLE `afvp_site`.`members`
  ADD INDEX `memb_email_idx` (`email` ASC);

ALTER TABLE `afvp_site`.`categories`
  ADD INDEX `fk_cate_member_id_idx` (`member_id` ASC);

ALTER TABLE `afvp_site`.`categories`
  ADD INDEX `cate_name_idx` (`name` ASC);

ALTER TABLE `afvp_site`.`posts`
  ADD INDEX `fk_post_member_id_idx` (`member_id` ASC);

ALTER TABLE `afvp_site`.`posts`
  ADD INDEX `fk_post_parent_id_idx` (`parent_id` ASC);

ALTER TABLE `afvp_site`.`posts`
  ADD INDEX `fk_post_category_id_idx` (`category_id` ASC);

ALTER TABLE `afvp_site`.`posts`
  ADD INDEX `post_title_idx` (`title` ASC);

ALTER TABLE `afvp_site`.`posts`
  ADD INDEX `post_datetime_idx` (`datetime` ASC);

ALTER TABLE `afvp_site`.`donations`
  ADD INDEX `fk_dona_donor_id_idx` (`donor_id` ASC);

ALTER TABLE `afvp_site`.`donations`
  ADD INDEX `fk_dona_member_id_idx` (`donor_id` ASC);

ALTER TABLE `afvp_site`.`donations`
  ADD INDEX `fk_dona_paym_id_idx` (`payment_type_id` ASC);

ALTER TABLE `afvp_site`.`donors`
  ADD INDEX `fk_dono_role_id_idx` (`role_id` ASC);

ALTER TABLE `afvp_site`.`donors`
  ADD INDEX `dono_name_idx` (`family_name` ASC, `first_name` ASC);

ALTER TABLE `afvp_site`.`donors`
  ADD INDEX `dono_email_idx` (`email` ASC);

-- -----------------------------------------------------
-- Foreign Keys creation
-- -----------------------------------------------------
ALTER TABLE `afvp_site`.`members`
  ADD CONSTRAINT `fk_memb_role_id_idx` FOREIGN KEY (`role_id`) REFERENCES `afvp_site`.`roles` (`id`) ON DELETE CASCADE  ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`members`
  ADD CONSTRAINT `fk_memb_subscriptiontype_id_idx` FOREIGN KEY (`subscriptiontype_id`) REFERENCES `afvp_site`.`subscription-types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`subscriptions`
  ADD CONSTRAINT `fk_subs_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`subscriptions`
  ADD CONSTRAINT `fk_subs_subscriptiontype_id_idx` FOREIGN KEY (`subscriptiontype_id`) REFERENCES `afvp_site`.`subscription-types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE `afvp_site`.`categories`
  ADD CONSTRAINT `fk_cate_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`posts`
  ADD CONSTRAINT `fk_post_category_id_idx` FOREIGN KEY (`category_id`) REFERENCES `afvp_site`.`categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`posts`
  ADD CONSTRAINT `fk_post_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`posts`
  ADD CONSTRAINT `fk_post_parent_id_idx` FOREIGN KEY (`parent_id`) REFERENCES `afvp_site`.`posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donations`
  ADD CONSTRAINT `fk_dona_donor_id_idx` FOREIGN KEY (`donor_id`) REFERENCES `afvp_site`.`donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donations`
  ADD CONSTRAINT `fk_dona_member_id_idx` FOREIGN KEY (`member_id`) REFERENCES `afvp_site`.`members` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donations`
  ADD CONSTRAINT `fk_dona_paym_id_idx` FOREIGN KEY (`payment_type_id`) REFERENCES `afvp_site`.`payment_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `afvp_site`.`donors`
  ADD CONSTRAINT `fk_dono_role_id_idx` FOREIGN KEY (`role_id`) REFERENCES `afvp_site`.`roles` (`id`) ON DELETE CASCADE  ON UPDATE CASCADE;