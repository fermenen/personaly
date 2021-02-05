import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";

export default class ContactFamily {

    constructor() {
        $(document).on('contact_family_created', () => this.data_contact_family());
        $(document).on('contact_family_edited', () => this.data_contact_family());
        $(document).on('contact_family_deleted', () => this.data_contact_family());
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_family").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_family();
        this.configureValidationForms();
    }

    data_contact_family() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:family_contact-list', '?contact=' + Contact.getContactId() + '&ordering=-created_at'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
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
                App.textVisible(this.count_family, '#text_family_contact')
                App.textInVisible(this.count_family, '#component_all_family')
            }
        });
    }

    modalCreateFamily() {
        $('#title_modal_family').text(gettext('Añadir relación familiar/amorosa'))
        $('#name_contact_modal_family').text('')
        $('#input_name_family').val('')
        $('#input_surnames_family').val('')
        $('#id_relation_type').val('')
        $("#button_save_contact_family").attr("onclick", "familyJS.createFamilyContact()");
        App.ShowModal(modal_family)

    }


    modalEditFamily(family_id) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:family_contact-detail', family_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                $('#title_modal_family').text(gettext('Editar relación con '))
                $("#form_modal_family_create_edit :input[name='name_family']").val(data['name']);
                $("#form_modal_family_create_edit :input[name='surname_family']").val(data['surnames']);
                $("#form_modal_family_create_edit :input[name='relation_type']").val(data['relation_type']);
                $("#button_save_contact_family").attr("onclick", "familyJS.editFamilyContact('" + family_id + "')");
                App.ShowModal(modal_family)
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al actualizar el contacto'))
            }
        });

    }


    createFamilyContact() {
        let button_save = '#button_save_contact_family'
        let form_modal_family = '#form_modal_family_create_edit'
        if ($(form_modal_family).valid()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:family_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    name: $('#input_name_family').val(),
                    surnames: $('#input_surnames_family').val(),
                    relation_type: $('#id_relation_type').val(),
                    contact: Contact.getContactId(),
                    owner: App.getOwner(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_family_created');
                    App.NotificationSuccess(gettext('Contacto añadido con exito!'))
                    App.HideModal(modal_family)
                },
                error: data => {
                    App.NotificationError(gettext('Ocurrió un problema al guardar el contacto'))
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                },
            });
        } else {
        }
    }


    editFamilyContact(family_id) {
        let button_save = '#button_save_contact_family'
        let form_modal_family = '#form_modal_family_create_edit'
        if ($(form_modal_family).valid()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:family_contact-detail', family_id, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    name: $('#input_name_family').val(),
                    surnames: $('#input_surnames_family').val(),
                    relation_type: $('#id_relation_type').val(),
                    contact: Contact.getContactId(),
                    owner: App.getOwner(),
                },
                type: 'PUT',
                dataType: 'json',
                success: data => {
                    App.NotificationSuccess(gettext('¡Contacto editado con éxito!'))
                    jQuery.event.trigger('contact_family_edited');
                    App.HideModal(modal_family)
                },
                error: data => {
                    App.NotificationError(gettext('Error al editar el contacto.'))
                },
                complete: data => {
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }

    deleteFamilyContact(family_id) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:family_contact-detail', family_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            data: {
                owner: App.getOwner(),
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_family_deleted');
                App.NotificationSuccess(gettext('¡Contacto eliminado con éxito!'))
                this.count_family -= 1
                App.textVisible(this.count_family, '#text_family_contact')
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al borrar el contacto'))
            },
        });
    }


    configureValidationForms() {
        $(document).ready(function () {
            $('#form_modal_family_create_edit').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        name_family: {
                            required: true,
                            minlength: 3
                        },
                        relation_type: {
                            required: true
                        },
                        surname_family: {
                            minlength: 3
                        }
                    },
                    messages: {
                        name_family: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                        },
                        relation_type: {
                            required: gettext('Campo obligatorio.'),
                        },
                        surname_family: {
                            minlength: gettext('Mínimo 3 caracteres.'),
                        }
                    }
                }
            )
        });
    }
};