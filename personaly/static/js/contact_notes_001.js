class Contact_note {

    constructor(app, contact, count_notes, url_api_note, message_error_create, message_success_delete_note, message_error_delete_note) {
        this.app = app;
        this.contact = contact;
        this.count_notes = count_notes;
        this.url_api_note = url_api_note;
        this.message_error_create = message_error_create;
        this.message_success_delete_note = message_success_delete_note;
        this.message_error_delete_note = message_error_delete_note;

    }

    get getCountNotes() {
        return this.count_notes;
    }


    openModalAddNote() {
        this.app.ShowModal(modal_contact_note)

    }

    openModalEditNote(text, id){
        $('#input_text_note').val(text)
        $('#id_note_input').val(id)
        this.app.ShowModal(modal_contact_note)
    }

    createNoteContact() {
        let button_save = '#button_save_contact_note'
        let form_modal_note = '#form_modal_note'

        if ($(form_modal_note).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_note,
                headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    text: $('#input_text_note').val(),
                    contact: this.contact.getContact,
                    owner: this.contact.getOwner,
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    this.app.HideModal(modal_contact_note)
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


    deleteNoteContact(id) {
        let StringDivID = '#' + id
        $.ajax({
            url: this.url_api_note + id + '/',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                this.app.NotificationSuccess(this.message_success_delete_note)
                $(StringDivID).addClass('uk-hidden')
                this.count_notes -= 1
                this.contact.textVisible(this.count_notes, '#text_note_contact')
            },
            error: data => {
                this.app.NotificationError(this.message_error_delete_note)
            },
        });
    }

}