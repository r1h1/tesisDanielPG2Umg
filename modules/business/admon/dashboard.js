//ROUTES
const globalApiUrl = 'https://h-t3xu.onrender.com/api/v1/products';
const globalApiOrdersUrl = 'https://h-t3xu.onrender.com/api/v1/orders';
const globalApiSalesClientUrl = 'https://h-t3xu.onrender.com/api/v1/orders/salesClient';
const globalApiSalesProductUrl = 'https://h-t3xu.onrender.com/api/v1/orders/salesProduct';
const globalApiGetModulesPerRol = 'https://h-t3xu.onrender.com/api/v1/modules/rol/';


//GLOBAL VARIABLE FOR GET DATE TODAY
let actualMonth;
let actualDay;
let actualYear;


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {

    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');

    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        window.location.href = '../../../index.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../../index.html';
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
    window.location.href = '../../../index.html';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


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



//SET TODAY DATE IN DAY AND MONTH ORDERS AND MONEY
const setActualDayAndActualMonth = () => {

    const getDate = new Date();
    const year = getDate.getFullYear();
    const month = (getDate.getMonth() + 1) < 10 ? '0' + (getDate.getMonth() + 1) : (getDate.getMonth() + 1);
    const day = getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate();

    document.getElementById('startDateOrdersDay').value = year + '-' + month + '-' + day;
    document.getElementById('endDateOrdersDay').value = year + '-' + month + '-' + day;
    document.getElementById('startDateMoneyDay').value = year + '-' + month + '-' + day;
    document.getElementById('endDateMoneyDay').value = year + '-' + month + '-' + day;
    document.getElementById('dateMonthOrders').selectedIndex = month - 1;
    document.getElementById('dateMonthMoney').selectedIndex = month - 1;

    actualDay = day;
    actualMonth = month;
    actualYear = year;

    console.log('Fecha Actual: ' + year + '-' + month + '-' + day);

}
setActualDayAndActualMonth();



//GET ORDERS PER DAY
const getOrdersPerDayAndMakeAChart = () => {

    let startDateOrdersDay = document.getElementById('startDateOrdersDay').value;
    let endDateOrdersDay = document.getElementById('endDateOrdersDay').value;

    if (startDateOrdersDay === '' || endDateOrdersDay === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(globalApiOrdersUrl + '/' + startDateOrdersDay + '/' + endDateOrdersDay, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {

                document.getElementById('totalOrdersDay').innerHTML = dataObtained.body.length;
                const chartOrdersDay = document.getElementById('chartOrdersDay');

                new Chart(chartOrdersDay, {
                    type: 'bar',
                    data: {
                        labels: ['Cantidad Ordenes'],
                        datasets: [{
                            label: 'Pedidos Por Día - Gráfica',
                            data: [dataObtained.body.length],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                console.log(err)
            }
        }
    }
}
getOrdersPerDayAndMakeAChart();


//GET ORDERS PER MONTH
const getOrdersPerMonthAndMakeAChart = () => {

    if (actualDay === '' || actualMonth === '' || actualYear === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let startActualMonthRequest = actualYear + '-' + actualMonth + '-' + '01';
        let endActualMonthRequest = actualYear + '-' + actualMonth + '-' + '31';

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(globalApiOrdersUrl + '/' + startActualMonthRequest + '/' + endActualMonthRequest, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {

                document.getElementById('totalOrdersMonth').innerHTML = dataObtained.body.length;
                const chartOrdersMonth = document.getElementById('chartOrdersMonth');

                new Chart(chartOrdersMonth, {
                    type: 'bar',
                    data: {
                        labels: ['Cantidad Ordenes'],
                        datasets: [{
                            label: 'Pedidos Por Mes - Gráfica',
                            data: [dataObtained.body.length],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                console.log(err)
            }
        }
    }
}
getOrdersPerMonthAndMakeAChart();


//GET Money PER DAY
const getMoneyPerDayAndMakeAChart = () => {

    let startDateMoneyDay = document.getElementById('startDateMoneyDay').value;
    let endDateMoneyDay = document.getElementById('endDateMoneyDay').value;

    if (startDateMoneyDay === '' || endDateMoneyDay === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(globalApiOrdersUrl + '/' + startDateMoneyDay + '/' + endDateMoneyDay, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {

                let totalMoneyPerDay = 0;

                for (let i = 0; i < dataObtained.body.length; i++) {
                    totalMoneyPerDay = totalMoneyPerDay + parseInt(dataObtained.body[i].totalpay);
                }

                document.getElementById('totalMoneyDay').innerHTML = 'Q' + parseFloat(totalMoneyPerDay);
                const chartMoneyDay = document.getElementById('chartMoneyDay');

                new Chart(chartMoneyDay, {
                    type: 'bar',
                    data: {
                        labels: ['Cantidad Dinero'],
                        datasets: [{
                            label: 'Dinero por día',
                            data: [totalMoneyPerDay],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                console.log(err)
            }
        }
    }
}
getMoneyPerDayAndMakeAChart();


//GET Money PER MONTH
const getMoneyPerMonthAndMakeAChart = () => {

    if (actualDay === '' || actualMonth === '' || actualYear === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let startActualMonthRequest = actualYear + '-' + actualMonth + '-' + '01';
        let endActualMonthRequest = actualYear + '-' + actualMonth + '-' + '31';

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(globalApiOrdersUrl + '/' + startActualMonthRequest + '/' + endActualMonthRequest, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {

                let totalMoneyPerMonth = 0;

                for (let i = 0; i < dataObtained.body.length; i++) {
                    totalMoneyPerMonth = totalMoneyPerMonth + parseInt(dataObtained.body[i].totalpay);
                }

                document.getElementById('totalMoneyMonth').innerHTML = 'Q' + parseFloat(totalMoneyPerMonth);
                const chartMoneyMonth = document.getElementById('chartMoneyMonth');

                new Chart(chartMoneyMonth, {
                    type: 'bar',
                    data: {
                        labels: ['Cantidad Dinero'],
                        datasets: [{
                            label: 'Dinero por mes',
                            data: [totalMoneyPerMonth],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                console.log(err)
            }
        }
    }
}
getMoneyPerMonthAndMakeAChart();



