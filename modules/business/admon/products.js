//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/products';


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



//GET ALL PRODUCTS
const getAllProducts = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(globalApiUrl, requestOptions)
        .then(response => response.json())
        .then(dataObtained => showData(dataObtained))
        .catch(error => console.log('Error: ' + error))

    const showData = (dataObtained) => {
        try {
            addDataToDataTable(dataObtained);
        }
        catch (err) {
            console.log(err);
        }
    }
}
getAllProducts();



//PRINT ALL PRODUCTS IN PRODUCT DATATABLE
const addDataToDataTable = (dataObtained) => {

    let dataSet = [];

    if (dataObtained.body === 'invalid token') {
        //NO DATA OBTAINED
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No tienes permisos para ver los datos, por favor cierra sesión e inicia sesión nuevamente',
            footer: 'Informa al administrador del error: 401 Unauthorized'
        });
    }
    else if (dataObtained.body.length == 0) {
        if (dataObtained.body === 'invalid token') {
            //NO DATA OBTAINED
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se pudo concretar la extracción de los datos',
                footer: 'Informa al administrador del error: ' + dataObtained.body.toUpperCase()
            });
        }
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            dataSet.push([
                dataObtained.body[i].name,
                `<img src="${dataObtained.body[i].base64img}" alt="img-producto" width="60"/>`,
                dataObtained.body[i].baseingredients,
                dataObtained.body[i].description,
                dataObtained.body[i].allergyinformation,
                dataObtained.body[i].applyextraingredients
            ]);
        }
    }

    new DataTable('#example', {
        columns: [
            { title: 'Nombre' },
            { title: 'Imagen' },
            { title: 'Ingredientes Base' },
            { title: 'Descripción' },
            { title: 'Información Alérgica' },
            { title: 'Aplica Productos Extra' }
        ],
        data: dataSet,
        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de _MAX_ total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ Entradas",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },
        select: true
    });
}