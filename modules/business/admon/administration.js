//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/users';
const globalRolApiUrl = 'http://localhost:3000/api/v1/rol';
const globalModuleApiUrl = 'http://localhost:3000/api/v1/modules';
const globalApiGetModulesPerRol = 'http://localhost:3000/api/v1/modules/rol/';


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


//GET MENU FOR USER ROL
const menuForUserRol = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    let rol = userInformation[0].idrol;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetModulesPerRol + rol, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let menuModules = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                menuModules += `
                    ${dataObtained.body[i].route}
                `;
            }
            document.getElementById('menuModules').innerHTML = menuModules;

        }
        catch (err) {
            console.log(err);
        }
    }
}
menuForUserRol();


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
                    `<button class="btn btn-warning" onclick="setInfoAdminUser(${dataObtained.body[i].id}, '${dataObtained.body[i].address}', '${dataObtained.body[i].email}',
                     '${dataObtained.body[i].fullname}', ${dataObtained.body[i].gender}, ${dataObtained.body[i].idrol}, ${dataObtained.body[i].nit},
                     ${dataObtained.body[i].phonenumber}, ${dataObtained.body[i].status})"><i class="fa-solid fa-pen-to-square"></i></button>`,
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


//SET INFO TO EDIT USERS(NOT CLIENTS)
const setInfoAdminUser = (idUserAdmin, address, email, fullName, gender, idRol, nit, phoneNumber) => {

    document.getElementById('idUserAdminEdit').value = idUserAdmin;
    document.getElementById('userNameAdminEdit').value = fullName;
    document.getElementById('addressAdminEdit').value = address;
    document.getElementById('cellPhoneAdminEdit').value = phoneNumber;
    document.getElementById('emailAdminEdit').value = email;
    document.getElementById('selectRolsEdit').selectedIndex = parseInt(idRol) - 1;
    document.getElementById('nitAdminEdit').value = nit;
    document.getElementById('genderSelectEdit').value = gender;
    document.getElementById('statusAdminEdit').selectedIndex = 0;

    $('#editUserModal').modal('show');
}


//SAVE INFO TO EDIT USERS(NOT CLIENTS) BEFORE SET INFO TO EDIT MODAL
const saveInfoBeforeEdit = () => {

    let id = document.getElementById('idUserAdminEdit').value;
    let userName = document.getElementById('userNameAdminEdit').value;
    let cellPhone = document.getElementById('cellPhoneAdminEdit').value;
    let address = document.getElementById('addressAdminEdit').value;
    let email = document.getElementById('emailAdminEdit').value;
    let rol = document.getElementById('selectRolsEdit').value;
    let nit = document.getElementById('nitAdminEdit').value;
    let gender = document.getElementById('genderSelectEdit').value;
    let status = document.getElementById('statusAdminEdit').value;
    let err = 'Error Interno';

    if (id === '' || userName === '' || cellPhone === '' || address === '' || gender === '' || status === '') {
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
            "id": id,
            "fullname": userName,
            "address": address,
            "phonenumber": cellPhone,
            "email": email,
            "nit": nit,
            "idrol": rol,
            "status": status,
            "gender": gender,
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
                            text: 'La operación se completó con éxito',
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
                        });
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
    }
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
                                text: 'La operación se completó con éxito',
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
            document.getElementById('selectRolsEdit').innerHTML = optionsSelect;
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
                `<button class="btn btn-danger" onclick="deleteRol(${dataObtained.body[i].id})"><i class="fa-solid fa-trash"></i></button>`
            ]);
        }
    }

    new DataTable('#rolTable', {
        columns: [
            { title: 'Nombre' },
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
                else if (dataObtained.body === 'ER_ROW_IS_REFERENCED_2: Cannot delete or update a parent row: a foreign key constraint fails (`bakerygo`.`modules`, CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`idrol`) REFERENCES `rol` (`id`))') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo eliminar porque hay datos que dependen de este, elimina antes los datos e intenta de nuevo',
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
                                text: 'La operación se completó con éxito',
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
                            text: 'La operación se completó con éxito',
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
                        });
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
                            text: 'La operación se completó con éxito',
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
                    `<button class="btn btn-warning" onclick="setInfoClientUser(${dataObtained.body[i].id}, '${dataObtained.body[i].address}', '${dataObtained.body[i].email}',
                    '${dataObtained.body[i].fullname}', ${dataObtained.body[i].gender}, ${dataObtained.body[i].nit}, ${dataObtained.body[i].phonenumber})"><i class="fa-solid fa-pen-to-square"></i></button>`,
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


//SET INFO TO EDIT CLIENTS
const setInfoClientUser = (idClientEdit, address, email, fullName, gender, nit, phoneNumber) => {

    document.getElementById('idClientEdit').value = idClientEdit;
    document.getElementById('userNameClienteEdit').value = fullName;
    document.getElementById('cellPhoneClientEdit').value = phoneNumber;
    document.getElementById('addressClientEdit').value = address;
    document.getElementById('emailClientEdit').value = email;
    document.getElementById('nitClientEdit').value = nit;
    document.getElementById('genderSelectClientEdit').value = gender;
    document.getElementById('statusClientEdit').value = 1;

    $('#editClientModal').modal('show');
}


//SAVE INFO TO EDIT CLIENTS BEFORE SET INFO TO EDIT MODAL
const saveInfoBeforeEditClient = () => {

    let id = document.getElementById('idClientEdit').value;
    let userName = document.getElementById('userNameClienteEdit').value;
    let cellPhone = document.getElementById('cellPhoneClientEdit').value;
    let address = document.getElementById('addressClientEdit').value;
    let email = document.getElementById('emailClientEdit').value;
    let rol = 3;
    let nit = document.getElementById('nitClientEdit').value;
    let gender = document.getElementById('genderSelectClientEdit').value;
    let status = document.getElementById('statusClientEdit').value;
    let err = 'Error Interno';

    if (id === '' || userName === '' || cellPhone === '' || address === '' || gender === '' || status === '') {
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
            "id": id,
            "fullname": userName,
            "address": address,
            "phonenumber": cellPhone,
            "email": email,
            "nit": nit,
            "idrol": rol,
            "status": status,
            "gender": gender,
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
                            text: 'La operación se completó con éxito',
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
                        });
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
    }
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
                                text: 'La operación se completó con éxito',
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

        document.getElementById('rolName').disabled = true;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(globalModuleApiUrl + '/' + idModule, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                modulesArray.push([idModule, nameModule, dataObtained.body[0].route]);
                let moduleData = '';
                for (let i = 0; i < modulesArray.length; i++) {
                    moduleData += `
                    <tr>
                        <td>${modulesArray[i][1]}</td>
                    </tr>
                    `;
                }
                document.getElementById('moduleTemporalyTable').innerHTML = moduleData;
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo obtener información del módulo, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                console.log(err);
            }
        }
    }
}



//CREATE ROL AND CREATE MODULES BEFORE
//CREATE NEW CLIENTS
const createRol = () => {

    let rolName = document.getElementById('rolName').value;

    if (rolName === '' || modulesArray.length === 0) {
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
            "name": rolName
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalRolApiUrl, requestOptions)
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
                        createModuleWithRolId(dataObtained.body.insertId);
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
    }
}

const createModuleWithRolId = (idCreateRol) => {

    let rolName = document.getElementById('rolName').value;

    if (rolName === '' || modulesArray.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {

        for (let i = 0; i < modulesArray.length; i++) {

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));


            var raw = JSON.stringify({
                "id": 0,
                "name": modulesArray[i][1],
                "route": modulesArray[i][2],
                "idrol": idCreateRol
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(globalModuleApiUrl, requestOptions)
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
                                text: 'La operación se completó con éxito',
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
                            });
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
        }
    }
}