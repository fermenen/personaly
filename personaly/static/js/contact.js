class Contact {

    constructor(owner, contact) {
        this.owner = owner;
        this.contact = contact;
    }

    get getOwner() {
        return this.owner;
    }

    get getContact() {
        return this.contact;
    }

    // Metodo para hacer visilbe o no el texto promo debajo del boton de añadir
    textVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).removeClass('uk-hidden')
        } else {
            $(textVisible).addClass('uk-hidden')
        }
    }


}


// function options(){
//     UIkit.util.ready(function () {
//                         var itemIndex = window.location.href.split('#')[1];
//                         if (itemIndex > 0) {
//                             UIkit.switcher('#switcher_contact').show(itemIndex);
//                         }
//                     });
// }

$(window).on('load resize', function mobileContact() {
    let win = $(this);
    if (win.width() <= 700) {
        $('#tab_contact').addClass('uk-tab-right');
    } else {
        $("#tab_contact").removeClass('uk-tab-right');
    }

});


// Metodo para restar en una unidad cuando se borra, en el input oculto
function reduceOneCountInput(inputCount) {
    let count = parseInt($(inputCount).val())
    $(inputCount).val(count - 1)
}