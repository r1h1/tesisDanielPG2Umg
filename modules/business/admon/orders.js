//GLOBAL CONST FOR API ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/products';
const globalApiGetModulesPerRol = 'http://localhost:3000/api/v1/modules/rol/';
const globalApiGetOrders = 'http://localhost:3000/api/v1/orders';
const globalApiGetProductPerOrder = 'http://localhost:3000/api/v1/productPerOrder/orderId/';
const globalApiOrderFilterByNumber = 'http://localhost:3000/api/v1/orders/orderFilter';
const globalApiClientFilterById = 'http://localhost:3000/api/v1/orders/clientFilter';


//VALIDATE EXIST TOKEN IN SESSION STORAGE
//FUNCTION TO VALIDATE DATA TOKEN
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
}


//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);
setInterval(clearLocalStorageAndRedirect, 60000);



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



//GET ORDERS
const getOrders = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let pendingOrders = '';
            let finishOrders = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].status === 2 || dataObtained.body[i].status === 1) {
                    pendingOrders += `<div class="col-md-12 col-lg-6 mt-4 mb-3">
                    <div class="card bg-light border-0 shadow" data-bs-toggle="modal"
                        data-bs-target="#modalOrderInfo" onclick="getOrderInfoByUrlId(${dataObtained.body[i].id})">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title text-muted">${dataObtained.body[i].id}</h5>
                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}
                                    </h5>
                                    <p>${dataObtained.body[i].createdDate}</p>
                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay.toFixed(2)}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
                else {
                    finishOrders += `<div class="col-md-12 col-lg-6 mt-4 mb-3">
                    <div class="card bg-light border-0 shadow" data-bs-toggle="modal"
                        data-bs-target="#modalOrderInfo" onclick="getOrderInfoByUrlId(${dataObtained.body[i].id})">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title text-muted">${dataObtained.body[i].id}</h5>
                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}
                                    </h5>
                                    <p>${dataObtained.body[i].createdDate}</p>
                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay.toFixed(2)}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
            }
            document.getElementById('pendingOrders').innerHTML = pendingOrders;
            document.getElementById('finishOrders').innerHTML = finishOrders;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getOrders();


//GET ONE PENDING ORDER
const getOnePendingOrder = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {

            let searchOrderPending = document.getElementById('orderNumberSearchPending').value.toString();
            let pendingOrders = '';

            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].ordernumber === searchOrderPending) {
                    pendingOrders += `<div class="col-md-12 col-lg-6 mt-4 mb-3">
                    <div class="card bg-light border-0 shadow" data-bs-toggle="modal"
                        data-bs-target="#modalOrderInfo" onclick="getOrderInfoByUrlId(${dataObtained.body[i].id})">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title text-muted">${dataObtained.body[i].id}</h5>
                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}
                                    </h5>
                                    <p>${dataObtained.body[i].createdDate}</p>
                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay.toFixed(2)}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
                else if (searchOrderPending === '') {
                    document.getElementById('orderNumberSearchPending').value = '';
                    getOrders();
                }
            }
            document.getElementById('pendingOrders').innerHTML = pendingOrders;
        }
        catch (err) {
            console.log(err);
        }
    }
}


//GET ONE PENDING ORDER
const getOneFinishOrder = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {

            let searchOrderFinish = document.getElementById('orderNumberSearchFinish').value.toString();
            let finishOrders = '';

            for (let i = 0; i < dataObtained.body.length; i++) {
                if (dataObtained.body[i].ordernumber === searchOrderFinish && dataObtained.body[i].status === 3) {
                    finishOrders += `<div class="col-md-12 col-lg-6 mt-4 mb-3">
                    <div class="card bg-light border-0 shadow" data-bs-toggle="modal"
                        data-bs-target="#modalOrderInfo" onclick="getOrderInfoByUrlId(${dataObtained.body[i].id})">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title text-muted">${dataObtained.body[i].id}</h5>
                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}
                                    </h5>
                                    <p>${dataObtained.body[i].createdDate}</p>
                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay.toFixed(2)}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
                else if (searchOrderFinish === '' && dataObtained.body[i].status === 3) {
                    finishOrders += `<div class="col-md-12 col-lg-6 mt-4 mb-3">
                    <div class="card bg-light border-0 shadow" data-bs-toggle="modal"
                        data-bs-target="#modalOrderInfo" onclick="getOrderInfoByUrlId(${dataObtained.body[i].id})">
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <h5 class="card-title text-muted">${dataObtained.body[i].id}</h5>
                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}
                                    </h5>
                                    <p>${dataObtained.body[i].createdDate}</p>
                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay.toFixed(2)}</p>
                                </div>
                                <div class="col text-end">
                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                }
                document.getElementById('finishOrders').innerHTML = finishOrders;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}


//GET ORDER INFO
const getOrderInfoByUrlId = (idToGet) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders + '/' + idToGet, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            document.getElementById('idOrderSelected').value = idToGet;
            document.getElementById('actualStatus').innerHTML = dataObtained.body[0].status === 1 ? 'Revisando Pago' : dataObtained.body[0].status === 2 ? 'En Proceso' : dataObtained.body[0].status === 3 ? 'Finalizado' : 'Finalizado';
            document.getElementById('totalPay').innerHTML = 'Q' + dataObtained.body[0].totalpay;
            document.getElementById('paymentType').innerHTML = dataObtained.body[0].idpayoption === 1 ? 'Pago Efectivo' : dataObtained.body[0].idpayoption === 2 ? 'Pago Transferencia' : 'Pago Tarjeta/PayPal';
            document.getElementById('orderNit').innerHTML = dataObtained.body[0].nitorder ?? 'No aplica';
            document.getElementById('orderAddress').innerHTML = dataObtained.body[0].addressorder ?? 'No aplica';
            document.getElementById('orderName').innerHTML = dataObtained.body[0].nameorder ?? 'No aplica';
            document.getElementById('orderAuthNumber').innerHTML = dataObtained.body[0].bankorpaypalauthnumber === '' ? 'No aplica' : dataObtained.body[0].bankorpaypalauthnumber === null ? 'No aplica' : dataObtained.body[0].bankorpaypalauthnumber;
            document.getElementById('orderDateOfPay').innerHTML = dataObtained.body[0].bankdateofpay ?? 'No aplica';
            document.getElementById('orderCreated').innerHTML = dataObtained.body[0].createdDate ?? 'No aplica';
            document.getElementById('orderPhone').innerHTML = dataObtained.body[0].phoneorder ?? 'No aplica';

            if (dataObtained.body[0].base64payfile === '') {
                document.getElementById('paymentVoucher').innerHTML = 'Sin comprobante de pago';
            }
            else {
                document.getElementById('paymentVoucher').innerHTML = `<img src="${dataObtained.body[0].base64payfile}" alt='payment-img' width="80%">`;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}



//GET PRODUCTS PER ORDEN ID
const getProductsPerOrderByUrlId = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetProductPerOrder + 1, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            let productsPerOrder = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                productsPerOrder += `<div class="card-body">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <p class="card-text text-start text-muted fw-bold h5">Cantidad: ${dataObtained.body[i].quantity}</p>
                                                <h5 class="card-title text-start text-muted">Nombre: ${dataObtained.body[i].name}</h5>
                                                <h6 class="card-title text-start text-muted">Ingredientes: ${dataObtained.body[i].baseingredientsselected}</h6>
                                                <h6 class="card-title text-start text-muted">Ingredientes Extras: ${dataObtained.body[i].idextraingredients === '' ? 'Sin extras' : dataObtained.body[i].idextraingredients}</h6>
                                                <h6 class="card-title text-start text-muted">Nota: ${dataObtained.body[i].description === '' ? 'Sin descripción' : dataObtained.body[i].description}</h6>
                                                <p class="card-text text-start text-muted fw-bold h5">Q${dataObtained.body[i].priceproduct.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>`;
            }
            document.getElementById('productsPerOrder').innerHTML = productsPerOrder;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getProductsPerOrderByUrlId();




//UPDATE STATUS OF ORDER
const updateOrderStatus = () => {

    let orderIdSelected = document.getElementById('idOrderSelected').value;
    let selectStatus = document.getElementById('selectOrderStatus').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": orderIdSelected,
        "status": selectStatus
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders, requestOptions)
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
                            window.location.href = '../../../views/a/orders/component';
                        } else if (result.isDenied) {
                            window.location.href = '../../../views/a/orders/component';
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