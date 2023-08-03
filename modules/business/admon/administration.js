//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/users';
const globalRolApiUrl = 'http://localhost:3000/api/v1/rol'


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        window.location.href = '../../../views/g/login/component';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../../views/g/login/component';
    }
    else {
        //CORRECT ACCESS
    }
}
validateToken();



//CLOSE SESSION AND REMOVE SESSION STORAGE ITEMS
const closeSession = () => {
    sessionStorage.removeItem('signInToken');
    sessionStorage.removeItem('sessionInfo');
    window.location.href = '../../../views/g/login/component';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//SET USER INFO IN ADMIN PANEL
const setUserInfo = () => {
    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    document.getElementById('fullName').innerHTML = userInformation[0].fullname;
}
setUserInfo();


//GET ADMIN'S USERS INFO
//GET ROL INFO
const getAdminsUserInfo = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiUrl, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            addDataToUserTable(dataObtained);
            addDataToClientTable(dataObtained);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getAdminsUserInfo();



//PRINT USERS (NOT CLIENTS) IN USER DATATABLE
const addDataToUserTable = (dataObtained) => {
    let dataSet = [];

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase()
        });
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            if (dataObtained.body[i].idrol != 3) {
                dataSet.push([
                    dataObtained.body[i].address ?? 'Sin Datos',
                    dataObtained.body[i].email ?? 'Sin Datos',
                    dataObtained.body[i].fullname ?? 'Sin Datos',
                    dataObtained.body[i].gender === 1 ? 'Hombre' : 'Mujer',
                    dataObtained.body[i].idrol === 1 ? 'Super Administrador' : dataObtained.body[i].idrol === 2 ? 'Administrador' : dataObtained.body[i].idrol === 3 ? 'Cliente' : dataObtained.body[i].idrol === 4 ? 'Cocinero' : dataObtained.body[i].idrol === 5 ? 'Contabilidad' : 'Desconocido' ?? 'Sin Datos',
                    dataObtained.body[i].nit ?? 'Sin Datos',
                    dataObtained.body[i].phonenumber ?? 'Sin Datos',
                    dataObtained.body[i].status === 1 ? 'Activo' : 'Inactivo' ?? 'Sin Datos',
                    `<button class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>`,
                    `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`
                ]);
            }
        }
    }

    new DataTable('#userTable', {
        columns: [
            { title: 'Dirección' },
            { title: 'Correo Electrónico' },
            { title: 'Nombre Completo' },
            { title: 'Género' },
            { title: 'Rol' },
            { title: 'NIT' },
            { title: 'Número de Teléfono' },
            { title: 'Estado' },
            { title: 'Edicion' },
            { title: 'Eliminación' }
        ],
        data: dataSet,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        select: true
    });
}


//PRINT CLIENTS TO CLIENT DATATABLE
const addDataToClientTable = (dataObtained) => {
    let dataSet = [];

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase()
        });
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            if (dataObtained.body[i].idrol === 3) {
                dataSet.push([
                    dataObtained.body[i].address ?? 'Sin Datos',
                    dataObtained.body[i].email ?? 'Sin Datos',
                    dataObtained.body[i].fullname ?? 'Sin Datos',
                    dataObtained.body[i].gender === 1 ? 'Hombre' : 'Mujer',
                    dataObtained.body[i].idrol === 1 ? 'Super Administrador' : dataObtained.body[i].idrol === 2 ? 'Administrador' : dataObtained.body[i].idrol === 3 ? 'Cliente' : dataObtained.body[i].idrol === 4 ? 'Cocinero' : dataObtained.body[i].idrol === 5 ? 'Contabilidad' : 'Desconocido' ?? 'Sin Datos',
                    dataObtained.body[i].nit ?? 'Sin Datos',
                    dataObtained.body[i].phonenumber ?? 'Sin Datos',
                    dataObtained.body[i].status === 1 ? 'Activo' : 'Inactivo' ?? 'Sin Datos',
                    `<button class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>`,
                    `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`
                ]);
            }
        }
    }

    new DataTable('#clientsTable', {
        columns: [
            { title: 'Dirección' },
            { title: 'Correo Electrónico' },
            { title: 'Nombre Completo' },
            { title: 'Género' },
            { title: 'Rol' },
            { title: 'NIT' },
            { title: 'Número de Teléfono' },
            { title: 'Estado' },
            { title: 'Edicion' },
            { title: 'Eliminación' }
        ],
        data: dataSet,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        select: true
    });
}


//GET ROL INFO
const getRolInfo = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalRolApiUrl, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            addDataToRolTable(dataObtained);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getRolInfo();


//PRINT ROLS TO ROL DATATABLE
const addDataToRolTable = (dataObtained) => {
    let dataSet = [];

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase()
        });
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            dataSet.push([
                dataObtained.body[i].name ?? 'Sin Datos',
                `<button class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>`,
                `<button class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>`
            ]);
        }
    }

    new DataTable('#rolTable', {
        columns: [
            { title: 'Nombre' },
            { title: 'Edicion' },
            { title: 'Eliminación' }
        ],
        data: dataSet,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        select: true
    });
}