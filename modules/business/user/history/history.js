//GLOBAL CONST FOR API ROUTES
const globalApiGet = 'http://localhost:3000/api/v1/orders';
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



//GET ID CLIENT
let userInformation = atob(sessionStorage.getItem('sessionInfo'));
userInformation = JSON.parse(userInformation);
let idClientLogged = userInformation[0].id;


//GET PRODUCTS FOR SALE IN USER VIEW
const getOrdersPerClientId = () => {

    let orderNumberSearch = document.getElementById('orderNumberSearch').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    if (orderNumberSearch === '') {
        fetch(globalApiClientFilterById + '/' + idClientLogged + '/all', requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {

                let ordersObtained = '';
                if (dataObtained.body.length === 0 || dataObtained.body == '[]' || dataObtained.body == '') {
                    for (let i = 0; i < 1; i++) {
                        ordersObtained += `
                        <div class="col-sm-12 col-md-12 col-lg-12 mt-4 mb-3 h-100">
                            <div class="card bg-light border-0 shadow rounded-3">
                                <div class="card-body">
                                    <p class="text-muted text-center h5">No existen órdenes con este código, intente con otro</p>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }
                else {
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        ordersObtained += `
                            <div class="col-md-12 col-lg-6 mt-4 mb-3">
                                <a href="../orderInfo/component?q=${dataObtained.body[i].id}" class="text-decoration-none">
                                    <div class="card bg-light border-0 shadow">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col">
                                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}</h5>
                                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay}</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            `;
                    }
                }
                document.getElementById('ordersObtained').innerHTML = ordersObtained;
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    else {
        fetch(globalApiOrderFilterByNumber + '/' + idClientLogged + '/' + orderNumberSearch, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {

                let ordersObtained = '';
                if (dataObtained.body.length === 0 || dataObtained.body == '[]' || dataObtained.body == '') {
                    for (let i = 0; i < 1; i++) {
                        ordersObtained += `
                        <div class="col-sm-12 col-md-12 col-lg-12 mt-4 mb-3 h-100">
                            <div class="card bg-light border-0 shadow rounded-3">
                                <div class="card-body">
                                    <p class="text-muted text-center h5">No existen órdenes con este código, intente con otro</p>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }
                else {
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        ordersObtained += `
                            <div class="col-md-12 col-lg-6 mt-4 mb-3">
                                <a href="../orderInfo/component?q=${dataObtained.body[i].id}" class="text-decoration-none">
                                    <div class="card bg-light border-0 shadow">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col">
                                                    <h5 class="card-title text-muted">Pedido ${dataObtained.body[i].ordernumber}</h5>
                                                    <p class="card-text text-muted fw-bold h5">Q${dataObtained.body[i].totalpay}</p>
                                                </div>
                                                <div class="col text-end">
                                                    <p class="btn btn-secondary">${dataObtained.body[i].status == 1 ? 'Revisando Pago' : dataObtained.body[i].status == 2 ? 'En Proceso' : 'Finalizado'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            `;
                    }
                }
                document.getElementById('ordersObtained').innerHTML = ordersObtained;
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}
getOrdersPerClientId();

