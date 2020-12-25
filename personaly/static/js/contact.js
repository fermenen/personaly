// function options(){
//     UIkit.util.ready(function () {
//                         var itemIndex = window.location.href.split('#')[1];
//                         if (itemIndex > 0) {
//                             UIkit.switcher('#switcher_contact').show(itemIndex);
//                         }
//                     });
// }

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
