//ROUTES
const globalApiUrl = 'http://localhost:3000/api/v1/products';
const globalExtraIngredientUrl = 'http://localhost:3000/api/v1/productExtraIngredients';


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
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else if (dataObtained.body.length == 0) {
        if (dataObtained.body === 'invalid token') {
            //NO DATA OBTAINED
            Swal.fire({
                icon: 'error',
                title: '¡Lo Sentimos!',
                text: 'No se pudo concretar la extracción de los datos',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error. ' + dataObtained.body.toUpperCase()
            });
        }
    }
    else {
        for (let i = 0; i < dataObtained.body.length; i++) {
            dataSet.push([
                dataObtained.body[i].name ?? 'Sin Datos',
                `<img src="${dataObtained.body[i].base64img}" alt="img-producto" width="60"/>`,
                dataObtained.body[i].baseingredients ?? 'Sin Datos',
                dataObtained.body[i].description ?? 'Sin Datos',
                dataObtained.body[i].allergyinformation ?? 'Sin Datos',
                dataObtained.body[i].applyextraingredients === 0 ? 'No Aplica' : 'Aplica' ?? 'Sin Datos',
                `<button class="btn btn-warning"><i class="fa-solid fa-pen-to-square"></i></button>`,
                `<button class="btn btn-danger" onclick="deleteProduct(${dataObtained.body[i].id})"><i class="fa-solid fa-trash"></i></button>`
            ]);
        }
    }

    new DataTable('#productsTable', {
        columns: [
            { title: 'Nombre' },
            { title: 'Imagen' },
            { title: 'Ingredientes Base' },
            { title: 'Descripción' },
            { title: 'Información Alérgica' },
            { title: 'Aplica Ingredientes Extra' },
            { title: 'Edicion' },
            { title: 'Eliminación' }
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


//DELETE PRODUCT INFO
const deleteProduct = (idToEliminate) => {

    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Los cambios no se podrán recuperar',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var raw = JSON.stringify({
                "id": idToEliminate
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(globalApiUrl, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

            const showData = (dataObtained) => {
                if (dataObtained.body === 'Error de Servidor') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                        try {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación se completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../../views/a/products/component';
                                } else if (result.isDenied) {
                                    window.location.href = '../../../views/a/products/component';
                                }
                                else {
                                    window.location.href = '../../../views/a/products/component';
                                }
                            })
                        }
                        catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Lo Sentimos!',
                                text: 'Sa ha generado un error interno',
                                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                                confirmButtonText: 'Entendido'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}


//CONVERT FILE CHOOSEN TO BASE64 FOR SAVE IN DB
const convertImgToBase64 = () => {

    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener("change", e => {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let imageRoute = reader.result;
            let tamañoImagen = file.size;

            if (tamañoImagen > 100000) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La imagen supera el peso permitido, comprimala con la herramienta que se muestra abajo, intente de nuevo o seleccione otra imagen para continuar',
                    footer: '<a href="https://tinyjpg.com/" target="_blank">Presione acá para ser redirigido al compresor de imágenes</a>',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('photoBase64Product').value = '';
                document.getElementById('fileInput').value = '';
            }
            else {
                document.getElementById('photoBase64Product').value = imageRoute;
            }
        });
        reader.readAsDataURL(file);
    });
}
convertImgToBase64();


//ADD INGREDIENT AND PRICE WITH TEMPORAL ARRAY AFTER PRODUCT SAVE
//FIRST, CHECK THE LENGTH FOR THE EXTRA INGREDIENTS ARRAY
//SECOND, PUSH DATA TO ARRAY EXTRA INGREDIENTS IF ALL IS OK
//THIRD, SAVE DATA IN DB
let extraIngredientsProductArray = [];

const verifyArrayExtraIngredients = () => {
    if (extraIngredientsProductArray.length == 0) {
        let extraIngredients = '';
        for (let i = 0; i < 1; i++) {
            extraIngredients += `
            <tr>
                <td class="text-muted">-- Agrega un nombre a la lista --</td>
                <td class="text-muted">-- Agrega un precio a la lista --</td>
            </tr>
            `;
        }
        document.getElementById('extraIngredientsAndPrice').innerHTML = extraIngredients;
    }
    else {
        // EXECUTE THE ADD MODULE TO ROL TEMPORALY FUNCTION
    }
}
verifyArrayExtraIngredients();

const addExtraIngredientAndPrice = () => {

    let extraIngredient = document.getElementById('extraIngredient').value.toString();
    let priceExtraIngredient = parseFloat(document.getElementById('priceExtraIngredient').value);

    extraIngredientsProductArray.push([extraIngredient, priceExtraIngredient]);

    if (extraIngredientsProductArray.length === 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'No se pudo concretar la operación, intenta de nuevo',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let extraIngredients = '';
        for (let i = 0; i < extraIngredientsProductArray.length; i++) {
            extraIngredients += `
            <tr>
                <td class="text-muted">${extraIngredientsProductArray[i][0]}</td>
                <td class="text-muted">Q${extraIngredientsProductArray[i][1]}</td>
            </tr>
            `;
        }
        document.getElementById('extraIngredientsAndPrice').innerHTML = extraIngredients;

        //CLEAR AND FOCUS INPUT
        document.getElementById('extraIngredient').value = '';
        document.getElementById('priceExtraIngredient').value = '';
        document.getElementById('extraIngredient').focus();
    }
}


//CREATE NEW PRODUCT AND EXTRA INGREDIENTS
const createProduct = () => {

    let productName = document.getElementById('productName').value;
    let base64ImgProduct = document.getElementById('photoBase64Product').value;
    let baseIngredients = document.getElementById('baseIngredients').value;
    let allergyInformation = document.getElementById('allergyInformation').value;
    let productDescription = document.getElementById('productDescription').value;
    let applyExtraIngredients;

    //IF THE TEMPORARY ARRAY OF EXTRA INGREDIENTS HAVE A DATA, AUTOMATICALLY PRODUCT APPLY EXTRA INGREDIENTS
    if (extraIngredientsProductArray.length > 0) {
        applyExtraIngredients = 1;
    }
    else {
        applyExtraIngredients = 0;
    }

    if (productName === '' || baseIngredients === '' || allergyInformation === '' || productDescription === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else if (base64ImgProduct === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La imagen no se ha subido o no ha sido validada, por favor intente de nuevo',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "name": productName,
            "base64img": base64ImgProduct,
            "baseingredients": baseIngredients,
            "allergyinformation": allergyInformation,
            "description": productDescription,
            "applyextraingredients": applyExtraIngredients
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiUrl, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
            else {
                if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                    try {
                        if (extraIngredientsProductArray.length === 0) {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación se completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../../views/a/products/component';
                                } else if (result.isDenied) {
                                    window.location.href = '../../../views/a/products/component';
                                }
                            });
                        }
                        else {
                            createExtraIngredientsWithProduct(dataObtained.body.insertId);
                        }
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
        }
    }
}

const createExtraIngredientsWithProduct = (recentlyCreatedProductId) => {

    for (let i = 0; i < extraIngredientsProductArray.length; i++) {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "name": extraIngredientsProductArray[i][0],
            "price": extraIngredientsProductArray[i][1],
            "idproduct": recentlyCreatedProductId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalExtraIngredientUrl, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
            else {
                if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                    try {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Correcto!',
                            text: 'La operación se completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '../../../views/a/products/component';
                            } else if (result.isDenied) {
                                window.location.href = '../../../views/a/products/component';
                            }
                        });
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
        }
    }
}