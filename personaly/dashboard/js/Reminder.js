import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";
import {DateTime} from "luxon";

export default class Reminder {

    constructor() {
        $(document).on('reminder_created', () => this.data_reminder_no_completed());
        $(document).on('reminder_edited', () => this.data_reminder_no_completed());
        $(document).on('reminder_edited', () => this.data_reminder_completed());
        $(document).on('reminder_completed', () => this.data_reminder_no_completed());
        $(document).on('reminder_completed', () => this.data_reminder_completed());
        $(document).on('reminder_deleted', () => this.data_reminder_no_completed());
        $(document).on('reminder_deleted', () => this.data_reminder_completed());
    }


    compileTemplate() {
        let source_no_completed = document.getElementById("template_contact_reminder").innerHTML;
        let source_completed = document.getElementById("template_contact_reminder_completed").innerHTML;
        this.template_no_completed = Handlebars.compile(source_no_completed);
        this.template_completed = Handlebars.compile(source_completed);

        this.data_reminder_no_completed();
        this.data_reminder_completed();
    }

    show_completed() {
        $('#component_all_reminder_completed').removeClass('uk-hidden')
        $('#button_show_no_completed_reminders').removeClass('uk-hidden')

        $('#button_show_completed_reminders').addClass('uk-hidden')
        $('#reminder_no_completed').addClass('uk-hidden')
    }

    show_no_completed() {
        $('#component_all_reminder_completed').addClass('uk-hidden')
        $('#button_show_no_completed_reminders').addClass('uk-hidden')

        $('#button_show_completed_reminders').removeClass('uk-hidden')
        $('#reminder_no_completed').removeClass('uk-hidden')
    }


    openModalSchedule(id_reminder) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                type: 'GET',
                dataType: 'json',
                success: data => {
                    $("#form_modal_edit_reminder input[id=reminder_id]").val(id_reminder)
                    $("#form_modal_edit_reminder input[id=deadline_reminder]").val(data['deadline'])
                    App.ShowModal(modal_schedule_reminder)
                },
                error: data => {
                    App.NotificationError(gettext('Error al editar el recordatorio, inténtalo de nuevo.'))
                }
            });
        }
    }

    openModalCreateReminder(contact_id) {
        if (appJS.actionOffline()) {
            $("#form_modal_create_reminder input[id=id_contact]").val(contact_id)
            App.ShowModal(modal_create_reminder)
        }
    }

    data_reminder_no_completed() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:reminder_contact-list', '?contact=' + Contact.getContactId() + '&completed=false&ordering=deadline'),
            headers: {"X-CSRFToken": App.getOwner()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder_today = data['count']
                if (this.count_reminder_today > 0) {
                    var reminders = []
                    for (let reminder in data['results']) {
                        let deadline = data['results'][reminder]['deadline']
                        if (deadline != null) {
                            deadline = DateTime.fromISO(data['results'][reminder]['deadline']).toLocaleString(DateTime.DATE_SHORT)
                        }
                        reminders.push({
                            id_reminder: data['results'][reminder]['id'],
                            reminder_text: data['results'][reminder]['text'],
                            deadline: deadline,
                            days: data['results'][reminder]['days'],
                            today: data['results'][reminder]['today'],
                            future: data['results'][reminder]['future'],
                            past: data['results'][reminder]['past'],
                        })
                    }
                }
                let context = {reminders: reminders};
                $("#component_all_reminder_no_completed").html(this.template_no_completed(context));
                App.textVisible(this.count_reminder_today, '#text_reminder_contact')
            },
        });
    }


    data_reminder_completed() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:reminder_contact-list', '?contact=' + Contact.getContactId() + '&completed=true'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder_completed = data['count']
                if (this.count_reminder_completed > 0) {
                    var reminders = []
                    for (let reminder in data['results']) {
                        reminders.push({
                            id_reminder: data['results'][reminder]['id'],
                            reminder_text: data['results'][reminder]['text'],
                            deadline: data['results'][reminder]['deadline'],
                            days: data['results'][reminder]['days'],
                            today: data['results'][reminder]['today'],
                            future: data['results'][reminder]['future'],
                            past: data['results'][reminder]['past'],
                        })
                    }
                }
                let context = {reminders: reminders};
                $("#component_all_reminder_completed").html(this.template_completed(context));
            },
        });
    }


    completeReminder(id_reminder) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            data: {
                owner: App.getOwner(),
                completed: true,
            },
            type: 'PATCH',
            dataType: 'json',
            success: data => {
                App.HideModal(modal_delete_contact)
                App.NotificationSuccess(gettext('¡Recordatorio completado!'))
                jQuery.event.trigger('reminder_completed');
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al completar el recordatorio.'))
            },
        });
    }

    deleteReminder(id_reminder) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    owner: App.getOwner(),
                },
                type: 'DELETE',
                dataType: 'json',
                success: data => {
                    App.NotificationSuccess(gettext('¡Recordatorio eliminado con éxito!'))
                    jQuery.event.trigger('reminder_deleted');
                },
                error: data => {
                    App.NotificationError(gettext('Error al borrar el recordatorio, inténtalo de nuevo.'))
                },
            });
        }
    }


    createReminder() {
        let button_create_reminder = '#button_save_create_reminder'
        let form_modal_reminder = '#form_modal_create_reminder'
        if ($(form_modal_reminder).valid() && appJS.actionOffline()) {
            App.DisabledButton(button_create_reminder)
            App.LoadingButton(button_create_reminder)
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    text: $("#form_modal_create_reminder input[id=text_reminder]").val(),
                    deadline: $("#form_modal_create_reminder input[id=deadline_reminder]").val(),
                    contact: $("#form_modal_create_reminder input[id=id_contact]").val(),
                    owner: App.getOwner(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('reminder_created');
                    App.NotificationSuccess(gettext('¡Recordatorio creado con éxito!'))
                    App.HideModal(modal_create_reminder)
                    $("#form_modal_create_reminder input[id=text_reminder]").val("")
                },
                error: data => {
                    App.NotificationError(gettext('Error al crear el recordatorio, inténtalo de nuevo.'))
                },
                complete: data => {
                    App.AvailableButton(button_create_reminder)
                    App.AvailableloadingButton(button_create_reminder)
                }
            });
        }
    }

    changeTextReminder(id_reminder, original_text) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    owner: App.getOwner(),
                    text: $('#' + id_reminder).val(),
                },
                type: 'PATCH',
                dataType: 'json',
                success: data => {
                    App.NotificationSuccess(gettext('¡Recordatorio actualizado con éxito!'))
                    jQuery.event.trigger('reminder_edited');
                },
                error: data => {
                    App.NotificationError(gettext('Ocurrió un problema al actualizar el recordatorio.'))
                    $('#' + id_reminder).val(original_text)
                },
            });
        } else {
            $('#' + id_reminder).val(original_text)
        }
    }

    changeDeadLineReminder() {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', $("#form_modal_edit_reminder input[id=reminder_id]").val(), ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    owner: App.getOwner(),
                    deadline: $("#form_modal_edit_reminder input[id=deadline_reminder]").val(),
                },
                type: 'PATCH',
                dataType: 'json',
                success: data => {
                    App.NotificationSuccess(gettext('¡Recordatorio actualizado con éxito!'))
                    jQuery.event.trigger('reminder_edited');
                    App.HideModal(modal_schedule_reminder)
                },
                error: data => {
                    App.NotificationError(gettext('Ocurrió un problema al actualizar el recordatorio.'))

                },
                complete: data => {
                    $("#form_modal_edit_reminder input[id=deadline_reminder]").val("")
                }
            });
        }
    }


}
