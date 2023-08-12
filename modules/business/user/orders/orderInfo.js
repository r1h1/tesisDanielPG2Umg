//GLOBAL CONST FOR API ROUTES
const globalApiGetOrders = 'http://localhost:3000/api/v1/orders';
const globalApiGetProductPerOrder = 'http://localhost:3000/api/v1/productPerOrder/orderId/';
const globalApiOrderFilterByNumber = 'http://localhost:3000/api/v1/orders/orderFilter';
const globalApiClientFilterById = 'http://localhost:3000/api/v1/orders/clientFilter';



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
}


//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);
setInterval(clearLocalStorageAndRedirect, 60000);



//GET URL
const urlParams = new URLSearchParams(window.location.search);
//GET ORDER ID
const productOrderToGet = urlParams.get('q');


//GET ORDER INFO
const getOrderInfoByUrlId = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetOrders + '/' + productOrderToGet, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {

            document.getElementById('actualStatus').innerHTML = dataObtained.body[0].status === 1 ? 'Revisando Pago' : dataObtained.body[0].status === 2 ? 'En Proceso' : dataObtained.body[0].status === 3 ? 'Finalizado' : 'Finalizado';
            document.getElementById('orderNumber').innerHTML = dataObtained.body[0].ordernumber;
            document.getElementById('totalPay').innerHTML = 'Q' + dataObtained.body[0].totalpay;
            document.getElementById('paymentType').innerHTML = dataObtained.body[0].idpayoption === 1 ? 'Pago Efectivo' : dataObtained.body[0].idpayoption === 2 ? 'Pago Transferencia' : 'Pago Tarjeta/PayPal';
            document.getElementById('orderNit').innerHTML = dataObtained.body[0].nitorder;
            document.getElementById('orderAddress').innerHTML = dataObtained.body[0].addressorder;
            document.getElementById('orderName').innerHTML = dataObtained.body[0].nameorder;

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
getOrderInfoByUrlId();




const getProductsPerOrderByUrlId = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetProductPerOrder + productOrderToGet, requestOptions)
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