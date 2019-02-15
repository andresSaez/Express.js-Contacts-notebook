let imagenBase64 = "";
document.addEventListener("DOMContentLoaded", e => {
    let nuevoContactoForm = document.getElementById('nuevoContacto');

    //let mensajeOK = document.getElementById("nuevoOK").style.display = "block";

   // nuevoContactoForm.fichero.addEventListener('change', loadImage);
});

function loadImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener('load', e => {
        imagenBase64 = reader.result;

    });
}

function nuevoContacto()
{
    $.ajax({
        url:"/contactos",
        type:"POST",
        data: JSON.stringify({nombre: $("#nombre").val(), telefono: $("#telefono").val(), edad: $("#edad").val(), tipo: $("#tipo").val() }),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data) {
            if (data.error) {
                $("#nuevoError").css('display', 'block');
                $("#nuevoOK").css('display', 'none');
            } else {
                $("#nuevoError").css('display', 'none');
                $("#nuevoOK").css('display', 'block');
            }
        }
    });
}

async function deleteContacto() {
    event.preventDefault();

    let element = event.target;

    let id = element.getAttribute('id');
    console.log(id);

    const resp = await this.deleter('contactos/' + id);

    if (!resp.error) {
        element.parentElement.remove();
    } else {
        alert('No se ha podido borrar el elemento');
    }
}

function filtrarContacto()
{
    let edad = "";
    let tlf = "";

    $.ajax({
        url:"/contactos/" + $("#edad").val() + "/" + $("#telefono").val(),
        type:"GET",
        // data: JSON.stringify({nombre: $("#nombre").val(), telefono: $("#telefono").val(), edad: $("#edad").val(), tipo: $("#tipo").val()}),
        // contentType:"application/json; charset=utf-8",
        // dataType:"json",
        success: function() {
            edad = $("#edad").val();
            tlf = $("#telefono").val();
        
            if (edad === "") edad = 0;
            if (tlf === "") tlf = 0;

            location.assign("/contactos/" + edad + "/" + tlf);
        }
    });
}

function ajax(method, url, headers = {}, body = null) {

    return fetch(url, { method, headers, body})
        .then(resp => {
            if(!resp.ok) throw resp.json();
            return resp.json(); // Promise
        });
}

function editarContacto(id) {

    //event.preventDefault();
    console.log(id);
    var fd = new FormData();    
    let fichero = $( '#fichero' )[0].files[0];
    let ficheroAEnviar = fichero ? fichero : '';
    fd.append( 'fichero', ficheroAEnviar );
    fd.append('nombre', $("#nombre").val());
    console.log(fd.nombre);
    fd.append('telefono', $("#telefono").val());
    fd.append('edad', $("#edad").val());
    fd.append('tipo', $("#tipo").val());

    $.ajax({
    url: '/contactos/' + id,
    data: fd,
    processData: false,
    contentType: false,
    type: 'PUT',
    success: function(data){
        console.log("Datos enviados");
    }
    });
}

function get(url) {
    return this.ajax('GET', url);
}

function post(url, data) {
    return this.ajax('POST', url, {'Content-Type': 'application/json'}, JSON.stringify(data));
}

function put(url, data) {
    return this.ajax('PUT', url, {'Content-Type': 'application/json'}, JSON.stringify(data)); 
}

function deleter(url) {
    return this.ajax('DELETE', url);
}