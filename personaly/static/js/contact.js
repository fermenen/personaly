function createContactNote() {
    disabledButton('#button_save_contact_note')
    loadingButton('#button_save_contact_note')
    disabledButton('#button_cancel_contact_note')

    let requestCreateNote = $.ajax({
        url: 'http://127.0.0.1:8000/api/v1/contact/create_note',
        data: {
            text: $('#text_note').val(),
            contact: $('#id_contact').val(),
            owner: '55257a50-6183-43fd-b14b-ed78dd325afc',
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            UIkit.modal(modal_create_contact_note).hide();
            location.reload();


        },
        error: function (jqXHR, status, error) {
            alert("Dise, existió un problema " + error);
        },
    });


}