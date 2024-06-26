//GLOBAL CONST FOR API ROUTES
const globalApiGetProducts = 'https://h-t3xu.onrender.com/api/v1/products';


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../../index.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../../../index.html';
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
    window.location.href = '../../../../../index.html';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);

//EXECUTE LOOP 1 MINUTE CLEAR LOCAL STORAGE AND REDIRECT
const clearLocalStorageAndRedirect = () => {
    localStorage.clear();
    window.location.href = '../../../../views/u/start/component';
}
setInterval(clearLocalStorageAndRedirect, 60000);



//GET PRODUCTS FOR SALE IN USER VIEW
const getProductsForSale = () => {

    let productNameSearch = document.getElementById('productNameSearch').value;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    if (productNameSearch === '') {
        fetch(globalApiGetProducts, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                let productsForSale = '';
                if (dataObtained.body.length === 0 || dataObtained.body == '[]' || dataObtained.body == '') {
                    for (let i = 0; i < 1; i++) {
                        productsForSale += `
                        <div class="col-sm-12 col-md-12 col-lg-12 mt-4 mb-3 h-100">
                            <div class="card bg-light border-0 shadow rounded-3">
                                <div class="card-body">
                                    <p class="text-muted text-center h5">No hay productos disponibles para su compra, intente en otra ocasión</p>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                }
                else {
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        productsForSale += `
                            <div class="col-sm-6 col-md-4 col-lg-3 mt-4 mb-3">
                                <a href="../selectedProduct/component?q=${dataObtained.body[i].id}" class="text-decoration-none">
                                    <div class="card bg-light border-0 shadow rounded-3 placeholder-glow">
                                        <img src="${dataObtained.body[i].base64img}" alt="pedido" width="100%" height="270" class="mb-3 placeholder-glow rounded-top-3">
                                        <div class="card-body">
                                            <h5 class="card-title text-muted placeholder-glow fw-bold">${dataObtained.body[i].name}</h5>
                                            <p class="text-muted placeholder-glow">${dataObtained.body[i].description}</p>
                                            <p class="card-text text-muted fw-bold h4 text-end placeholder-glow">Q${dataObtained.body[i].price}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            `;
                    }
                }
                document.getElementById('productsForSale').innerHTML = productsForSale;
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    else {
        fetch(globalApiGetProducts + '/searchByName/' + productNameSearch, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log('Error: ' + error))

        const showData = (dataObtained) => {
            try {
                if (dataObtained.body.length === 0 || dataObtained.body == '[]' || dataObtained.body == '') {
                    let productsForSale = '';
                    for (let i = 0; i < 1; i++) {
                        productsForSale += `
                        <div class="col-sm-12 col-md-12 col-lg-12 mt-4 mb-3 h-100">
                            <div class="card bg-light border-0 shadow rounded-3">
                                <div class="card-body">
                                    <p class="text-muted text-center h5">No se encontraron datos, intente con otro nombre</p>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                    document.getElementById('productsForSale').innerHTML = productsForSale;
                }
                else {
                    let productsForSale = '';
                    for (let i = 0; i < dataObtained.body.length; i++) {
                        productsForSale += `
                        <div class="col-sm-6 col-md-4 col-lg-3 mt-4 mb-3">
                            <a href="../selectedProduct/component?q=${dataObtained.body[i].id}" class="text-decoration-none">
                                <div class="card bg-light border-0 shadow rounded-3 placeholder-glow">
                                    <img src="${dataObtained.body[i].base64img}" alt="pedido" width="100%" height="270" class="mb-3 placeholder-glow rounded-top-3">
                                    <div class="card-body">
                                        <h5 class="card-title text-muted placeholder-glow fw-bold">${dataObtained.body[i].name}</h5>
                                        <p class="text-muted placeholder-glow">${dataObtained.body[i].description}</p>
                                        <p class="card-text text-muted fw-bold h4 text-end placeholder-glow">Q${dataObtained.body[i].price}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        `;
                    }
                    document.getElementById('productsForSale').innerHTML = productsForSale;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }
}
getProductsForSale();



// GET SHOPPING CART LOCAL STORAGE
const getShoppingCart = () => {

    const keys = Object.keys(localStorage);
    const values = [];

    document.getElementById('quantityShoppingCart').innerHTML = '-- ' + keys.length + ' Articulo(s) -- <br> Selecciona artículos del menú' +
    '<br> Tienes 1 minuto para completar tu compra';

    keys.forEach(key => {
        values[key] = localStorage.getItem(key);
    });

    if (keys.length === 0) {
        document.getElementById('continuePayOrderButton').style.display = 'none';
    }
    else {
        document.getElementById('continuePayOrderButton').style.display = 'block';
    }

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
