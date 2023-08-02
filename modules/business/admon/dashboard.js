//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        window.location.href = '../../../views/g/login/component';
    }
    else {
        //CORRECT ACCESS
    }
}
validateToken();



//CLOSE SESSION AND REMOVE SESSION STORAGE ITEMS
const closeSession = () => {
    sessionStorage.removeItem('signInToken');
    window.location.href = '../../../views/g/login/component';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);