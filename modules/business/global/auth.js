//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/auth/login';
const userApiUrl = 'http://localhost:3000/api/v1/users';

//GET AND SET TOKEN WITH POST DATA OBTAINED
const signIn = () => {

    let userObtained = document.getElementById('user').value.toString();
    let passwordObtained = document.getElementById('password').value.toString();
    let err = 'Error Interno';

    if (userObtained === '' || passwordObtained === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Este error es generado por el sistema'
        });
        sessionStorage.removeItem("signInToken");
    }
    else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "user": userObtained,
            "password": passwordObtained
        });

        let requestOptions = {
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
                    text: 'Datos incorrectos o sin autorización para acceder',
                    footer: 'Este error es generado por el sistema, informa al administrador'
                });
                sessionStorage.removeItem("signInToken");
            }
            else {
                try {
                    sessionStorage.setItem("signInToken", dataObtained.body);
                    //EXECUTE FUNCTION TO DECODED TOKEN DATA
                    let token = dataObtained.body;
                    parseJwt(token);
                }
                catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Este error es generado por el sistema, informa al administrador'
                    });
                    sessionStorage.removeItem("signInToken");
                    console.log(err);
                }
            }
        }
    }
}

//DECODED JWT TOKEN
const parseJwt = (token) => {
    let tokenObtained = token;
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let dataDecrypt = JSON.parse(jsonPayload);
    let id = dataDecrypt.id;
    //SEND ID FOR OBTAINED ALL USER DATA, BEFORE ENCRYPT AGAIN
    getAllUserData(id, tokenObtained);
}


//GET ALL DATA FOR USER LOGED
const getAllUserData = (id, tokenObtained) => {

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + tokenObtained);

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(userApiUrl + '/' + id, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => err = error);

    const showData = (dataObtained) => {
        if (dataObtained.body === 'Error de Servidor') {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'Datos incorrectos o sin autorización para acceder',
                footer: 'Este error es generado por el sistema, informa al administrador'
            });
            sessionStorage.removeItem("signInToken");
        }
        else {
            try {
                if (dataObtained.body[0].idrol != 3) {
                    window.location.href = '../../../views/a/dashboard/component';
                }
                else {
                    window.location.href = '../../../views/u/start/component';
                }
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'Sa ha generado un error interno',
                    footer: 'Este error es generado por el sistema, informa al administrador'
                });
                sessionStorage.removeItem("signInToken");
                console.log(err);
            }
        }
    }
}