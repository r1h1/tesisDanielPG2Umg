//GLOBAL CONST FOR API ROUTES
const globalApiOrders = 'http://localhost:3000/api/v1/orders';
const globalApiProductsPerOrder = 'http://localhost:3000/api/v1/productPerOrder';
const globalApiBank = 'http://localhost:3000/api/v1/banks';


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../views/g/login/component';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../views/g/login/component';
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
    localStorage.clear();
    window.location.href = '../../../../views/g/login/component';
}



//EXECUTE LOOP 1 MINUTE CLEAR LOCAL STORAGE AND REDIRECT
const clearLocalStorageAndRedirect = () => {
    localStorage.clear();
    window.location.href = '../../../../views/u/start/component';
}



//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN AND CLEAR LOCAL STORAGE
setInterval(validateToken, 60000);
setInterval(clearLocalStorageAndRedirect, 60000);



//RANDOM NUMBER GENERATOR FUNCTION
const randomNumberGenerator = () => {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    let result = "";

    for (let i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


//FUNCION PARA GENERAR EL CÓDIGO DE CLIENTE
const orderNumberGenerated = () => {
    document.getElementById("orderNumber").value = 'ON' + randomNumberGenerator();
}
orderNumberGenerated();



//SET INFO TO INPUTS
const setInfoToDifferentsPaymentMethods = () => {

    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);

    const keys = Object.keys(localStorage);

    //SET USER INFO TO PAYMENT CASH
    document.getElementById('userNamePayCash').value = userInformation[0].fullname;
    document.getElementById('userAddressPayCash').value = userInformation[0].address;
    document.getElementById('userNitPayCash').value = userInformation[0].nit;
    document.getElementById('userPhonePayCash').value = userInformation[0].phonenumber;

    //SET USER INFO TO PAYMENT TRANSFER BANK
    document.getElementById('userNamePaymentBank').value = userInformation[0].fullname;
    document.getElementById('userAddressPaymentBank').value = userInformation[0].address;
    document.getElementById('userNitPaymentBank').value = userInformation[0].nit;
    document.getElementById('userPhonePaymentBank').value = userInformation[0].phonenumber;

    //SET USER INFO TO PAYMENT PAYPAL
    document.getElementById('userNamePayPal').value = userInformation[0].fullname;
    document.getElementById('userAddressPayPal').value = userInformation[0].address;
    document.getElementById('userNitPayPal').value = userInformation[0].nit;
    document.getElementById('userPhonePayPal').value = userInformation[0].phonenumber;

    //SET TOTAL PRODUCT OF PAY IN RESUME
    document.getElementById('productQuantityPayCash').innerHTML = keys.length;
    document.getElementById('productQuantityPaymentBank').innerHTML = keys.length;
    document.getElementById('productQuantityPayPal').innerHTML = keys.length;
}
setInfoToDifferentsPaymentMethods();



// GET SHOPPING CART LOCAL STORAGE
const getShoppingCart = () => {

    const keys = Object.keys(localStorage);
    const values = [];

    document.getElementById('quantityShoppingCart').innerHTML = '-- ' + keys.length + ' Articulo(s) -- <br> ' +
        'Selecciona artículos para tu compra y presiona <br> continuar en el método de pago que prefieras' +
        '<br><br> Tienes 1 minuto para completar tu compra';

    keys.forEach(key => {
        values[key] = localStorage.getItem(key);
    });

    let articlesForShopping = '';
    for (let i = 0; i < keys.length; i++) {

        const key = keys[i];
        const storedValue = localStorage.getItem(key);

        let parsedValue = '';
        if (storedValue) {
            parsedValue = JSON.parse(storedValue);
        } else {
            console.log(`No se encontró ningún valor para la clave ${key}`);
        }

        articlesForShopping += `<div class="col-md-12 col-lg-12 mt-4 mb-3">
                                    <div class="card bg-light border-0 shadow">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col">
                                                    <p class="card-text text-start text-muted fw-bold h5">${parsedValue[0].productQuantity}</p>
                                                    <h5 class="card-title text-start text-muted">${parsedValue[0].productName}</h5>
                                                    <p class="card-text text-start text-muted fw-bold h5">Q${parsedValue[0].newPriceProduct}</p>
                                                </div>
                                                <div class="col text-end mt-3 mb-3">
                                                    <p class="btn btn-secondary">Pendiente del pago correspondiente</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
    }
    document.getElementById('articlesForShopping').innerHTML = articlesForShopping;
}
getShoppingCart();



//GET PAYMENT OPTION CHECKED AND NOT CHECKED
const hideAllPaymentMethods = () => {
    document.getElementById('paymentCash').style.display = 'none';
    document.getElementById('paymentBankTransfer').style.display = 'none';
    document.getElementById('paymentPayPal').style.display = 'none';
};

const getPaymentMethod = () => {
    const paymentCash = document.getElementById('paymentCashFormCheck');
    const paymentBankTransfer = document.getElementById('paymentBankTransferFormCheck');
    const paymentPayPal = document.getElementById('paymentPayPalFormCheck');
    const paymentTypeInput = document.getElementById('paymentType');

    hideAllPaymentMethods();

    if (paymentCash.checked) {
        document.getElementById('paymentCash').style.display = 'block';
        paymentTypeInput.value = 1;
    } else if (paymentBankTransfer.checked) {
        document.getElementById('paymentBankTransfer').style.display = 'block';
        paymentTypeInput.value = 2;
    } else if (paymentPayPal.checked) {
        document.getElementById('paymentPayPal').style.display = 'block';
        paymentTypeInput.value = 3;
    } else {
        document.getElementById('paymentCash').style.display = 'block';
        paymentTypeInput.value = 1;
    }
};
getPaymentMethod();



// SET TOTAL PRICE PAY IN RESUME PAYMENT METHOD
const setTotalOfPayInResumePaymentMethod = () => {

    const keys = Object.keys(localStorage);
    const values = [];

    keys.forEach(key => {
        values[key] = localStorage.getItem(key);
    });

    let totalOfPay = 0;
    for (let i = 0; i < keys.length; i++) {

        const key = keys[i];
        const storedValue = localStorage.getItem(key);

        let parsedValue = '';
        if (storedValue) {
            parsedValue = JSON.parse(storedValue);
        } else {
            console.log(`No se encontró ningún valor para la clave ${key}`);
        }

        totalOfPay = totalOfPay + parseFloat(parsedValue[0].newPriceProduct);
    }

    document.getElementById('productTotalPayCash').innerHTML = 'Q' + totalOfPay.toFixed(2);
    document.getElementById('productTotalPayPal').innerHTML = 'Q' + totalOfPay.toFixed(2);
    document.getElementById('productTotalPaymentBank').innerHTML = 'Q' + totalOfPay.toFixed(2);
    document.getElementById('totalPayment').value = totalOfPay.toFixed(2);
}
setTotalOfPayInResumePaymentMethod();



//CONVERT FILE CHOOSEN TO BASE64 FOR SAVE IN DB
const convertImgToBase64 = () => {

    const userVoucherPhotoPaymentBank = document.getElementById('userVoucherPhotoPaymentBank');

    userVoucherPhotoPaymentBank.addEventListener("change", e => {
        const file = userVoucherPhotoPaymentBank.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let imageRoute = reader.result;
            let sizeImage = file.size;

            if (sizeImage > 60000) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La imagen supera el peso permitido, comprimala con la herramienta que se muestra abajo, intente de nuevo o seleccione otra imagen para continuar (MAX 60 KB)',
                    footer: '<a href="https://tinyjpg.com/" target="_blank">Presione acá para ser redirigido al compresor de imágenes</a>',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('photoBase64Product').value = '';
                document.getElementById('userVoucherPhotoPaymentBank').value = '';
            }
            else {
                document.getElementById('photoBase64Product').value = imageRoute;
            }
        });
        reader.readAsDataURL(file);
    });
}
convertImgToBase64();



//SET CASH DATA 
var dataPay = [];
const setCashDataAfterCreatedOrder = (paymentType) => {

    let userName = document.getElementById('userNamePayCash').value;
    let userAddress = document.getElementById('userAddressPayCash').value;
    let userNit = document.getElementById('userNitPayCash').value;
    let userPhone = document.getElementById('userPhonePayCash').value;
    let totalPay = document.getElementById('totalPayment').value;

    if (userName === '' || userAddress === '' || userNit === '' || userPhone === '' || totalPay === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        dataPay = [];
        dataPay.push([paymentType, userName, userAddress, userNit, userPhone, totalPay]);
        createOrder();
    }
}


//SET BANK DATA
const setBankDataAfterCreatedOrder = (paymentType) => {

    let userName = document.getElementById('userNamePaymentBank').value;
    let userAddress = document.getElementById('userAddressPaymentBank').value;
    let userNit = document.getElementById('userNitPaymentBank').value;
    let userPhone = document.getElementById('userPhonePaymentBank').value;
    let totalPay = document.getElementById('totalPayment').value;
    let voucherPayment = document.getElementById('photoBase64Product').value;
    let userVoucherDatePaymentBank = document.getElementById('userVoucherDatePaymentBank').value;
    let userVoucherNumberAuthorizationPaymentBank = document.getElementById('userVoucherNumberAuthorizationPaymentBank').value;

    if (userName === '' || userAddress === '' || userNit === '' || userPhone === '' || totalPay === ''
        || voucherPayment === '' || userVoucherDatePaymentBank === '' || userVoucherNumberAuthorizationPaymentBank === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        dataPay = [];
        dataPay.push([paymentType, userName, userAddress, userNit, userPhone, totalPay, userVoucherDatePaymentBank, userVoucherNumberAuthorizationPaymentBank]);
        createOrder();
    }
}


//SET PAYPAL DATA
const setPayPalDataAfterCreatedOrder = (paymentType) => {

    let userName = document.getElementById('userNamePayPal').value;
    let userAddress = document.getElementById('userAddressPayPal').value;
    let userNit = document.getElementById('userNitPayPal').value;
    let userPhone = document.getElementById('userPhonePayPal').value;
    let totalPay = document.getElementById('totalPayment').value;
    let userVoucherNumberPayPal = document.getElementById('userVoucherNumberPayPal').value;

    if (userName === '' || userAddress === '' || userNit === '' || userPhone === '' || totalPay === '' || userVoucherNumberPayPal === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        dataPay = [];
        dataPay.push([paymentType, userName, userAddress, userNit, userPhone, totalPay, userVoucherNumberPayPal]);
        createOrder();
    }
}



//CREATE ORDER BY PAYMENT DATA IS CORRECTLY
const createOrder = () => {

    const keys = Object.keys(localStorage);
    const values = [];

    keys.forEach(key => {
        values[key] = localStorage.getItem(key);
    });

    if (dataPay.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Debe seleccionar un método de pago para continuar',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (keys.length === 0) {
        localStorage.clear();
        window.location.href = '../../../../views/u/start/component';
    }
    else {

        let base64payfile = document.getElementById('photoBase64Product').value;
        let userInformation = atob(sessionStorage.getItem('sessionInfo'));
        userInformation = JSON.parse(userInformation);

        let orderNumber = document.getElementById("orderNumber").value;

        const getDate = new Date();
        const year = getDate.getFullYear();
        const month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
        const day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "ordernumber": orderNumber ?? '0',
            "status": 1,
            "totalpay": dataPay[0][5] ?? '',
            "idpayoption": dataPay[0][0] ?? '',
            "idclient": userInformation[0].id ?? '',
            "nameorder": dataPay[0][1] ?? '',
            "nitorder": dataPay[0][3] ?? '',
            "addressorder": dataPay[0][2] ?? '',
            "phoneorder": dataPay[0][4] ?? '',
            "bankdateofpay": dataPay[0][6] ?? '',
            "bankorpaypalauthnumber": dataPay[0][7] ?? dataPay[0][6],
            "createdDate": year + '-' + month + '-' + day,
            "finishDate": year + '-' + month + '-' + day,
            "base64payfile": base64payfile,
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiOrders, requestOptions)
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
                        insertProductsPerOrder(dataObtained.body.insertId, orderNumber);
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
                        text: 'Sa ha generado un error desconocido',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
        }
    }
}


//INSERT PRODUCT AND MORE INFO TO ORDER FINISHED
const insertProductsPerOrder = (idOrder, orderNumber) => {

    if (idOrder === '' || orderNumber === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Sa ha generado un error interno',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        const keys = Object.keys(localStorage);
        const values = [];

        keys.forEach(key => {
            values[key] = localStorage.getItem(key);
        });

        for (let i = 0; i < keys.length; i++) {

            const key = keys[i];
            const storedValue = localStorage.getItem(key);

            let parsedValue = '';
            if (storedValue) {
                parsedValue = JSON.parse(storedValue);
            } else {
                console.log(`No se encontró ningún valor para la clave ${key}`);
            }

            console.log(parsedValue[0]);

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var raw = JSON.stringify({
                "idproduct": parseInt(parsedValue[0].idProductSelected),
                "quantity": parseInt(parsedValue[0].productQuantity),
                "priceproduct": parseFloat(parsedValue[0].newPriceProduct),
                "baseingredientsselected": parsedValue[0].baseIngredients,
                "idextraingredients": "",
                "description": parsedValue[0].userOrderDescription,
                "idorder": idOrder ?? '',
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(globalApiProductsPerOrder, requestOptions)
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
                            window.location.href = '../../../../views/u/orders/payConfirmed/component?q=' + orderNumber;
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
                            text: 'Sa ha generado un error desconocido',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        }
    }
}



//GET BANKS
const getBanks = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiBank, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let bankAccounts = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                bankAccounts += `<div class="card bg-light border-0 shadow mb-3">
                                    <div class="card-body">
                                        <p class="card-text text-start text-muted fw-bold h5">${dataObtained.body[i].accountNumber}</p>
                                        <p class="card-text text-start text-muted fw-bold h5">${dataObtained.body[i].bankname}</p>
                                        <h5 class="card-title text-start text-muted">${dataObtained.body[i].userbankname}</h5>
                                        <p class="card-text text-start text-muted fw-bold h5">${dataObtained.body[i].accountType}</p>
                                    </div>
                                </div>`;
            }
            document.getElementById('bankAccounts').innerHTML = bankAccounts;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getBanks();



