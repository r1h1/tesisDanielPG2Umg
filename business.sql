CREATE DATABASE bakerygo;

USE bakerygo;

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL
);

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (1, 'Super Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (2, 'Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (3, 'Cliente');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (4, 'Cocinero');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (5, 'Contabilidad');

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(500) NOT NULL,
    idrol INT,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- MODULOS PARA ROL SUPER ADMINISTRADOR
INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        1,
        'Dashboard',
        '<li class="activo shadow mt-2"><a href="../dashboard/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-gauge me-3"></i> Dashboard</a></li>',
        1
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        2,
        'Administracion',
        '<li class="mt-2"><a href="../administrative/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-lock me-3"></i> Administrativo</a></li>',
        1
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        3,
        'Productos',
        '<li class="mt-2"><a href="../products/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-box me-3"></i> Productos</a></li>',
        1
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        4,
        'Pedidos',
        '<li class="mt-2"><a href="../orders/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-truck me-3"></i> Pedidos</a></li>',
        1
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        5,
        'Reporteria',
        '<li class="mt-2"><a href="../reports/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-chart-pie me-3"></i> Reportería</a></li>',
        1
    );

-- MODULOS PARA ROL ADMINISTRADOR
INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        6,
        'Dashboard',
        '<li class="activo shadow mt-2"><a href="../dashboard/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-gauge me-3"></i> Dashboard</a></li>',
        2
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        7,
        'Administracion',
        '<li class="mt-2"><a href="../administrative/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-lock me-3"></i> Administrativo</a></li>',
        2
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        8,
        'Productos',
        '<li class="mt-2"><a href="../products/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-box me-3"></i> Productos</a></li>',
        2
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        9,
        'Pedidos',
        '<li class="mt-2"><a href="../orders/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-truck me-3"></i> Pedidos</a></li>',
        2
    );

-- MODULOS PARA ROL COCINERO
INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        10,
        'Productos',
        '<li class="mt-2"><a href="../products/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-box me-3"></i> Productos</a></li>',
        4
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        11,
        'Pedidos',
        '<li class="mt-2"><a href="../orders/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-truck me-3"></i> Pedidos</a></li>',
        4
    );

-- MODULO PARA ROL CONTABILIDAD
INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        12,
        'Dashboard',
        '<li class="activo shadow mt-2"><a href="../dashboard/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-gauge me-3"></i> Dashboard</a></li>',
        5
    );

INSERT INTO
    `modules`(`id`, `name`, `route`, `idrol`)
VALUES
    (
        13,
        'Reporteria',
        '<li class="mt-2"><a href="../reports/component" class="text-decoration-none px-3 py-2 d-block"><i class="fa-solid fa-chart-pie me-3"></i> Reportería</a></li>',
        5
    );

-- CREACION DE TABLA USUARIO
CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL auto_increment,
    fullname VARCHAR(250),
    address VARCHAR(250),
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    nit VARCHAR(50),
    idrol INT,
    status INT,
    gender INT,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- CREACION DE TABLA AUTENTICACION
CREATE TABLE auth (
    id INT PRIMARY KEY NOT NULL,
    user varchar(100),
    password varchar(250)
);

-- CREACION DE TABLA PRODUCTOS
CREATE TABLE products (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100),
    price NUMERIC(10, 2),
    base64img MEDIUMTEXT,
    baseingredients VARCHAR(600),
    allergyinformation VARCHAR(250),
    description VARCHAR(250),
    applyextraingredients INT
);

-- CREACION DE TABLA EXTRA INGREDIENTES POR PRODUCTO
CREATE TABLE product_extra_ingredients (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100),
    price NUMERIC(10, 2),
    idproduct INT,
    FOREIGN KEY (idproduct) REFERENCES products(id)
);

-- CREACION DE TABLA ORDENES
CREATE TABLE orders (
    id INT PRIMARY KEY NOT NULL auto_increment,
    ordernumber VARCHAR(250),
    status INT,
    totalpay NUMERIC(10, 2),
    idpayoption INT,
    idclient INT,
    nameorder varchar(50),
    nitorder varchar(50),
    addressorder VARCHAR(250),
    phoneorder VARCHAR(20),
    bankorpaypalauthnumber VARCHAR(250),
    bankdateofpay VARCHAR(50),
    createdDate VARCHAR(50),
    finishDate VARCHAR(50),
    base64payfile TEXT,
    FOREIGN KEY (idclient) REFERENCES users(id)
);

-- CREACION DE TABLA PRODUCTOS POR ORDEN
CREATE TABLE product_per_order (
    id INT PRIMARY KEY NOT NULL auto_increment,
    idproduct INT,
    quantity INT,
    priceproduct NUMERIC(10, 2),
    baseingredientsselected VARCHAR(250),
    idextraingredients VARCHAR(100),
    description VARCHAR(250),
    idorder INT,
    FOREIGN KEY (idproduct) REFERENCES products(id),
    FOREIGN KEY (idorder) REFERENCES orders(id)
);

-- CREACION DE TABLA FACTURA
CREATE TABLE invoice (
    id INT PRIMARY KEY NOT NULL auto_increment,
    idorder INT,
    idclientgenerate INT,
    createdDate VARCHAR(50),
    finishDate VARCHAR(50)
);