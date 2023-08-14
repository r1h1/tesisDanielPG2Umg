//GLOBAL API URLS
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
        window.location.href = '../../../views/g/login/component';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../views/g/login/component';
    }
    else {
        //CORRECT ACCESS
    }
}
validateToken();

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//GET URL
const urlParams = new URLSearchParams(window.location.search);
//GET ORDER ID
const productOrderToGet = urlParams.get('q');


//GET ORDER INFO
let orderNumber = [];
const getOrderInfoByUrlId = () => {

    const getDate = new Date();
    const year = getDate.getFullYear();
    const month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
    const day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();

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
            orderNumber.push(dataObtained.body[0].ordernumber);
            document.getElementById('generationDate').innerHTML = year + '-' + month + '-' + day;
            document.getElementById('orderNumber').innerHTML = dataObtained.body[0].ordernumber ?? 'No aplica';
            document.getElementById('orderNit').innerHTML = dataObtained.body[0].nitorder ?? 'No aplica';
            document.getElementById('orderName').innerHTML = dataObtained.body[0].nameorder ?? 'No aplica';
            document.getElementById('orderAddress').innerHTML = dataObtained.body[0].addressorder ?? 'No aplica';
            document.getElementById('orderPaymentMethod').innerHTML = dataObtained.body[0].idpayoption === 1 ? 'Pago Efectivo' : dataObtained.body[0].idpayoption === 2 ? 'Pago Transferencia' : 'Pago Tarjeta/PayPal';
            document.getElementById('orderAuth').innerHTML = dataObtained.body[0].bankorpaypalauthnumber === '' ? 'No aplica' : dataObtained.body[0].bankorpaypalauthnumber === null ? 'No aplica' : dataObtained.body[0].bankorpaypalauthnumber;
            document.getElementById('orderPaymentDate').innerHTML = dataObtained.body[0].bankdatepay ?? 'No aplica';
            document.getElementById('orderDate').innerHTML = dataObtained.body[0].createdDate ?? 'No aplica';
            document.getElementById('totalPay').innerHTML = 'Q' + dataObtained.body[0].totalpay.toFixed(2) ?? 'SIN DATOS, REPORTE AL ADMINISTRADOR';
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
                productsPerOrder += `<div class="item-row">
                                        <div class="item-description">Nombre: <span id="productName">${dataObtained.body[i].name}</span></div>
                                        <div class="item-quantity">Cantidad: <span id="productQuantity">${dataObtained.body[i].quantity}</span></div>
                                        <div class="item-price">Precio: <span id="productPrice">Q${dataObtained.body[i].priceproduct.toFixed(2)}</span></div>
                                    </div>`;
            }
            document.getElementById('invoiceProducts').innerHTML = productsPerOrder;
        }
        catch (err) {
            console.log(err);
        }
    }
}
getProductsPerOrderByUrlId();




//PRINT INVOICES AND CLOSE BEFORE PRINTING
const printInvoice = () => {
    var element = document.documentElement;
    var opt = {
        margin: 1,
        filename: 'FACT_' + orderNumber + '_BAKERYGO_SERVICIO.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(element).set(opt).save();
    //GENERATED QR CODE WITH ORDER NUMBER
    new QRious({
        element: document.querySelector("#codigoQR"),
        value: orderNumber[0], // La URL o el texto
        size: 120,
        backgroundAlpha: 0, // 0 para fondo transparente
        foreground: "#000000", // Color del QR
        level: "H", // Puede ser L,M,Q y H (L es el de menor nivel, H el mayor)
    });
}
const closeInvoice = () => {
    window.close();
}


setInterval(printInvoice, 550);
setInterval(closeInvoice, 1000);