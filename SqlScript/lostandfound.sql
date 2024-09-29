CREATE TABLE laf_users(
   uid int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique user ID.',
   user_name varchar(60) NOT NULL DEFAULT '' COMMENT 'Unique user name.',
   password varchar(128) NOT NULL DEFAULT '' COMMENT 'User\''s password (hashed).',
   mail varchar(320) DEFAULT '' COMMENT 'Unique mail id.',
   is_account_active int(1) DEFAULT '1' COMMENT 'Whether the user is active(1) or blocked(0).',
   is_verified_account int(1) DEFAULT '0' COMMENT 'Whether the user account is verified(1) or not verified(0).',
   deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the user is not deleted(N) or deleted(Y).',
   created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
   updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated.',
   updated_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who updated the record.',
   created_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who created the record.',
   PRIMARY KEY (uid),
   UNIQUE KEY user_name (user_name),
   UNIQUE KEY mail (mail)
);

CREATE TABLE laf_users_info(
   uid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: Unique user ID.',
   fname varchar(128) DEFAULT NULL  COMMENT 'fname of user.',
   lname varchar(128) DEFAULT NULL COMMENT 'lname of user.',
   mobile varchar(20) DEFAULT NULL COMMENT 'mobile number of user.',
   address varchar(2048) DEFAULT NULL COMMENT 'address of user.',
   profile_url  varchar(512) DEFAULT NULL COMMENT 'profile url of user.',
   deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the user is not deleted(N) or deleted(N).',
   created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
   updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated.',
   updated_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated_by.',
   created_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was created_by.',
   PRIMARY KEY (uid),
    UNIQUE KEY mobile (mobile),
   CONSTRAINT fk_users_info_uid FOREIGN KEY (uid) REFERENCES laf_users(uid) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE laf_users_roles(
    uid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: users.uid for user.',
    rid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: role.rid for role.',
    deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the user is not deleted(N) or deleted(N).',
    created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
    updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated.',
    updated_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated_by.',
    created_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was created_by.',
    PRIMARY KEY (uid,rid),
    KEY rid (rid)
)


CREATE TABLE laf_role(
  rid int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique role ID.',
  name varchar(64) NOT NULL DEFAULT '' COMMENT 'Unique role name.',
  deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the user is not deleted(N) or deleted(N).',
  created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
  updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated.',
  updated_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated_by.',
  created_by int(10) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was created_by.',
  PRIMARY KEY (rid),
  UNIQUE KEY name(name)
);

INSERT INTO laf_role (rid, name, created) VALUES (1, "SUPERADMIN",1724693157);
INSERT INTO laf_role (rid, name, created) VALUES (2, "ADMIN",1724693205);
INSERT INTO laf_role (rid, name, created) VALUES (3, "MEMBER",1724693239);


CREATE TABLE laf_report_form(
   id  int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique  table ID.',
   uid int(10) unsigned NOT NULL  COMMENT ' user ID.',
   post_category varchar(60) NOT NULL DEFAULT '' COMMENT 'Post category.',
   title varchar(128) NOT NULL DEFAULT '' COMMENT 'Report title.',
   report_time varchar(320) DEFAULT '' COMMENT 'report time.',
   description text  COMMENT 'report description.',
   location varchar(2048) DEFAULT NULL COMMENT 'report location.',
   post_type int(1) DEFAULT '1' COMMENT 'report value 1 means found and 2 means lost.',
   report_image_url  varchar(512) DEFAULT NULL COMMENT 'report url of file.',
   remarks text  COMMENT 'report remarks.',
   deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the user is not deleted(N) or deleted(Y).',
   created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when user was created.',
   updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when user was updated.',
   updated_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who updated the record.',
   created_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who created the record.',
   PRIMARY KEY (id)
);

CREATE TABLE laf_post_category (
   id  int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique table ID.',
   post_category varchar(60) NOT NULL DEFAULT '' COMMENT 'Post category.',
   description text  DEFAULT NULL COMMENT 'Report description.',
   deleted char(1) NOT NULL DEFAULT 'N' COMMENT 'Whether the report is deleted (Y) or not (N).',
   created int(11) unsigned NOT NULL DEFAULT '0' COMMENT 'Timestamp for when the report was created.',
   updated int(11) unsigned DEFAULT NULL COMMENT 'Timestamp for when the report was updated.',
   updated_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who updated the record.',
   created_by int(10) unsigned DEFAULT NULL COMMENT 'ID of the user who created the record.',
   PRIMARY KEY (id),
   UNIQUE KEY post_category (post_category)
);
