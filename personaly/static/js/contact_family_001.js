class Contact_family {

    constructor(app, contact, count_family, url_api_add_family, title_modal_add, title_modal_edit, message_error_create) {
        this.app = app;
        this.contact = contact;
        this.count_family = count_family;
        this.url_api_add_family = url_api_add_family;
        this.title_modal_add = title_modal_add;
        this.title_modal_edit = title_modal_edit;
        this.message_error_create = message_error_create;
    }

    get getCountFamily() {
        return this.count_family;
    }


    // Crear FamilyContact
    createFamilyContact() {
        let button_save = '#button_save_contact_family'
        this.app.DisabledButton(button_save)
        this.app.LoadingButton(button_save)

        $.ajax({
            url: this.url_api_add_family,
            data: {
                name: $('#input_name_family').val(),
                surnames: $('#input_surnames_family').val(),
                relation_type: $('#id_relation_type').val(),
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
                csrfmiddlewaretoken: this.app.getCsrftoken
            },
            type: 'POST',
            dataType: 'json',
            success: data => {
                this.app.HideModal(modal_family)
                location.reload();
            },
            error: data => {
                this.app.NotificationError(this.message_error_create)
                this.app.AvailableButton(button_save)
                this.app.AvailableloadingButton(button_save)
            },
        });
    }


    modalCreateFamily() {
        $('#title_modal_family').text(this.title_modal_add)
        $('#name_contact_modal_family').text('')
        $('#input_name_family').val('')
        $('#input_surnames_family').val('')
        $('#id_relation_type').val('')
        this.app.ShowModal(modal_family)

    }


    modalEditFamily(id, name, surnames, relation_type) {
        $('#title_modal_family').text(this.title_modal_edit)
        $('#name_contact_modal_family').text(name)
        $('#input_name_family').val(name)
        $('#input_surnames_family').val(surnames)
        $('#id_relation_type').val(relation_type)
        this.app.ShowModal(modal_family)

    }

}
