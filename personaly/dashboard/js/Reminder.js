"use strict";
import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";
import {DateTime} from "luxon";

export default class Reminder {


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
                    $("#form_modal_edit_schedule_reminder input[id=reminder_id_schedule]").val(id_reminder)
                    $("#form_modal_edit_schedule_reminder input[id=deadline_reminder_schedule]").val(data['deadline'])
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
            $("#form_modal_create_reminder input[id=id_contact_create_reminder]").val(contact_id)
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
                this.count_reminder_no_completed = data['count']
                if (this.count_reminder_no_completed > 0) {
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
                $('#total_reminder_no_completed').text(this.count_reminder_no_completed)
                $("#component_all_reminder_no_completed_items").html(this.template_no_completed(context));
                App.textVisible(this.count_reminder_no_completed, '#text_reminder_contact')
                App.textInVisible(this.count_reminder_no_completed, '#component_all_reminder_no_completed')
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
                $('#total_reminder_completed').text(this.count_reminder_completed)
                $("#component_all_reminder_completed_items").html(this.template_completed(context));
                App.textInVisible(this.count_reminder_completed, '#text_reminder_completed')
            },
        });
    }


    completeReminder(id_reminder) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
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
    }

    deleteReminder(id_reminder) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
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
                    contact: $("#form_modal_create_reminder input[id=id_contact_create_reminder]").val(),
                },
                type: 'POST',
                dataType: 'json',
                success: function () {
                    jQuery.event.trigger('reminder_created');
                    App.NotificationSuccess(gettext('¡Recordatorio creado con éxito!'))
                    App.HideModal(modal_create_reminder)
                    $("#form_modal_create_reminder input[id=text_reminder]").val("")
                    $("#form_modal_create_reminder input[id=deadline_reminder]").val("")
                },
                error: function () {
                    App.NotificationError(gettext('Error al crear el recordatorio, inténtalo de nuevo.'))
                },
                complete: function () {
                    App.AvailableButton(button_create_reminder)
                    App.AvailableloadingButton(button_create_reminder)
                }
            });
        }
    }

    changeTextReminder(id_reminder, original_text) {
        let input_text_reminder = $('#text_reminder_' + id_reminder)
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', id_reminder, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    text: input_text_reminder.val(),
                },
                type: 'PATCH',
                dataType: 'json',
                success: function () {
                    App.NotificationSuccess(gettext('¡Recordatorio actualizado con éxito!'))
                    jQuery.event.trigger('reminder_edited');
                },
                error: function () {
                    App.NotificationError(gettext('Ocurrió un problema al actualizar el recordatorio.'))
                    input_text_reminder.val(original_text)
                },
            });
        } else {
            input_text_reminder.val(original_text)
        }
    }

    changeDeadLineReminder() {
        if ($('#form_modal_edit_schedule_reminder').valid() && appJS.actionOffline()) {
            let reminder_id = $("#form_modal_edit_schedule_reminder input[id=reminder_id_schedule]").val()
            $.ajax({
                url: window.reverse('api_v2:api_v2:reminder_contact-detail', reminder_id, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    deadline: $("#form_modal_edit_schedule_reminder input[id=deadline_reminder_schedule]").val(),
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

    configureScheduleReminder() {
        $("#form_modal_edit_schedule_reminder").on('submit', function (evt) {
            evt.preventDefault();
        });
        $(document).ready(function () {
            $('#form_modal_edit_schedule_reminder').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        deadline_reminder_schedule: {
                            required: true,
                            dateISO: true,
                        }
                    },
                    messages: {
                        deadline_reminder_schedule: {
                            required: gettext('Campo obligatorio.'),
                            dateISO: gettext('Fecha no valida.'),
                        }
                    }
                }
            )
        });

    }

};
