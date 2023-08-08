const express = require('express');
const router = express.Router();
const security = require('./security');
const responses = require('../../network/responses');
const controller = require('./index');


//RUTAS PARA CONSULTAR
router.get('/', security(), data);
router.get('/:id', security(), oneData);
router.post('/', security(), addData);
router.put('/', security(), deleteData);//RUTAS PARA CONSULTAR
router.get('/:createdDate/:finishDate', security(), dataWithDates);
router.get('/salesClient/:createdDate/:finishDate', security(), dataWithDatesAndClients);
router.get('/salesProduct/:createdDate/:finishDate', security(), dataWithDatesAndProducts);


//CONSULTAR UN SOLO ÍTEM POR FECHAS
async function dataWithDates(req, res, next) {
    try {
        const items = await controller.dataWithDates(req.params.createdDate, req.params.finishDate).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR UN SOLO ÍTEM POR FECHAS AÑADIENDO CLIENTE
async function dataWithDatesAndClients(req, res, next) {
    try {
        const items = await controller.dataWithDatesAndClients(req.params.createdDate, req.params.finishDate).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR UN SOLO ÍTEM POR FECHAS AÑADIENDO PRODUCTOS
async function dataWithDatesAndProducts(req, res, next) {
    try {
        const items = await controller.dataWithDatesAndProducts(req.params.createdDate, req.params.finishDate).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR TODOS LOS ÍTEMS
async function data(req, res, next) {
    try {
        const items = await controller.data().then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};

//CONSULTAR UN SOLO ÍTEM
async function oneData(req, res, next) {
    try {
        const items = await controller.oneData(req.params.id).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};

//CREAR UN NUEVO ITEM
async function addData(req, res, next) {
    try {
        const items = await controller.addData(req.body);
        if (req.body.id == 0) {
            message = 'Created OK';
        }
        else {
            message = 'Updated OK';
        }
        responses.success(req, res, items, 201);
    }
    catch (err) {
        next(err);
    }
};

//ELIMINAR ITEM
async function deleteData(req, res, next) {
    try {
        const items = await controller.deleteData(req.body).then((items) => {
            responses.success(req, res, 'Dropped OK', 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//EXPORTA LOS DATOS
module.exports = router;