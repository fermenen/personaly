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
    }else{
         $("#tab_contact").removeClass('uk-tab-right');
    }

});


function createContactNote() {
    disabledButton('#button_save_contact_note')
    disabledButton('#button_cancel_contact_note')
    loadingButton('#button_save_contact_note')

    let requestCreateNote = $.ajax({
        url: 'http://127.0.0.1:8000/api/v1/contact/create_note',
        data: {
            text: $('#text_note').val(),
            contact: $('#id_contact').val(),
            owner: $('#id_owner').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            UIkit.modal(modal_create_contact_note).hide();
            location.reload();
        },
        error: function (data) {
            UIkit.modal(modal_create_contact_note).hide();
            UIkit.notification(data['responseJSON']['message'], {status: 'warning'});
            availableButton('#button_save_contact_note')
            availableButton('#button_cancel_contact_note')
            availableloadingButton('#button_save_contact_note')
        },
    });

}




function deleteContactNote(id, message_success) {
    let requestDeleteNote = $.ajax({
        url: '/api/v1/contact/delete_note',
        data: {
            id: id,
            contact: $('#id_contact').val(),
            owner: $('#id_owner').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            $('#'+id).remove();
            reduceOneCountInput('#count_notes_contact')
            textVisible('#count_notes_contact', '#text_note_contact');
            UIkit.notification(message_success, {status: 'success'});
        },
        error: function (data) {
           alert("algo fallo")
        },
    });

}




function createContactCommon() {
    let buttonSave = '#button_save_contact_common'
    disabledButton(buttonSave)
    disabledButton(buttonSave)
    loadingButton(buttonSave)

    let requestCreateNote = $.ajax({
        url: '/api/v1/contact/create_common',
        data: {
            text: $('#text_common').val(),
            contact: $('#id_contact').val(),
            owner: $('#id_owner').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            UIkit.modal(modal_create_common).hide();
            location.reload();
        },
        error: function (data) {
            UIkit.modal(modal_create_common).hide();
            UIkit.notification(data['responseJSON']['message'], {status: 'warning'});
            availableButton(buttonSave)
            availableButton(buttonSave)
            availableloadingButton(buttonSave)
        },
    });

}


function openModalDeleteCommon(id, text){
    $('#common_text').text(text)
    $('#common_id_modal').val(id)
    UIkit.modal('#modal_delete_common').show()
}


function deleteContactCommon(message_success) {
    let requestDeleteCommon = $.ajax({
        url: '/api/v1/contact/delete_common',
        data: {
            id: $('#common_id_modal').val(),
            contact: $('#id_contact').val(),
            owner: $('#id_owner').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
             UIkit.modal('#modal_delete_common').hide();
            $('#common'+$('#common_id_modal').val()).remove();
            reduceOneCountInput('#count_common_contact')
            textVisible('#count_common_contact', '#text_common_contact');
            UIkit.notification(message_success, {status: 'success'});
        },
        error: function (data) {
           alert("algo fallo")
        },
    });

}


function createContactMusic() {
    let modal = modal_add_music
    let buttonSave = '#button_save_contact_music'
    disabledButton(buttonSave)
    disabledButton(buttonSave)
    loadingButton(buttonSave)

    let requestCreateNote = $.ajax({
        url: '/api/v1/contact/add_music',
        data: {
            name_artist: $('#artist_name_input').val(),
            contact: $('#id_contact').val(),
            owner: $('#id_owner').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            UIkit.modal(modal).hide();
            location.reload();
        },
        error: function (data) {
            UIkit.modal(modal).hide();
            availableButton(buttonSave)
            availableButton(buttonSave)
            availableloadingButton(buttonSave)
        },
    });

}


// Metodo para hacer visilbe o no el texto promo denajo del boton de añadir
function textVisible(inputCount, textVisible){
    let count = parseInt($(inputCount).val())
    if (count === 0){
        $(textVisible).removeClass('uk-hidden')
    }else{
        $(textVisible).addClass('uk-hidden')
    }
}
// Metodo para restar en una unidad cuando se borra, en el input oculto
function reduceOneCountInput(inputCount){
    let count = parseInt($(inputCount).val())
    $(inputCount).val(count-1)
}