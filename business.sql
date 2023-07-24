CREATE DATABASE bakerygo;

USE bakerygo;

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    idmodule INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(500) NOT NULL,
    permissions VARCHAR(100) NOT NULL
);

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    idrol INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    idmodule INT,
    FOREIGN KEY (idmodule) REFERENCES modules(idmodule)
);

-- CREACION DE TABLA USUARIO
CREATE TABLE users (
    idclient INT PRIMARY KEY NOT NULL auto_increment,
    fullname VARCHAR(250),
    address VARCHAR(250),
    phonenumber VARCHAR(20),
    email VARCHAR(250),
    nit VARCHAR(50),
    idrol INT,
    authentication VARCHAR(500),
    status INT,
    gender INT,
    FOREIGN KEY (idrol) REFERENCES rol(idrol)
);

-- CREACION DE TABLA AUTENTICACION
CREATE TABLE auth_process (
    idauth INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100),
    createdate VARCHAR(50),
    token VARCHAR(250),
    expiredate VARCHAR(50),
    sessionstatus INT,
    idusersession INT,
    FOREIGN KEY (idusersession) REFERENCES users(idclient)
);

-- CREACION DE TABLA PRODUCTOS
CREATE TABLE products (
    idproduct INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100),
    base64img MEDIUMTEXT,
    baseingredients VARCHAR(600),
    allergyinformation VARCHAR(250),
    description VARCHAR(250),
    applyextraingredients INT
);

-- CREACION DE TABLA EXTRA INGREDIENTES POR PRODUCTO
CREATE TABLE product_extra_ingredients (
    idextraingredientproduct INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100),
    price NUMERIC(10, 2),
    idproduct INT,
    FOREIGN KEY (idproduct) REFERENCES products(idproduct)
);

-- CREACION DE TABLA DOCUMENTOS DE PAGO
CREATE TABLE payfiles (
    idpayfile INT PRIMARY KEY NOT NULL auto_increment,
    base64imgreference MEDIUMTEXT
);

-- CREACION DE TABLA OPCIONES DE PAGO
CREATE TABLE payoptions (
    idpayoption INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50),
    route VARCHAR(500)
);

-- CREACION DE TABLA ORDENES
CREATE TABLE orders (
    idorder INT PRIMARY KEY NOT NULL auto_increment,
    ordernumber VARCHAR(250),
    status INT,
    totalpay NUMERIC(10, 2),
    idpayoption INT,
    idpayfile INT,
    idclient INT,
    address VARCHAR(250),
    description VARCHAR(250),
    base64imgreference MEDIUMTEXT,
    FOREIGN KEY (idpayoption) REFERENCES payoptions(idpayoption),
    FOREIGN KEY (idpayfile) REFERENCES payfiles(idpayfile),
    FOREIGN KEY (idclient) REFERENCES users(idclient)
);

-- CREACION DE TABLA PRODUCTOS POR ORDEN
CREATE TABLE product_per_order (
    idproductorder INT PRIMARY KEY NOT NULL auto_increment,
    idproduct INT,
    idorder INT,
    FOREIGN KEY (idproduct) REFERENCES products(idproduct),
    FOREIGN KEY (idorder) REFERENCES orders(idorder)
);

-- CREACION DE TABLA FACTURA
CREATE TABLE invoice (
    idinvoice INT PRIMARY KEY NOT NULL auto_increment,
    idorder INT,
    idclientgenerate INT,
    createat VARCHAR(50)
);