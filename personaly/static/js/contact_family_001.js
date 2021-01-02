class Contact_family {

    constructor(app, contact, count_family, url_api_add_family, url_api_delete_family, title_modal_add, title_modal_edit, message_error_create, message_success_delete_family, message_error_delete_family) {
        this.app = app;
        this.contact = contact;
        this.count_family = count_family;

        this.url_api_add_family = url_api_add_family;
        this.url_api_delete_family = url_api_delete_family;

        this.title_modal_add = title_modal_add;
        this.title_modal_edit = title_modal_edit;

        this.message_error_create = message_error_create;
        this.message_success_delete_family = message_success_delete_family;
        this.message_error_delete_family = message_error_delete_family;
    }

    get getCountFamily() {
        return this.count_family;
    }


    // Crear FamilyContact
    createFamilyContact() {
        let button_save = '#button_save_contact_family'
        let form_modal_family = '#form_modal_family_create_edit'

        if ($(form_modal_family).valid()) {
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
        } else {


        }


    }


    // Borrar MusicContact a traves de ID
    deleteContactFamily(divID) {
        let StringDivID = '#' + divID
        $.ajax({
            url: this.url_api_delete_family,
            data: {
                id: divID,
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
                csrfmiddlewaretoken: this.app.getCsrftoken
            },
            type: 'POST',
            dataType: 'json',
            success: data => {
                this.app.NotificationSuccess(this.message_success_delete_family)
                $(StringDivID).addClass('uk-hidden')
                this.count_family -= 1
                this.contact.textVisible(this.count_family, '#text_family_contact')
            },
            error: data => {
                this.app.NotificationError(this.message_error_delete_family)
            },
        });
    }

    modalCreateFamily() {
        $('#title_modal_family').text(this.title_modal_add)
        $('#name_contact_modal_family').text('')
        $('#input_name_family').val('')
        $('#input_surnames_family').val('')
        $('#id_relation_type').val('')
        $("#button_save_contact_family").attr("onclick", "familyJS.createFamilyContact()");
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
