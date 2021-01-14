class Dashboard {

    constructor(app) {
        this.app = app;
        this.data_reminder_today();
        this.data_reminder_next();
    }

    update_page() {
        this.app.textVisible(this.count_reminder_today, '#text_reminder_dashboard')
        this.app.textVisible(0, '#dashboard_today')
        this.app.textInVisible(this.count_reminder_today, '#component_all_reminder')
        this.app.textInVisible(this.count_reminder_next, '#button_dashboard_next')

        this.app.page_ready()
    }

    set_next() {
        $('#dashboard_today').addClass('uk-hidden')
        $('#dashboard_next').removeClass('uk-hidden')
    }

    set_today() {
        $('#dashboard_today').removeClass('uk-hidden')
        $('#dashboard_next').addClass('uk-hidden')
    }


    data_reminder_today() {
        let ajax = $.ajax({
            url:  window.reverse('api_v2:reminder_contact-list', '?lte_days=0&ordering=deadline'),
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder_today = data['count']
                if (this.count_reminder_today > 0) {
                    let reminders = []
                    for (let reminder in data['results']) {
                        let r = "";
                         if (data['results'][reminder]['days'] === 0)
                             r = "uk-hidden"
                        reminders.push({
                            id_reminder: data['results'][reminder]['id'],
                            reminder_text: data['results'][reminder]['text'],
                            contact_name: data['results'][reminder]['contact']['name'],
                            contact_surname: data['results'][reminder]['contact']['surnames'],
                            contact_href: window.reverse('contact', data['results'][reminder]['contact']['url']),
                            reminder_back: r,
                        })
                    }
                    $('#list_reminder_dashboard_today').loadTemplate($("#template_item_reminder"), reminders);
                    this.update_page()
                }
            },
            error: data => {
                this.app.NotificationError(this.app.message_error_generic);
            }
        });
    }

    data_reminder_next() {
        let ajax = $.ajax({
            url:  window.reverse('api_v2:reminder_contact-list', '?gte_days=1'),
            headers: {"X-CSRFToken": this.app.getCsrftoken},
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
                            contact_name: data['results'][reminder]['contact']['name'],
                            contact_surname: data['results'][reminder]['contact']['surnames'],
                            contact_href: window.reverse('contact', data['results'][reminder]['contact']['url']),
                            days: data['results'][reminder]['days'],
                            date: data['results'][reminder]['deadline'],
                        })
                    }
                    $('#list_reminder_dashboard_next').loadTemplate($("#template_item_reminder_next"), reminders);
                    this.update_page()
                }
            },
            error: data => {
                this.app.NotificationError(this.app.message_error_generic);
            }
        });
    }

}
