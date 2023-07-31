const db = require('../../db/mysql');
const dataTable = 'rol';

const data = (table) => {
    return db.data(dataTable)
}

const oneData = (id) => {
    return db.oneData(dataTable, id);
}

const addData = (body) => {
    return db.addData(dataTable, body);
}

const deleteData = (body) => {
    return db.deleteData(dataTable, body);
}

module.exports = {
    data,
    oneData,
    deleteData,
    addData
}