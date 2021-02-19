"use strict";
import Handlebars from 'handlebars';
import App from "./Application";
import Contact from "./Contact";

export default class ContactCommon {

    constructor() {
        $(document).on('contact_common_created', () => this.data_contact_common());
        $(document).on('contact_common_deleted', () => this.data_contact_common());
    }

    compileTemplate() {
        this.source = document.getElementById("template_contact_common").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_common();
        this.configureValidationForms();
    }

    data_contact_common() {
        $.ajax({
            url: window.reverse('api_v2:api_v2:common_contact-list', '?contact=' + Contact.getContactId() + '&ordering=-created_at'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
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
                App.textVisible(this.count_common, '#text_common_contact')
                App.textInVisible(this.count_common, '#component_all_common')
            }
        });
    }


    createContactCommon() {
        let button_save = '#button_save_contact_common'
        let form_modal_note = '#form_modal_add_common'
        if ($(form_modal_note).valid()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:common_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    text: $("#form_modal_add_common :input[name='text_common']").val(),
                    contact: Contact.getContactId(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_common_created');
                    App.NotificationSuccess(gettext('¡Cosa en común creada con éxito!'))
                    App.HideModal(modal_create_common)
                },
                error: data => {
                    App.NotificationError(gettext('Error al crear la cosa en común, inténtalo de nuevo.'))
                },
                complete: data => {
                    $("#form_modal_add_common :input[name='text_common']").val("")
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }


    deleteCommonContact() {
        let commonId = $('#common_id_modal').val()
        $.ajax({
            url: window.reverse('api_v2:api_v2:common_contact-detail', commonId, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_common_deleted');
                App.HideModal(modal_delete_common)
                App.NotificationSuccess(gettext('¡Cosa en común eliminada con éxito!'))
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al borrar la cosa en común.'))
            },
        });
    }


    open_modal_create_common() {
        App.ShowModal(modal_create_common)
    }

    openModalDeleteCommon(id, text) {
        $('#common_text').text(text)
        $('#common_id_modal').val(id)
        App.ShowModal(modal_delete_common)

    }

    configureValidationForms() {
        $("#form_modal_add_common").on('submit', function (evt) {
            evt.preventDefault();
        });
        $(document).ready(function () {
            $('#form_modal_add_common').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        text_common: {
                            required: true,
                            minlength: 3,
                            maxlength: 23
                        }
                    },
                    messages: {
                        text_common: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                            maxlength: gettext('Maximo 23 caracteres.'),
                        }
                    }
                }
            )
        });
    }

};