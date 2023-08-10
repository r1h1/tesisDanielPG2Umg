//GLOBAL CONST FOR API ROUTES
const globalApiGetProducts = 'http://localhost:3000/api/v1/products';
const globalApiGetExtraIngredients = 'http://localhost:3000/api/v1/productExtraIngredients/ei/';



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



//GET PRODUCT INFO BY ID OBTAINED TO URL
const getProductByIdObtained = () => {

    //GET URL
    const urlParams = new URLSearchParams(window.location.search);
    //GET ID
    const productIdToGet = urlParams.get('q');

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetProducts + '/' + productIdToGet, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            
            document.getElementById('productNameDisplay').innerHTML = dataObtained.body[0].name;
            document.getElementById('nameProductObtained').innerHTML = dataObtained.body[0].name;
            document.getElementById('productDescriptionDisplay').innerHTML = dataObtained.body[0].description;
            document.getElementById('allergyInformation').innerHTML = dataObtained.body[0].allergyinformation;
            document.getElementById('priceProductObtained').innerHTML = dataObtained.body[0].price;

            let baseIngredientsOptions = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                baseIngredientsOptions += `
                    <input type="text" class="form-control" value="${dataObtained.body[i].baseingredients}" id="baseIngredients">
                `;
            }
            document.getElementById('baseIngredientsForProductId').innerHTML = baseIngredientsOptions;
            getExtraIngredientsPerProductId(productIdToGet);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getProductByIdObtained();


//GET EXTRA INGREDIENTS FOR PRODUCT ID
const getExtraIngredientsPerProductId = (productIdToGetExtraIngredients) => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiGetExtraIngredients + productIdToGetExtraIngredients, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {

            let extraIngredientsForm = '';
            if (dataObtained.body.length === 0) {
                for (let i = 0; i < 1; i++) {
                    extraIngredientsForm += `
                        <p class="text-start mt-1 text-muted fw-bold">Este producto no tiene ingredientes extras configurados</p>
                    `;
                }
                document.getElementById('extraIngredientsForProductId').innerHTML = extraIngredientsForm;
            }
            else {
                for (let i = 0; i < dataObtained.body.length; i++) {
                    extraIngredientsForm += `
                    <div class="form-check mt-3">
                        <input class="form-check-input" type="checkbox"
                            id="${dataObtained.body[i].id}">
                        <label class="form-check-label" for="${dataObtained.body[i].id}">
                            ${dataObtained.body[i].name}, Q${dataObtained.body[i].price}
                        </label>
                    </div>
                    `;
                }
            }
            document.getElementById('extraIngredientsForProductId').innerHTML = extraIngredientsForm;
        }
        catch (err) {
            console.log(err);
        }
    }
}


//ADD PRODUCT FOR TEMPORALY SHOP CART IN LOCAL STORAGE
//ADD PRODUCT FOR TEMPORALY SHOP CART IN LOCAL STORAGE
let shoppingCart = [];
const addProductToShoppingCartLocalStorage = () => {

    //GET URL
    const urlParams = new URLSearchParams(window.location.search);
    //GET ID
    const productIdToGet = urlParams.get('q');

    let productName = document.getElementById('nameProductObtained').innerHTML;
    let productDescription = document.getElementById('productDescriptionDisplay').innerHTML;
    let productAllergyInformation = document.getElementById('allergyInformation').innerHTML;
    let productBaseIngredients = document.getElementById('baseIngredientsForProductId').checked;
    let productExtraIngredients = document.getElementById('extraIngredientsForProductId').checked;
    let productQuantity = document.getElementById('quantityProduct').value;
    let userOrderDescription = document.getElementById('userDescription').value;
    let basePriceProduct = document.getElementById('priceProductObtained').innerHTML;
    let newPriceProduct = parseFloat(basePriceProduct) * parseFloat(productQuantity);
    let baseIngredients = document.getElementById('baseIngredients').value;

    let cartItem = {
        productName,
        productDescription,
        productAllergyInformation,
        productBaseIngredients,
        productExtraIngredients,
        productQuantity,
        userOrderDescription,
        newPriceProduct,
        baseIngredients
    };

    shoppingCart.push(cartItem);

    localStorage.setItem('shoppingCartItem' + productIdToGet, JSON.stringify(shoppingCart));

    if (shoppingCart.length > 0) {
        window.location.href = '../../../../views/u/orders/orderNow/component';
    } else {
        shoppingCart = [];
    }
}