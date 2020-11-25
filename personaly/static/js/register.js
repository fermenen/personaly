

function registerUser(url){
    $.ajax({
    url : url,

    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    // data : { id : 123 },

    // especifica si será una petición POST o GET
    type : 'POST',

    // el tipo de información que se espera de respuesta
    dataType : 'json',

    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(json) {
        $('<h1/>').text(json.title).appendTo('body');
        $('<div class="content"/>')
            .html(json.html).appendTo('body');
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto jqXHR (extensión de XMLHttpRequest), un texto con el estatus
    // de la petición y un texto con la descripción del error que haya dado el servidor
    error : function(jqXHR, status, error) {
        alert('Disculpe, existió un problema');
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(jqXHR, status) {
        alert('Petición realizada');
    }
});


}