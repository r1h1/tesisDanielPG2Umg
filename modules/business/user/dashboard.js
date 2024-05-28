localStorage.clear();

//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../index.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        localStorage.removeItem('shoppingCart');
        window.location.href = '../../../index.html';
    }
    else {
        //CORRECT ACCESS
    }
}

//CLEAR LOCALSTORAGE
const clearLocalStorage = () => {
    localStorage.clear();
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN AND DROP LOCAL STORAGE
setInterval(validateToken, 60000);
setInterval(clearLocalStorage, 3000);



//CLOSE SESSION AND REMOVE SESSION STORAGE ITEMS
const closeSession = () => {
    sessionStorage.removeItem('signInToken');
    sessionStorage.removeItem('sessionInfo');
    window.location.href = '../../../../index.html';
}


//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//SET USER INFO IN ADMIN PANEL
const setUserInfo = () => {
    let userInformation = atob(sessionStorage.getItem('sessionInfo'));
    userInformation = JSON.parse(userInformation);
    document.getElementById('userName').innerHTML = userInformation[0].fullname;
}
setUserInfo();