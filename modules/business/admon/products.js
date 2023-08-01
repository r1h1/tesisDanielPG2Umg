//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/products';

//GET ALL PRODUCTS
const getAllProducts = () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer e  yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlciI6ImRlLnJpdmFzaGVycmVyYUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQwNSR1ZFVIQ3ZqNVFNSXE1dkc3all5VUcuYVlZL3g1dkNvSkpEUnZvVXJWZzlwLmJITXdSNzNWbSIsImlhdCI6MTY5MDkzMDIzNX0.QvQta9d45ori0e7ndjGAEaHjs4t3N5_B_4Q2qxtYXew");

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
        try{
            addDataToDataTable(dataObtained);
        }
        catch(err){
            console.log(err);
        }
    }
}
getAllProducts();


//PRINT ALL PRODUCTS IN PRODUCT DATATABLE
const addDataToDataTable = (dataObtained) => {

    let dataSet = [];

    for (let i = 0; i < dataObtained.body.length; i++) {
        dataSet.push([
            dataObtained.body[i].name,
            dataObtained.body[i].base64img,
            dataObtained.body[i].baseingredients,
            dataObtained.body[i].description,
            dataObtained.body[i].allergyinformation,
            dataObtained.body[i].applyextraingredients
        ]);
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