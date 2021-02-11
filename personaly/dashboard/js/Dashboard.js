import Handlebars from "handlebars";
import {DateTime} from 'luxon';
import Contact from "./Contact";
import App from "./Application";


export default class Dashboard {

    constructor() {
        $(document).on('reminder_deleted', () => this.refresh());
    }

    set_next() {
        $('#dashboard_today').addClass('uk-hidden')
        $('#dashboard_next').removeClass('uk-hidden')
    }

    set_today() {
        $('#dashboard_today').removeClass('uk-hidden')
        $('#dashboard_next').addClass('uk-hidden')
    }


    compileTemplate() {
        let source_today = document.getElementById("template_items_reminder_today").innerHTML;
        let source_next = document.getElementById("template_items_reminder_next").innerHTML;
        this.template_today = Handlebars.compile(source_today);
        this.template_next = Handlebars.compile(source_next);
        this.refresh();
    }

    refresh() {
        this.data_reminder_today();
        this.data_reminder_next();
    }

    data_reminder_today() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:reminder_contact-list', '?lte_days=0&ordering=deadline&completed=false'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
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
                            contact_name: data['results'][reminder]['contact_info']['name'],
                            contact_surname: data['results'][reminder]['contact_info']['surnames'],
                            past: data['results'][reminder]['past'],
                            contact_href: window.reverse('contact', data['results'][reminder]['contact_info']['url']),
                        })
                    }
                    let context = {reminders: reminders};
                    $("#list_reminder_dashboard_today").html(this.template_today(context));
                }
                App.textVisible(this.count_reminder_today, '#text_reminder_dashboard')
                App.textVisible(0, '#dashboard_today')
                App.textInVisible(this.count_reminder_today, '#component_all_reminder')
                App.page_ready()
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al actualizar los recordatorios.'));
            }
        });
    }

    data_reminder_next() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:reminder_contact-list', '?gte_days=1'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder_next = data['count']
                if (this.count_reminder_next > 0) {
                    let reminders = []
                    for (let reminder in data['results']) {
                        reminders.push({
                            id_reminder: data['results'][reminder]['id'],
                            reminder_text: data['results'][reminder]['text'],
                            contact_name: data['results'][reminder]['contact_info']['name'],
                            contact_surname: data['results'][reminder]['contact_info']['surnames'],
                            contact_href: window.reverse('contact', data['results'][reminder]['contact_info']['url']),
                            days: data['results'][reminder]['days'],
                            date: DateTime.fromISO(data['results'][reminder]['deadline']).toLocaleString(DateTime.DATE_FULL),
                            // date: data['results'][reminder]['deadline'],
                        })
                    }
                    let context = {reminders: reminders};
                    $("#list_reminder_dashboard_next").html(this.template_next(context));

                }
                App.textInVisible(this.count_reminder_next, '#button_dashboard_next')
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al actualizar los recordatorios.'));
            }
        });
    }

};