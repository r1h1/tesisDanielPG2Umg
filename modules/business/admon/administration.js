//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/users';
const globalRolApiUrl = 'http://localhost:3000/api/v1/rol';
const globalModuleApiUrl = 'http://localhost:3000/api/v1/modules';


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
                    `<button class="btn btn-warning" onclick="alert('hola')"><i class="fa-solid fa-pen-to-square"></i></button>`,
                    `<button class="btn btn-danger" onclick="deleteAdminUser(${dataObtained.body[i].id})"><i class="fa-solid fa-trash"></i></button>`
                ]);
            }
        }
    }

    new DataTable('#userTable', {
        columns: [
            { title: 'Dirección' },
            { title: 'Correo El.' },
            { title: 'Nombre' },
            { title: 'Género' },
            { title: 'Rol' },
            { title: 'NIT' },
            { title: 'Teléfono' },
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


//DELETE USER INFO
const deleteAdminUser = (idUserToEliminate) => {

    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Los cambios no se podrán recuperar',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var raw = JSON.stringify({
                "id": idUserToEliminate
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(globalApiUrl, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

            const showData = (dataObtained) => {
                if (dataObtained.body === 'Error de Servidor') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                        try {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación de completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../../views/a/administrative/component';
                                } else if (result.isDenied) {
                                    window.location.href = '../../../views/a/administrative/component';
                                }
                            })
                        }
                        catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Lo Sentimos!',
                                text: 'Sa ha generado un error interno',
                                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                                confirmButtonText: 'Entendido'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
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
            let optionsSelect = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                optionsSelect += `<option value="${dataObtained.body[i].id}">${dataObtained.body[i].name}</option>`;
            }
            document.getElementById('selectRols').innerHTML = optionsSelect;
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
                `<button class="btn btn-danger" onclick="deleteRol(${dataObtained.body[i].id})"><i class="fa-solid fa-trash"></i></button>`
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


//DELETE ROL INFO
const deleteRol = (idRol) => {

    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Los cambios no se podrán recuperar',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var bodyToDelete = JSON.stringify({
                "id": idRol
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: bodyToDelete,
                redirect: 'follow'
            };

            console.log(bodyToDelete);

            fetch(globalRolApiUrl, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

            const showData = (dataObtained) => {
                if (dataObtained.body === 'Error de Servidor') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                        try {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación de completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../../views/a/administrative/component';
                                } else if (result.isDenied) {
                                    window.location.href = '../../../views/a/administrative/component';
                                }
                            })
                        }
                        catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Lo Sentimos!',
                                text: 'Sa ha generado un error interno',
                                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                                confirmButtonText: 'Entendido'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}



//GET MODULES TO SELECT ITEM
const getModuleInfo = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalModuleApiUrl, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let optionsSelect = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                optionsSelect += `<option value="${dataObtained.body[i].id}">${dataObtained.body[i].name}</option>`;
            }
            document.getElementById('selectModules').innerHTML = optionsSelect;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getModuleInfo();



//CREATE NEW USER
const createAdminUser = () => {

    let userName = document.getElementById('userNameAdmin').value;
    let cellPhone = document.getElementById('cellPhoneAdmin').value;
    let address = document.getElementById('addressAdmin').value;
    let email = document.getElementById('emailAdmin').value;
    let rol = document.getElementById('selectRols').value;
    let nit = document.getElementById('nitAdmin').value;
    let gender = document.getElementById('genderSelect').value;
    let password = document.getElementById('passwordAdmin').value;
    let err = 'Error Interno';

    if (userName === '' || cellPhone === '' || address === '' || email === '' || gender === '' || password === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": 0,
            "fullname": userName,
            "address": address,
            "phonenumber": cellPhone,
            "email": email,
            "nit": nit,
            "idrol": rol,
            "status": 1,
            "gender": gender,
            "user": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiUrl, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
            else {
                if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                    try {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Correcto!',
                            text: 'La operación de completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '../../../views/a/administrative/component';
                            } else if (result.isDenied) {
                                window.location.href = '../../../views/a/administrative/component';
                            }
                        })
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                        window.location.href = '../../../views/a/administrative/component';
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                    window.location.href = '../../../views/a/administrative/component';
                }
            }
        }
    }
}



//CREATE NEW CLIENTS
const createClientUser = () => {

    let userName = document.getElementById('userNameClient').value;
    let cellPhone = document.getElementById('cellPhoneClient').value;
    let address = document.getElementById('addressClient').value;
    let email = document.getElementById('emailClient').value;
    let rol = 3;
    let nit = document.getElementById('nitClient').value;
    let gender = document.getElementById('genderSelectClient').value;
    let password = document.getElementById('passwordClient').value;
    let err = 'Error Interno';

    if (userName === '' || cellPhone === '' || address === '' || email === '' || gender === '' || password === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": 0,
            "fullname": userName,
            "address": address,
            "phonenumber": cellPhone,
            "email": email,
            "nit": nit,
            "idrol": rol,
            "status": 1,
            "gender": gender,
            "user": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiUrl, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
            else {
                if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                    try {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Correcto!',
                            text: 'La operación de completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '../../../views/a/administrative/component';
                            } else if (result.isDenied) {
                                window.location.href = '../../../views/a/administrative/component';
                            }
                        })
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                        window.location.href = '../../../views/a/administrative/component';
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                    window.location.href = '../../../views/a/administrative/component';
                }
            }
        }
    }
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
                    `<button class="btn btn-danger" onclick="deleteClients(${dataObtained.body[i].id})"><i class="fa-solid fa-trash"></i></button>`
                ]);
            }
        }
    }

    new DataTable('#clientsTable', {
        columns: [
            { title: 'Dirección' },
            { title: 'Correo El.' },
            { title: 'Nombre' },
            { title: 'Género' },
            { title: 'Rol' },
            { title: 'NIT' },
            { title: 'Teléfono' },
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


//DELETE USER INFO
const deleteClients = (idUser) => {

    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Los cambios no se podrán recuperar',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var bodyToDelete = JSON.stringify({
                "id": idUser
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: bodyToDelete,
                redirect: 'follow'
            };

            console.log(bodyToDelete);

            fetch(globalApiUrl, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

            const showData = (dataObtained) => {
                if (dataObtained.body === 'Error de Servidor') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                        try {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación de completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../../views/a/administrative/component';
                                } else if (result.isDenied) {
                                    window.location.href = '../../../views/a/administrative/component';
                                }
                            })
                        }
                        catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Lo Sentimos!',
                                text: 'Sa ha generado un error interno',
                                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                                confirmButtonText: 'Entendido'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}



//ADD TEMPORALY USER MODULES FOR CREATE NEW ROL
//TEMPORALY ARRAY CONTAINS MODULE ID AND NAME
let modulesArray = [];

const verifyArrayModules = () => {
    if (modulesArray.length == 0) {
        let moduleData = '';
        for (let i = 0; i < 1; i++) {
            moduleData += `
            <tr>
                <th hidden>}</th>
                <td class="text-muted">-- Agrega un módulo a la lista --</td>
            </tr>
            `;
        }
        document.getElementById('moduleTemporalyTable').innerHTML = moduleData;
    }
    else {
        // EXECUTE THE ADD MODULE TO ROL TEMPORALY FUNCTION
    }
}
verifyArrayModules();

const addModuleToRolTemporaly = (selectModule) => {

    document.getElementById('rolName').disabled = true;

    let rolName = document.getElementById('rolName').value;
    let idModule = document.getElementById('selectModules').value;
    let nameModule = selectModule[selectModule.selectedIndex].text;

    if (rolName == '' || idModule == '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {
        modulesArray.push([idModule, nameModule]);
        let moduleData = '';
        for (let i = 0; i < modulesArray.length; i++) {
            moduleData += `
            <tr>
                <th hidden>${modulesArray[i][0]}</th>
                <td>${modulesArray[i][1]}</td>
            </tr>
            `;
        }
        document.getElementById('moduleTemporalyTable').innerHTML = moduleData;
    }
}