class Remminder {

    constructor(app, contact_id, owner, api_reminder) {
        this.app = app;
        this.contact_id = contact_id;
        this.owner = owner;
        this.api_reminder = api_reminder;

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


    data_reminder_no_completed() {
        let ajax = $.ajax({
            url: this.api_reminder + '?contact=' + this.contact_id + "&completed=false",
            headers: {"X-CSRFToken": this.app.getCsrftoken},
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
            url: this.api_reminder + '?contact=' + this.contact_id + "&completed=true",
            headers: {"X-CSRFToken": this.app.getCsrftoken},
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


}