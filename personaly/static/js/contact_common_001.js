class Contact_common {

    constructor(app, contact, url_api_common, message_success_create_common, message_success_delete_common, message_error_create_common, message_error_delete_common) {
        this.app = app;
        this.contact = contact;
        this.url_api_common = url_api_common;

        this.message_success_create_common = message_success_create_common;
        this.message_success_delete_common = message_success_delete_common;
        this.message_error_create_common = message_error_create_common;
        this.message_error_delete_common = message_error_delete_common;

        $(document).on('contact_common_created', () => this.data_contact_common());
        $(document).on('contact_common_deleted', () => this.data_contact_common());
    }

    compileTemplate() {
        this.source = document.getElementById("template_contact_common").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_common();
    }

    data_contact_common() {
        let ajax = $.ajax({
            url: this.url_api_common + '?contact=' + this.contact.contact_id + '&ordering=-created_at',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let commons = []
                this.count_common = data['count']
                for (let common in data['results']) {
                    commons.push({
                        common_id: data['results'][common]['id'],
                        common_text: data['results'][common]['text'],
                    })
                }
                let context = {commons: commons};
                $("#component_all_common").html(this.template(context));
            },
            complete: data => {
                this.app.textVisible(this.count_common, '#text_common_contact')
                this.app.textInVisible(this.count_common, '#component_all_common')
            }
        });
    }


    create_contact_common() {
        let button_save = '#button_save_contact_common'
        let form_modal_note = '#form_modal_add_common'

        if ($(form_modal_note).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_common, headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    text: $("#form_modal_add_common :input[name='text_common']").val(),
                    contact: this.contact.contact_id,
                    owner: this.app.getOwner,
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_common_created');
                    this.app.NotificationSuccess(this.message_success_create_common)
                    this.app.HideModal(modal_create_common)
                },
                error: data => {
                    this.app.NotificationError(this.message_error_create_common)
                },
                complete: data => {
                    $("#form_modal_add_common :input[name='text_common']").val("")
                    this.app.AvailableButton(button_save)
                    this.app.AvailableloadingButton(button_save)
                }
            });
        }
    }




    // Borrar Common Contact_001
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


    open_modal_create_common() {
        this.app.ShowModal(modal_create_common)
    }

    openModalDeleteCommon(id) {
        $('#common_text').text(text)
        $('#common_id_modal').val(id)
        this.app.ShowModal(modal_delete_common)

    }

}