//GLOBAL CONST FOR API ROUTES
const globalApiGetProducts = 'http://localhost:3000/api/v1/products';


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

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);



//SET INFO TO INPUTS
const setInfoToDifferentsPaymentMethods = () => {
    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);

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
}
setInfoToDifferentsPaymentMethods();



// GET SHOPPING CART LOCAL STORAGE
const getShoppingCart = () => {

    const keys = Object.keys(localStorage);
    const values = [];

    document.getElementById('quantityShoppingCart').innerHTML = '-- ' + keys.length + ' Articulo(s) -- <br> Selecciona artículos para tu compra y presiona continuar';

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
                                                <div class="col text-end">
                                                    <p class="btn btn-secondary">Pendiente Pago</p>
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
const getPaymentMethod = () => {

    document.getElementById('paymentCash').style.display = 'none';
    document.getElementById('paymentBankTransfer').style.display = 'none';
    document.getElementById('paymentPayPal').style.display = 'none';

    let paymentCash = document.getElementById('paymentCashFormCheck');
    let paymentBankTransferFormCheck = document.getElementById('paymentBankTransferFormCheck');
    let paymentPayPalFormCheck = document.getElementById('paymentPayPalFormCheck');

    if (paymentCash.checked === true) {
        document.getElementById('paymentCash').style.display = 'block';
        document.getElementById('paymentBankTransfer').style.display = 'none';
        document.getElementById('paymentPayPal').style.display = 'none';
    }
    else if (paymentBankTransferFormCheck.checked === true) {
        document.getElementById('paymentCash').style.display = 'none';
        document.getElementById('paymentBankTransfer').style.display = 'block';
        document.getElementById('paymentPayPal').style.display = 'none';
    }
    else if (paymentPayPalFormCheck.checked === true) {
        document.getElementById('paymentCash').style.display = 'none';
        document.getElementById('paymentBankTransfer').style.display = 'none';
        document.getElementById('paymentPayPal').style.display = 'block';
    }
    else {
        document.getElementById('paymentCash').style.display = 'block   ';
        document.getElementById('paymentBankTransfer').style.display = 'none';
        document.getElementById('paymentPayPal').style.display = 'none';
    }
}
getPaymentMethod();
