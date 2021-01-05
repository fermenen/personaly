class Contact_common {

    constructor(app, contact, count_common, url_api_common, message_error_create, message_success_delete_common, message_error_delete_common) {
        this.app = app;
        this.contact = contact;
        this.count_common = count_common;
        this.url_api_common = url_api_common;
        this.message_error_create = message_error_create;
        this.message_success_delete_common = message_success_delete_common;
        this.message_error_delete_common = message_error_delete_common;

    }

    get getCountCommon() {
        return this.count_common;
    }


    // Crear Common Contact
    createCommonContact() {
        let button_save = '#button_save_contact_common'
        let form_modal_common = '#form_modal_add_common'

        if ($(form_modal_common).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_common,
                headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    text: $('#input_text_common').val(),
                    contact: this.contact.getContact,
                    owner: this.contact.getOwner,
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    this.app.HideModal(modal_create_common)
                    location.reload();
                },
                error: data => {
                    this.app.NotificationError(this.message_error_create)
                    this.app.AvailableButton(button_save)
                    this.app.AvailableloadingButton(button_save)
                },
            });
        }
    }


    // Borrar Common Contact
    deleteCommonContact() {
        let id = $('#common_id_modal').val()
        let StringDivID = '#' + id
        $.ajax({
            url: this.url_api_common + id + '/',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                this.app.HideModal(modal_delete_common)
                this.app.NotificationSuccess(this.message_success_delete_common)
                $(StringDivID).addClass('uk-hidden')
                this.count_common -= 1
                this.contact.textVisible(this.count_common, '#text_common_contact')
            },
            error: data => {
                this.app.NotificationError(this.message_error_delete_common)
            },
        });
    }

    openModalDeleteCommon(id, text) {
        $('#common_text').text(text)
        $('#common_id_modal').val(id)
        this.app.ShowModal(modal_delete_common)

    }

}