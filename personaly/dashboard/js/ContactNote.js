import {DateTime} from 'luxon';
import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";

export default class ContactNote {

    constructor() {
        $(document).on('contact_note_created', () => this.data_contact_note());
        $(document).on('contact_note_updated', () => this.data_contact_note());
        $(document).on('contact_note_deleted', () => this.data_contact_note());
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_note").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_note();
        this.configureValidationForms();
    }

    data_contact_note() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:note_contact-list', '?contact=' + Contact.getContactId() + '&ordering=-created_at'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
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
                App.textVisible(this.count_notes, '#text_note_contact')
                App.textInVisible(this.count_notes, '#component_all_notes')
            }
        });
    }


    open_modal_create_note() {
        App.ShowModal(modal_contact_create_note)

    }

    open_modal_edit_note(note_id) {
        $("#form_modal_edit_note :input[id='id_note_input']").text(note_id);
        $.ajax({
            url: window.reverse('api_v2:api_v2:note_contact-detail', note_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                $("#form_modal_edit_note :input[name='text_note']").val(data['text']);
                App.ShowModal(modal_contact_edit_note)
            },
            error: data => {
                App.NotificationError(gettext('Error al editar la nota, inténtalo de nuevo.'))
            }
        });


    }


    create_contact_note() {
        let button_save = '#button_save_contact_note'
        let form_modal_note = '#form_modal_note'
        if ($(form_modal_note).valid()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:note_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    text: $('#input_text_note').val(),
                    contact: Contact.getContactId(),
                    owner: App.getOwner(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_note_created');
                    App.NotificationSuccess(gettext('¡Nota creada con éxito!'))
                    App.HideModal(modal_contact_create_note)
                    $('#input_text_note').val("")
                },
                error: data => {
                    App.NotificationError(gettext('Error al crear la nota, inténtalo de nuevo.'))
                },
                complete: data => {
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }

    edit_contact_note() {
        let button_save_edit_note = '#button_save_contact_edit_note'
        let form_modal_edit_note = '#form_modal_edit_note'
        if ($(form_modal_edit_note).valid()) {
            App.DisabledButton(button_save_edit_note)
            App.LoadingButton(button_save_edit_note)
            let id_note = $("#form_modal_edit_note :input[id='id_note_input']").text();
            $.ajax({
                url: window.reverse('api_v2:api_v2:note_contact-detail', id_note, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    text: $("#form_modal_edit_note :input[name='text_note']").val(),
                    owner: App.getOwner()
                },
                type: 'PATCH',
                dataType: 'json',
                success: data => {
                    App.HideModal(modal_contact_edit_note)
                    App.NotificationSuccess(gettext('¡Nota editada con éxito!'))
                    jQuery.event.trigger('contact_note_updated');
                },
                error: data => {
                    App.NotificationError(gettext('Error al editar la nota, inténtalo de nuevo.'))
                },
                complete: data => {
                    App.AvailableButton(button_save_edit_note)
                    App.AvailableloadingButton(button_save_edit_note)
                }
            });
        }
    }


    delete_contact_note(note_id) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:note_contact-detail', note_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            data: {
                owner: App.getOwner(),
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_note_deleted');
                App.NotificationSuccess(gettext('¡Nota eliminada con éxito!'))
                this.count_notes -= 1
                App.textVisible(this.count_notes, '#text_note_contact')
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al borrar la nota.'))
            },
        });
    }


    configureValidationForms() {
        $("#form_modal_note").on('submit', function (evt) {
            evt.preventDefault();
        });
        $(document).ready(function () {
            $('#form_modal_note').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        text_note: {
                            required: true,
                            minlength: 3,
                            maxlength: 350
                        }
                    },
                    messages: {
                        text_note: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                            maxlength: gettext('Maximo 350 caracteres.')
                        }
                    }
                }
            )
        });
        $("#form_modal_edit_note").on('submit', function (evt) {
            evt.preventDefault();
        });
        $(document).ready(function () {
            $('#form_modal_edit_note').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        text_note: {
                            required: true,
                            minlength: 3,
                            maxlength: 350
                        }
                    },
                    messages: {
                        text_note: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                            maxlength: gettext('Maximo 350 caracteres.')
                        }
                    }
                }
            )
        });
    }

};
