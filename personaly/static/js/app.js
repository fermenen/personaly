function deleteContact(contactId, contactName) {
        $("#contact_id").val(contactId);
        $("#contact_name").text(contactName);
        UIkit.modal(modal_delete_contact).show();
}

function disabledButton(name) {
    $(name).addClass('uk-disabled')
}

function availableButton(name) {
    $(name).removeClass('uk-disabled')
}

function loadingButton(name) {
    $(name).html('<div uk-spinner></div>')
}

function availableloadingButton(name) {
    $(name).html($(name).data('value'))
}