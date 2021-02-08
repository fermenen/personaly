import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";

export default class Reminder {

    constructor() {
        $(document).on('reminder_edited', () => this.data_reminder_no_completed());
        $(document).on('reminder_edited', () => this.data_reminder_completed());
        $(document).on('reminder_completed', () => this.data_reminder_no_completed());
        $(document).on('reminder_completed', () => this.data_reminder_completed());
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
        $('#component_all_reminder_no_completed').addClass('uk-hidden')
    }

    show_no_completed() {
        $('#component_all_reminder_completed').addClass('uk-hidden')
        $('#button_show_no_completed_reminders').addClass('uk-hidden')

        $('#button_show_completed_reminders').removeClass('uk-hidden')
        $('#component_all_reminder_no_completed').removeClass('uk-hidden')
    }


    openModalSchedule(id_reminder) {
        if (appJS.actionOffline()) {
            App.ShowModal(modal_schedule_reminder)
        }
    }

    data_reminder_no_completed() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:reminder_contact-list', '?contact=' + Contact.getContactId() + '&completed=false'),
            headers: {"X-CSRFToken": App.getOwner()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder_today = data['count']
                if (this.count_reminder_today > 0) {
                    let reminders = []
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
                    let context = {reminders: reminders};
                    $("#component_all_reminder_no_completed").html(this.template_no_completed(context));
                }
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
                    let reminders = []
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
                    let context = {reminders: reminders};
                    $("#component_all_reminder_completed").html(this.template_completed(context));
                }
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

        }
    }

};
