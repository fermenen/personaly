class app {

    constructor(owner, url_api_contact, message_error_create, message_success_delete_contact, message_error_delete_contact, message_error_edit_contact) {
        console.log('%cADVERTENCIA WARNING', 'background: #ee395b; color: #DFEDF2; font-size: 21px');
        console.log('%cSi utilizas esta consola, otras personas podrían hacerse pasar por ti y robarte datos mediante un ataque llamado Self-XSS', 'background: #ee395b; color: #05C7F2; font-size: 16px');
        jQueryValidators();
        this.csrftoken = $("input[name=csrfmiddlewaretoken]").val();
        this.owner = owner;
        this.url_api_contact = url_api_contact
        this.message_error_create = message_error_create;
        this.message_success_delete_contact = message_success_delete_contact;
        this.message_error_delete_contact = message_error_delete_contact;
        this.message_error_edit_contact = message_error_edit_contact;

        this.ajaxCountContact();
    }

    count_contact;

    get getCsrftoken() {
        return this.csrftoken;
    }

    get getOwner() {
        return this.owner;
    }

    get getCountContacts() {
        return this.count_contact;
    }

    ajaxCountContact() {
        $.ajax({
            url: this.url_api_contact,
            headers: {"X-CSRFToken": this.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            async: false,
            success: data => {
                this.count_contact = data['count']
            }
        });
    }

    textVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).removeClass('uk-hidden')
        } else {
            $(textVisible).addClass('uk-hidden')
        }
    }

    textInVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).addClass('uk-hidden')
        } else {
            $(textVisible).removeClass('uk-hidden')
        }
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


    createContact() {
        let button_save = '#button_create_contact'
        let form_modal_contact = '#form_modal_create_contact'

        if ($(form_modal_contact).valid()) {
            this.DisabledButton(button_save)
            this.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_contact,
                headers: {"X-CSRFToken": this.getCsrftoken},
                data: {
                    name: $('#input_name_contact').val(),
                    surnames: $('#input_surnames_contact').val(),
                    keep_in_touch: $('#id_keep_in_touch').val(),
                    owner: this.getOwner,
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    this.HideModal(modal_create_contact)
                    location.reload();
                },
                error: data => {
                    this.NotificationError(this.message_error_create)
                    this.AvailableButton(button_save)
                    this.AvailableloadingButton(button_save)
                },
            });
        }
    }


    deleteContact() {
        let id = $('#contact_id_delete_contact').val()
        let StringDivID = '#' + id
        $.ajax({
            url: this.url_api_contact + id + '/',
            headers: {"X-CSRFToken": this.getCsrftoken},
            data: {
                owner: this.getOwner,
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                this.HideModal(modal_delete_contact)
                this.NotificationSuccess(this.message_success_delete_contact)
                $(StringDivID).addClass('uk-hidden')
                this.count_contact -= 1
                this.textVisible(this.getCountContacts, '#text_contact_list')
                this.textInVisible(this.getCountContacts, '#component_all_contacts')
            },
            error: data => {
                this.NotificationError(this.message_error_delete_contact)
            },
        });
    }


        editContact() {
        let button_save = '#button_save_edit_contact'
        let form_modal_edit_contact = '#form_modal_edit_contact'
        let id_contact = $("#form_modal_edit_contact input[id=id_contact]").text()

        if ($(form_modal_edit_contact).valid()) {
            this.DisabledButton(button_save)
            this.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_contact + id_contact + '/',
                headers: {"X-CSRFToken": this.getCsrftoken},
                data: {
                    name: $("#form_modal_edit_contact input[id=input_edit_name_contact]").val(),
                    surnames:   $("#form_modal_edit_contact input[id=input_edit_surnames_contact]").val(),
                    location:  $("#form_modal_edit_contact input[id=input_city_contact]").val(),
                    phone:  $("#form_modal_edit_contact input[id=input_phone]").val(),
                    email: $("#form_modal_edit_contact input[id=input_mail]").val(),
                    birthday:  $("#form_modal_edit_contact input[id=input_date]").val(),
                    remember_birthday: $("#form_modal_edit_contact input[id=remember_birthday]").val(),
                    keep_in_touch:  $("#form_modal_edit_contact select[id=id_keep_in_touch]").val(),
                    contact: id_contact,
                    owner: this.getOwner,
                },
                type: 'PUT',
                dataType: 'json',
                success: data => {
                    this.HideModal(modal_edit_contact)
                    location.reload();
                },
                error: data => {
                    this.NotificationError("erorrr")
                    this.AvailableButton(button_save)
                    this.AvailableloadingButton(button_save)
                },
            });
        } else {
        }
    }


    openModalDeleteContact(id_contact, name_contact) {
        $('#contact_id_delete_contact').val(id_contact)
        $('#contact_name_delete_contact').text(name_contact)
        this.ShowModal(modal_delete_contact)
    }

    openModalEditContact(id_contact) {
        $.ajax({
            url: this.url_api_contact + id_contact + '/',
            headers: {"X-CSRFToken": this.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            async: false,
            success: data => {
                $("#form_modal_edit_contact input[id=id_contact]").text(id_contact)
                $("#form_modal_edit_contact input[id=input_edit_name_contact]").val(data['name'])
                $("#form_modal_edit_contact input[id=input_edit_surnames_contact]").val(data['surnames'])
                $("#form_modal_edit_contact input[id=input_city_contact]").val(data['location'])
                $("#form_modal_edit_contact input[id=input_phone]").val(data['phone'])
                $("#form_modal_edit_contact input[id=input_mail]").val(data['email'])
                $("#form_modal_edit_contact input[id=input_date]").val(data['birthday'])
                $("#form_modal_edit_contact input[id=remember_birthday]").prop('checked', data['remember_birthday']);
                $("#form_modal_edit_contact select[id=id_keep_in_touch]").val(data['keep_in_touch'])
                this.ShowModal(modal_edit_contact)
            },
            error: data => {
                this.NotificationError(this.message_error_edit_contact)
            }
        });


    }

    searchPlaces() {

        const fixedOptions = {
            appId: 'plVYBCB02Y6T',
            apiKey: '2e2a874c73db4a2dcf6ea5f5bbed99f5',
            container: document.querySelector('#input_city_contact')
        };

        const reconfigurableOptions = {
            language: 'es', // Receives results in spanish
            // countries: ['us', 'ru'], // Search in the United States of America and in the Russian Federation
            type: 'city', // Search only for cities names
            aroundLatLngViaIP: true // disable the extra search/boost around the source IP
        };
        const placesInstance = places(fixedOptions).configure(reconfigurableOptions);

        // // dynamically reconfigure options
        // placesInstance.configure({
        //     countries: ['us'] // only search in the United States, the rest of the settings are unchanged: we're still searching for cities in German.
        // })

    }


}


function jQueryValidators() {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        let myRegex = /^[a-z ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/i
        return this.optional(element) || myRegex.test(value);
    }, "Letters only please");
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
