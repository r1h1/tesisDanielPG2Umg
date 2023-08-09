//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/orders';
const globalApiSalesClientUrl = 'http://localhost:3000/api/v1/orders/salesClient';
const globalApiSalesProductUrl = 'http://localhost:3000/api/v1/orders/salesProduct'


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {
    let token = sessionStorage.getItem('signInToken');
    let userInformation = sessionStorage.getItem('sessionInfo');
    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        window.location.href = '../../../views/g/login/component';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('sessionInfo');
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
    sessionStorage.removeItem('sessionInfo');
    window.location.href = '../../../views/g/login/component';
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


//GET QUANTITY OF MONEY WITH RANGE OF DATES
const getMoneyWithRangeOfDates = () => {

    let startDateMoney = document.getElementById('startDateMoney').value;
    let endDateMoney = document.getElementById('endDateMoney').value;

    if (startDateMoney === '' || endDateMoney === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
        document.getElementById('dataCompleteReportMoneyQuantity').value = 0;
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

        fetch(globalApiUrl + '/' + startDateMoney + '/' + endDateMoney, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {
                addDataToDataTableMoneyQuantity(dataObtained);
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('moneyQuantityTable').style.display = 'none';
                document.getElementById('startDateMoney').value = 'yyyy-MM-dd';
                document.getElementById('endDateMoney').value = 'yyyy-MM-dd';
                document.getElementById('dataCompleteReportMoneyQuantity').value = 0;
            }
        }
    }
}

//GET SALES PER CLIENTS WITH RANGE OF DATES
const getSalesClientWithRangeOfDates = () => {

    let startDateSalesClient = document.getElementById('startDateSalesClient').value;
    let endDateSalesClient = document.getElementById('endDateSalesClient').value;

    if (startDateSalesClient === '' || endDateSalesClient === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
        document.getElementById('dataCompleteReportMoneyQuantity').value = 0;
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

        fetch(globalApiSalesClientUrl + '/' + startDateSalesClient + '/' + endDateSalesClient, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {
                addDataToDataTableSalesClient(dataObtained);
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('salesClientTable').style.display = 'none';
                document.getElementById('startDateSalesClient').value = 'yyyy-MM-dd';
                document.getElementById('endDateSalesClient').value = 'yyyy-MM-dd';
                document.getElementById('dataCompleteReportSalesClient').value = 0;
            }
        }
    }
}


//GET SALES PRODUCT WITH RANGE OF DATES
const getSalesProductWithRangeOfDates = () => {

    let startDateSalesProduct = document.getElementById('startDateSalesProduct').value;
    let endDateSalesProduct = document.getElementById('endDateSalesProduct').value;

    if (startDateSalesProduct === '' || endDateSalesProduct === '') {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Debes seleccionar una fecha de inicio y una fecha final',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
        document.getElementById('dataCompleteReportSalesProduct').value = 0;
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

        fetch(globalApiSalesProductUrl + '/' + startDateSalesProduct + '/' + endDateSalesProduct, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => console.log(error));

        const showData = (dataObtained) => {
            try {
                addDataToDataTableSalesProduct(dataObtained);
            }
            catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se encontró información en el rango de fechas seleccionado',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('salesProductTable').style.display = 'none';
                document.getElementById('startDateSalesProduct').value = 'yyyy-MM-dd';
                document.getElementById('endDateSalesProduct').value = 'yyyy-MM-dd';
                document.getElementById('dataCompleteReportSalesProduct').value = 0;
            }
        }
    }
}



//PRINT ALL DATA TO DATATABLE OF MONEY QUANTITY
const addDataToDataTableMoneyQuantity = (dataObtained) => {

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase(),
            confirmButtonText: 'Entendido'
        });
        document.getElementById('moneyQuantityTable').style.display = 'none';
        document.getElementById('startDateMoney').value = 'yyyy-MM-dd';
        document.getElementById('endDateMoney').value = 'yyyy-MM-dd';
        document.getElementById('dataCompleteReportMoneyQuantity').value = 0;
    }
    else {
        try {

            document.getElementById('moneyQuantityTable').style.display = 'block';
            document.getElementById('dataCompleteReportMoneyQuantity').value = 1;

            let moneyData = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                moneyData += `
                <tr>
                    <td class="text-muted">${dataObtained.body[i].ordernumber}</td>
                    <td class="text-muted">Q${dataObtained.body[i].totalpay}</td>
                    <td class="text-muted">${dataObtained.body[i].createdDate}</td>
                    <td class="text-muted">${dataObtained.body[i].finishDate}</td>
                </tr>`;
            }
            document.getElementById('moneyQuantityOrderReport').innerHTML = moneyData;
        }
        catch {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se encontró información en el rango de fechas seleccionado',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
            document.getElementById('moneyQuantityTable').style.display = 'none';
            document.getElementById('startDateMoney').value = 'yyyy-MM-dd';
            document.getElementById('endDateMoney').value = 'yyyy-MM-dd';
            document.getElementById('dataCompleteReportMoneyQuantity').value = 0;
        }
    }
}


//PRINT ALL DATA TO DATATABLE OF SALES CLIENT
const addDataToDataTableSalesClient = (dataObtained) => {

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase(),
            confirmButtonText: 'Entendido'
        });
        document.getElementById('salesClientTable').style.display = 'none';
        document.getElementById('startDateSalesClient').value = 'yyyy-MM-dd';
        document.getElementById('endDateSalesClient').value = 'yyyy-MM-dd';
        document.getElementById('dataCompleteReportSalesClient').value = 0;
    }
    else {
        try {

            document.getElementById('salesClientTable').style.display = 'block';
            document.getElementById('dataCompleteReportSalesClient').value = 1;

            let salesClientData = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                salesClientData += `
                <tr>
                    <td class="text-muted">${dataObtained.body[i].ordernumber}</td>
                    <td class="text-muted">Q${dataObtained.body[i].totalpay}</td>
                    <td class="text-muted">${dataObtained.body[i].createdDate}</td>
                    <td class="text-muted">${dataObtained.body[i].finishDate}</td>
                    <td class="text-muted">${dataObtained.body[i].fullname}</td>
                </tr>`;
            }
            document.getElementById('salesClientReport').innerHTML = salesClientData;
        }
        catch {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se encontró información en el rango de fechas seleccionado',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
            document.getElementById('salesClientTable').style.display = 'none';
            document.getElementById('startDateSalesClient').value = 'yyyy-MM-dd';
            document.getElementById('endDateSalesClient').value = 'yyyy-MM-dd';
            document.getElementById('dataCompleteReportSalesClient').value = 0;
        }
    }
}


//PRINT ALL DATA TO DATATABLE OF SALES Product
const addDataToDataTableSalesProduct = (dataObtained) => {

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (dataObtained.body.length == 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la extracción de los datos',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase(),
            confirmButtonText: 'Entendido'
        });
        document.getElementById('salesProductTable').style.display = 'none';
        document.getElementById('startDateSalesProduct').value = 'yyyy-MM-dd';
        document.getElementById('endDateSalesProduct').value = 'yyyy-MM-dd';
        document.getElementById('dataCompleteReportSalesProduct').value = 0;
    }
    else {
        try {

            document.getElementById('salesProductTable').style.display = 'block';
            document.getElementById('dataCompleteReportSalesProduct').value = 1;

            let salesProductData = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                salesProductData += `
                <tr>
                    <td class="text-muted">${dataObtained.body[i].ordernumber}</td>
                    <td class="text-muted">Q${dataObtained.body[i].totalpay}</td>
                    <td class="text-muted">${dataObtained.body[i].createdDate}</td>
                    <td class="text-muted">${dataObtained.body[i].finishDate}</td>
                    <td class="text-muted">${dataObtained.body[i].name}</td>
                </tr>`;
            }
            document.getElementById('salesProductReport').innerHTML = salesProductData;
        }
        catch {
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se encontró información en el rango de fechas seleccionado',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
            document.getElementById('salesProductTable').style.display = 'none';
            document.getElementById('startDateSalesProduct').value = 'yyyy-MM-dd';
            document.getElementById('endDateSalesProduct').value = 'yyyy-MM-dd';
            document.getElementById('dataCompleteReportSalesProduct').value = 0;
        }
    }
}



//EXPORT TABLE MONEY QUANTITY REPORT INFO TO EXCEL
const exportMoneyQuantityReport = () => {

    let flagDataComplete = document.getElementById('dataCompleteReportMoneyQuantity').value;

    if (flagDataComplete != 1) {
        Swal.fire({
            icon: 'info',
            title: 'Sin Datos',
            text: 'No existen datos para exportar, primero presione generar reporte e intente de nuevo',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        let timerInterval;
        Swal.fire({
            title: 'Generando reporte...',
            text: 'No cierres este cuadro de diálogo mientras se genera el reporte para no interrumpir el proceso',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                var wb = XLSX.utils.table_to_book(document.getElementById("reportTableMoneyQuantity"));
                XLSX.writeFile(wb, "BAKERYGO_REPORTE_CANTIDAD_DINERO_ORDENES.xlsx");
            }
        })
    }
}


//EXPORT TABLE SALES CLIENT REPORT INFO TO EXCEL
const exportSalesClientReport = () => {

    let flagDataComplete = document.getElementById('dataCompleteReportSalesClient').value;

    if (flagDataComplete != 1) {
        Swal.fire({
            icon: 'info',
            title: 'Sin Datos',
            text: 'No existen datos para exportar, primero presione generar reporte e intente de nuevo',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        let timerInterval;
        Swal.fire({
            title: 'Generando reporte...',
            text: 'No cierres este cuadro de diálogo mientras se genera el reporte para no interrumpir el proceso',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                var wb = XLSX.utils.table_to_book(document.getElementById("reportTableSalesClient"));
                XLSX.writeFile(wb, "BAKERYGO_REPORTE_VENTAS_POR_CLIENTES.xlsx");
            }
        })
    }
}


//EXPORT TABLE SALES PRODUCT REPORT INFO TO EXCEL
const exportSalesProductReport = () => {

    let flagDataComplete = document.getElementById('dataCompleteReportSalesProduct').value;

    if (flagDataComplete != 1) {
        Swal.fire({
            icon: 'info',
            title: 'Sin Datos',
            text: 'No existen datos para exportar, primero presione generar reporte e intente de nuevo',
            confirmButtonText: 'Entendido'
        });
    }
    else {
        let timerInterval;
        Swal.fire({
            title: 'Generando reporte...',
            text: 'No cierres este cuadro de diálogo mientras se genera el reporte para no interrumpir el proceso',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                var wb = XLSX.utils.table_to_book(document.getElementById("reportTableSalesProduct"));
                XLSX.writeFile(wb, "BAKERYGO_REPORTE_VENTAS_POR_PRODUCTO.xlsx");
            }
        })
    }
}