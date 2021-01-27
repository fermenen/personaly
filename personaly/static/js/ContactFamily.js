import Handlebars from 'handlebars';
class ContactFamily {

    constructor(app, contact, url_api_family, title_modal_add, title_modal_edit, message_error_create, message_success_delete_family, message_error_delete_family, message_error_update) {
        this.app = app;
        this.contact = contact;

        this.url_api_family = url_api_family;
        this.title_modal_add = title_modal_add;
        this.title_modal_edit = title_modal_edit;

        this.message_error_create = message_error_create;
        this.message_success_delete_family = message_success_delete_family;
        this.message_error_delete_family = message_error_delete_family;
        this.message_error_update = message_error_update;
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_family").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_family();
    }

    data_contact_family() {
        let ajax = $.ajax({
            url: this.url_api_family + '?contact=' + this.contact.contact_id + '&ordering=-created_at',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let family = []
                this.count_family = data['count']
                for (let f in data['results']) {
                    family.push({
                        family_id: data['results'][f]['id'],
                        family_name: data['results'][f]['name'],
                        family_surnames: data['results'][f]['surnames'],
                        family_relation_name: data['results'][f]['relation_name'],

                    })
                }
                let context = {family: family};
                $("#component_all_family").html(this.template(context));
            },
            complete: data => {
                this.app.textVisible(this.count_family, '#text_family_contact')
                this.app.textInVisible(this.count_family, '#component_all_family')
            }
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


    modalEditFamily(id) {
        $.ajax({
            url: this.url_api_family + id + '/', headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                $('#title_modal_family').text(this.title_modal_edit)
                $("#form_modal_family_create_edit :input[name='name_family']").val(data['name']);
                $("#form_modal_family_create_edit :input[name='surname_family']").val(data['surnames']);
                $("#form_modal_family_create_edit :input[name='relation_type']").val(data['relation_type']);
                $("#button_save_contact_family").attr("onclick", "familyJS.editFamilyContact('" + id + "')");
                this.app.ShowModal(modal_family)
            },
            error: data => {
                this.app.NotificationError(this.message_error_update)
            }
        });


    }


    // Crear FamilyContact
    createFamilyContact() {
        let button_save = '#button_save_contact_family'
        let form_modal_family = '#form_modal_family_create_edit'

        if ($(form_modal_family).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_family,
                headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    name: $('#input_name_family').val(),
                    surnames: $('#input_surnames_family').val(),
                    relation_type: $('#id_relation_type').val(),
                    contact: this.contact.getContact,
                    owner: this.contact.getOwner,
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

    // Editar FamilyContact
    editFamilyContact(id) {
        let button_save = '#button_save_contact_family'
        let form_modal_family = '#form_modal_family_create_edit'

        if ($(form_modal_family).valid()) {
            this.app.DisabledButton(button_save)
            this.app.LoadingButton(button_save)
            $.ajax({
                url: this.url_api_family + id + '/',
                headers: {"X-CSRFToken": this.app.getCsrftoken},
                data: {
                    name: $('#input_name_family').val(),
                    surnames: $('#input_surnames_family').val(),
                    relation_type: $('#id_relation_type').val(),
                    contact: this.contact.getContact,
                    owner: this.contact.getOwner,
                },
                type: 'PUT',
                dataType: 'json',
                success: data => {
                    this.app.HideModal(modal_family)
                    location.reload();
                },
                error: data => {
                    this.app.NotificationError(this.message_error_update)
                    this.app.AvailableButton(button_save)
                    this.app.AvailableloadingButton(button_save)
                },
            });
        } else {
        }
    }


    // Borrar MusicContact a traves de ID
    deleteContactFamily(id) {
        let StringDivID = '#' + id
        $.ajax({
            url: this.url_api_family + id + '/',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
            },
            type: 'DELETE',
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


}

export default ContactFamily