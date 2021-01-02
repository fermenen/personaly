class app {

    constructor() {
        this.csrftoken = $("input[name=csrfmiddlewaretoken]").val()
    }


    get getCsrftoken() {
        return this.csrftoken;
    }

    NotificationError(message_error) {
        UIkit.notification({message: message_error, status: 'danger'})
    }

    NotificationSuccess(message_success) {
        UIkit.notification({message: message_success, status: 'success'})
    }

    HideModal(modal) {
        UIkit.modal(modal).hide();
    }

    ShowModal(modal) {
        UIkit.modal(modal).show();
    }

    DisabledButton(name) {
        $(name).addClass('uk-disabled')
    }

    AvailableButton(name) {
        $(name).removeClass('uk-disabled')
    }

    LoadingButton(name) {
        $(name).html('<div uk-spinner></div>')
    }

    AvailableloadingButton(name) {
        $(name).html($(name).data('value'))
    }
}


function deleteContact(contactId, contactName) {
    $("#contact_id").val(contactId);
    $("#contact_name").text(contactName);
    UIkit.modal(modal_delete_contact).show();
}

function editContact(name, surname) {
    $("#edit_contact_name").text(name);
    $("#edit_contact_surname").text(surname);
    $("#edit_contact_name_input").val(name);
    $("#edit_contact_surname_input").val(surname);

    UIkit.modal(modal_edit_contact).show();


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


function uploadPhoto() {

    var bar = document.getElementById('js-progressbar');

    let uploadPhoto = UIkit.upload('.js-upload', {

        url: '/api/v1/contact/upload_photo',
        multiple: false,
        params: {
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },

        completeAll: function (response) {

            var parsed_data = JSON.parse(response['response']);
            console.log(parsed_data);
            let pathPhoto = parsed_data.file

            $("#image_edit_contact_modal").attr("src", '/media/' + pathPhoto);
            $('#upload_photo_edit_contact').addClass('uk-hidden')


        },


    });

}
