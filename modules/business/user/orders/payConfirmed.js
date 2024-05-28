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


const clearLocalStorage = () => {
    localStorage.clear();
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN AND DROP LOCAL STORAGE
setInterval(validateToken, 60000);
setInterval(clearLocalStorage, 2000);




//SET ORDER NUMBER TO DISPLAY
const setOrderNumber = () => {

    //GET URL
    const urlParams = new URLSearchParams(window.location.search);
    //GET ORDER NUMBER
    const productOrderToGet = urlParams.get('q');

    if (productOrderToGet === '') {
        closeSession();
    }
    else if (productOrderToGet != '') {
        document.getElementById('orderNumberDisplay').innerHTML = productOrderToGet;
    }
    else {
        closeSession();
    }
}
setOrderNumber();