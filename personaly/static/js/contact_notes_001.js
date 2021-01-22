class Contact_note {

    constructor(app, contact, url_api_note, message_success_create_note, message_success_edited_note, message_success_delete_note, message_error_create_note, message_error_edited_note, message_error_delete_note) {
        this.app = app;
        this.contact = contact;
        this.url_api_note = url_api_note;

        this.message_success_create_note = message_success_create_note;
        this.message_success_edited_note = message_success_edited_note;
        this.message_success_delete_note = message_success_delete_note;

        this.message_error_create_note = message_error_create_note;
        this.message_error_edited_note = message_error_edited_note;
        this.message_error_delete_note = message_error_delete_note;

        $(document).on('contact_note_created', () => this.data_contact_note());
        $(document).on('contact_note_updated', () => this.data_contact_note());
        $(document).on('contact_note_deleted', () => this.data_contact_note());
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_note").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_note();
    }

    data_contact_note() {
        let ajax = $.ajax({
            url: this.url_api_note + '?contact=' + this.contact.contact_id + '&ordering=-created_at',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let notes = []
                this.count_notes = data['count']
                for (let note in data['results']) {
                    notes.push({
                        note_id: data['results'][note]['id'],
                        note_text: data['results'][note]['text'],
                        note_date: DateTime.fromISO(data['results'][note]['created_at']).toLocaleString(DateTime.DATETIME_MED)
                    })
                }
                let context = {notes: notes};
                $("#component_all_notes").html(this.template(context));
            },
            complete: data => {
                this.app.textVisible(this.count_notes, '#text_note_contact')
                this.app.textInVisible(this.count_notes, '#component_all_notes')
            }
        });
    }


    open_modal_create_note() {
        this.app.ShowModal(modal_contact_create_note)

    }

    open_modal_edit_note(id) {
        $("#form_modal_edit_note :input[id='id_note_input']").text(id);
        $.ajax({
            url: this.url_api_note + id + '/', headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                $("#form_modal_edit_note :input[name='text_note']").val(data['text']);
                this.app.ShowModal(modal_contact_edit_note)
            },
            error: data => {
                this.app.NotificationError(this.message_error_edited_note)
            }
        });


    }


    create_contact_note() {
        let button_save = '#button_save_contact_note'
        let form_modal_note = '#form_modal_note'
        if ($(form_modal_note).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_note, headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    text: $('#input_text_note').val(),
                    contact: this.contact.contact_id,
                    owner: this.app.getOwner,
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_note_created');
                    this.app.NotificationSuccess(this.message_success_create_note)
                    this.app.HideModal(modal_contact_create_note)
                },
                error: data => {
                    this.app.NotificationError(this.message_error_create_note)
                },
                complete: data => {
                    this.app.AvailableButton(button_save)
                    this.app.AvailableloadingButton(button_save)
                }
            });
        }
    }

    edit_contact_note() {
        let button_save_edit_note = '#button_save_contact_edit_note'
        let form_modal_edit_note = '#form_modal_edit_note'
        if ($(form_modal_edit_note).valid()) {
            this.app.DisabledButton(button_save_edit_note)
            this.app.LoadingButton(button_save_edit_note)
            let id_note = $("#form_modal_edit_note :input[id='id_note_input']").text();
            $.ajax({
                url: this.url_api_note + id_note + '/', headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    owner: this.app.getOwner,
                    text: $("#form_modal_edit_note :input[name='text_note']").val(),
                },
                type: 'PATCH',
                dataType: 'json',
                success: data => {
                    this.app.HideModal(modal_contact_edit_note)
                    this.app.NotificationSuccess(this.message_success_edited_note)
                    jQuery.event.trigger('contact_note_updated');
                },
                error: data => {
                    this.app.NotificationError(this.message_error_edited_note)
                },
                complete: data => {
                    this.app.AvailableButton(button_save_edit_note)
                    this.app.AvailableloadingButton(button_save_edit_note)
                }
            });
        }
    }


    delete_contact_note(note_id) {
        $.ajax({
            url: this.url_api_note + note_id + '/', headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                owner: this.contact.getOwner,
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_note_deleted');
                this.app.NotificationSuccess(this.message_success_delete_note)
                this.count_notes -= 1
                this.app.textVisible(this.count_notes, '#text_note_contact')
            },
            error: data => {
                this.app.NotificationError(this.message_error_delete_note)
            },
        });
    }

}