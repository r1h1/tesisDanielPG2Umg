//ROUTES
const globalApiUrl = 'https://h-t3xu.onrender.com/api/v1/users';


//CREATE NEW USER SIGN UP
const signUpUser = () => {

    let userName = document.getElementById('userName').value;
    let cellPhone = document.getElementById('cellPhone').value;
    let address = document.getElementById('address').value;
    let email = document.getElementById('email').value;
    let nit = document.getElementById('nit').value;
    let gender = document.getElementById('genderSelect').value;
    let password = document.getElementById('password').value;
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
            "idrol": 3,
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
                            text: 'La operación de completó con éxito, ya puedes acceder',
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
                        sessionStorage.removeItem("signInToken");
                        sessionStorage.removeItem("sessionInfo");
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