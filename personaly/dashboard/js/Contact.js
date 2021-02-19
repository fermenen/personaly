"use strict";
import App from "./Application";
import Handlebars from 'handlebars';

export default class Contact {


    contactId(contact_id) {
        this.contact_id = contact_id;
    }

    compileTemplate() {
        $(document).on('contact_edited', () => this.data_contact_header());
        $(document).on('contact_tag_created', () => this.data_contact_header());
        $(document).on('contact_tag_deleted', () => this.data_contact_header());
        this.mobileAdapt();
        this.source = document.getElementById("template_contact_header").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_header();
    }


    data_contact_header() {
        $.ajax({
            url: window.reverse('api_v2:api_v2:contact-detail', this.contact_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let tags = []
                for (let tag in data['contact_tag']) {
                    tags.push({
                        icon_tag: data['contact_tag'][tag]['icon'],
                        name_tag: data['contact_tag'][tag]['text']
                    })
                }
                var contact = {
                    id: data['id'],
                    name: data['name'],
                    surnames: data['surnames'],
                    image_contact: data['image_contact'],
                    phone: data['phone'],
                    location: data['location'],
                    tags: tags
                }
                $("#component_contact_header").html(this.template(contact));
                App.page_ready();
                App.textVisible(0, '#component_contact')
            }
        });
    }


    openModalEditContact(id_contact) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:contact-detail', id_contact, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                type: 'GET',
                dataType: 'json',
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
                    App.ShowModal(modal_edit_contact)
                },
                error: data => {
                    App.NotificationError(gettext('Error al cargar información del contacto.'))
                }
            });
        }
    }


    openModalDeleteContact(id_contact) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:contact-detail', id_contact, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                type: 'GET',
                dataType: 'json',
                success: data => {
                    $('#contact_id_delete_contact').val(id_contact)
                    $('#contact_name_delete_contact').text(data['name'])
                    App.ShowModal(modal_delete_contact)
                },
                error: data => {
                    App.NotificationError(gettext('Error al cargar información del contacto.'))
                }
            });
        }
    }


    openModalCreateContact() {
        if (appJS.actionOffline()) {
            App.ShowModal(modal_create_contact)
        }
    }


    createContact() {
        let button_save = '#button_create_contact'
        let form_modal_contact = '#form_modal_create_contact'
        if ($(form_modal_contact).valid() && appJS.actionOffline()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    name: $('#input_name_contact').val(),
                    surnames: $('#input_surnames_contact').val(),
                    keep_in_touch: $('#id_keep_in_touch').val(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    App.HideModal(modal_create_contact)
                    $('#input_surnames_contact').val("")
                    $('#input_name_contact').val("")
                    $('#id_keep_in_touch').val("")
                    jQuery.event.trigger('contact_created');
                    App.NotificationSuccess(gettext('¡Contacto creado con éxito!'))
                },
                error: data => {
                    App.NotificationError(gettext('Error al crear el contacto, inténtelo de nuevo.'))
                },
                complete: data => {
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }


    deleteContact() {
        let contact_id = $('#contact_id_delete_contact').val()
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:contact-detail', contact_id, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                type: 'DELETE',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_deleted');
                    App.HideModal(modal_delete_contact)
                    App.NotificationSuccess(gettext('¡Contacto borrado con éxito!'))
                },
                error: data => {
                    App.NotificationError(gettext('Error al borrar el contacto, inténtelo de nuevo.'))
                },
            });
        }
    }


    editContact() {
        let button_save = '#button_save_edit_contact'
        let form_modal_edit_contact = '#form_modal_edit_contact'
        let contact_id = $("#form_modal_edit_contact input[id=id_contact]").text()
        if ($(form_modal_edit_contact).valid() && appJS.actionOffline()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:contact-detail', contact_id, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    name: $("#form_modal_edit_contact input[id=input_edit_name_contact]").val(),
                    surnames: $("#form_modal_edit_contact input[id=input_edit_surnames_contact]").val(),
                    image_contact: $("#form_modal_edit_contact input[id=public_url_photo]").val(),
                    location: $("#form_modal_edit_contact input[id=input_city_contact]").val(),
                    phone: $("#form_modal_edit_contact input[id=input_phone]").val(),
                    email: $("#form_modal_edit_contact input[id=input_mail]").val(),
                    birthday: $("#form_modal_edit_contact input[id=input_date]").val(),
                    remember_birthday: $("#form_modal_edit_contact input[id=remember_birthday]").val(),
                    keep_in_touch: $("#form_modal_edit_contact select[id=id_keep_in_touch]").val(),
                    contact: contact_id,
                },
                type: 'PUT',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_edited');
                    App.HideModal(modal_edit_contact)
                    App.NotificationSuccess(gettext('¡Contacto actualizado con éxito!'))
                },
                error: data => {
                    App.NotificationError(gettext('Error al actualizar el contacto, inténtelo de nuevo.'))
                },
                complete: data => {
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }


    uploadPhotoProfile() {
        UIkit.upload('.js-upload', {
            url: window.reverse('api_v2:api_upload_photo'),
            multiple: false,
            params: {
                csrfmiddlewaretoken: App.getCsrfToken()
            },
            completeAll: function (response) {
                let pathPublicPhoto = JSON.parse(response['response']).file
                $("#image_upload").attr("src", pathPublicPhoto)
                $("#form_modal_edit_contact div[id=div_image]").removeClass('uk-hidden')
                $("#form_modal_edit_contact div[id=div_upload_image]").addClass('uk-hidden')
                $("#form_modal_edit_contact input[id=public_url_photo]").val(pathPublicPhoto)
            },
            error: data => {
                App.NotificationError(gettext('Error al subir imagen.'))
            },
        });
    }


    getContactId() {
        return this.contact_id;
    }

    static getContactId() {
        return contactJS.getContactId();
    }


    configureValidatorContact() {
        $(document).ready(function () {
            $('#form_modal_create_contact').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        name_contact: {
                            required: true,
                            minlength: 3,
                            lettersonly: true
                        },
                        surname_contact: {
                            required: false,
                            minlength: 3,
                            lettersonly: true
                        },
                        keep_in_touch: {
                            required: true
                        }
                    },
                    messages: {
                        name_contact: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                            lettersonly: gettext('Caracteres no permitidos.'),
                        },
                        surname_contact: {
                            minlength: gettext('Mínimo 3 caracteres.'),
                            lettersonly: gettext('Caracteres no permitidos.'),
                        },
                        keep_in_touch: {
                            required: gettext('Campo obligatorio.'),
                        }
                    }
                }
            )
        });
        $(document).ready(function () {
            $('#form_modal_edit_contact').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        name_contact: {
                            required: true,
                            minlength: 3,
                            lettersonly: true
                        },
                        surname_contact: {
                            required: false,
                            minlength: 3,
                            lettersonly: true
                        },
                        keep_in_touch: {
                            required: true
                        }
                    },
                    messages: {
                        name_contact: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                            lettersonly: gettext('Caracteres no permitidos.'),
                        },
                        surname_contact: {
                            minlength: gettext('Mínimo 3 caracteres.'),
                            lettersonly: gettext('Caracteres no permitidos.'),
                        },
                        keep_in_touch: {
                            required: gettext('Campo obligatorio.'),
                        }
                    }
                }
            )
        });
    }

    mobileAdapt() {
        $(window).on('load resize', function mobileContact() {
            let win = $(this);
            if (win.width() <= 700) {
                $('#tab_contact').addClass('uk-tab-right');
            } else {
                $("#tab_contact").removeClass('uk-tab-right');
            }
        })
    }

};