//ROUTES
const globalApiUrl = 'https://h-t3xu.onrender.com/api/v1/users';


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../index.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../index.html';
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
    localStorage.removeItem('shoppingCart');
    window.location.href = '../../../../index.html';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//SET USER INFO IN ADMIN PANEL
const setUserInfo = () => {
    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    document.getElementById('userNameDisplay').innerHTML = userInformation[0].fullname;
    document.getElementById('userName').value = userInformation[0].fullname;
    document.getElementById('cellPhone').value = parseInt(userInformation[0].phonenumber);
    document.getElementById('address').value = userInformation[0].address;
    document.getElementById('email').value = userInformation[0].email;
    document.getElementById('nit').value = userInformation[0].nit;
    document.getElementById('genderSelect').innerHTML = `<option value="1">${userInformation[0].gender == 1 ? 'Hombre' : 'Mujer'}</option>`;
}
setUserInfo();


//UPDATE USER DATA
const updateUserData = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    let id = userInformation[0].id;
    let userName = document.getElementById('userName').value;
    let cellPhone = document.getElementById('cellPhone').value;
    let address = document.getElementById('address').value;
    let email = document.getElementById('email').value;
    let nit = document.getElementById('nit').value;
    let err = 'Error Interno';

    if (userName === '' || cellPhone === '' || address === '' || email === '') {
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
            "idrol": userInformation[0].idrol,
            "status": userInformation[0].status,
            "gender": userInformation[0].gender,
            "user": email
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
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
                            } else if (result.isDenied) {
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
                            }
                            else {
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
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
                        console.log(err);
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


//UPDATE STATUS OR 'DELETE' USER
const updateStatusUser = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    let err = 'Error Interno';

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": userInformation[0].id,
        "fullname": userInformation[0].fullname,
        "address": userInformation[0].address,
        "phonenumber": userInformation[0].phonenumber,
        "email": userInformation[0].email,
        "nit": userInformation[0].nit,
        "idrol": userInformation[0].idrol,
        "status": 0,
        "gender": userInformation[0].gender,
        "user": userInformation[0].email
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
                            sessionStorage.removeItem("signInToken");
                            sessionStorage.removeItem("sessionInfo");
                            window.location.href = '../../../../index.html';
                        } else if (result.isDenied) {
                            sessionStorage.removeItem("signInToken");
                            sessionStorage.removeItem("sessionInfo");
                            window.location.href = '../../../../index.html';
                        }
                        else {
                            sessionStorage.removeItem("signInToken");
                            sessionStorage.removeItem("sessionInfo");
                            window.location.href = '../../../../index.html';
                        }
                    })
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno - ' + err.toUpperCase(),
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                    console.log(err);
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


//UPDATE PASSWORD OR 'DELETE' USER
const updatePasswordUser = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);

    let newPassword = document.getElementById('newPassword').value;
    let repeatPassword = document.getElementById('repeatPassword').value;
    let err = 'Error Interno';

    if (newPassword == '' || repeatPassword == '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Los campos no pueden ir vacíos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (newPassword != repeatPassword) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Los campos no coinciden, intenta de nuevo',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
        document.getElementById('newPassword').value = '';
        document.getElementById('repeatPassword').value = '';
        document.getElementById('newPassword').focus();
    }
    else if (newPassword === repeatPassword) {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": userInformation[0].id,
            "fullname": userInformation[0].fullname,
            "address": userInformation[0].address,
            "phonenumber": userInformation[0].phonenumber,
            "email": userInformation[0].email,
            "nit": userInformation[0].nit,
            "idrol": userInformation[0].idrol,
            "status": userInformation[0].status,
            "gender": userInformation[0].gender,
            "user": userInformation[0].email,
            "password": newPassword
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
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
                            } else if (result.isDenied) {
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
                            }
                            else {
                                sessionStorage.removeItem("signInToken");
                                sessionStorage.removeItem("sessionInfo");
                                window.location.href = '../../../../index.html';
                            }
                        })
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno - ' + err.toUpperCase(),
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                        console.log(err);
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