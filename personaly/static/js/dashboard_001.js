class Dashboard {

    constructor(app, url_api_reminder) {
        this.app = app;
        this.url_api_reminder = url_api_reminder;

        this.complete_reminder();
    }


    complete_reminder() {
        $.ajax({
            url: this.url_api_reminder,
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_reminder = data['count']
                if (this.count_reminder > 0) {
                    let reminders = []
                    for (let reminder in data['results']) {
                        reminders.push({
                            id_reminder: data['results'][reminder]['id'],
                            reminder_text: data['results'][reminder]['text'],
                            contact: data['results'][reminder]['contact'],
                        })
                    }
                    $("#list_reminder_dashboard").loadTemplate($("#template_item_reminder"), reminders);
                }

            },
            error: data => {
                this.app.NotificationError("Error al obtener datos");
            }
        });


    }
}


