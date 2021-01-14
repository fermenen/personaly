class Contact_list {

    constructor(app, api_contact) {
        this.app = app;
        this.api_contact = api_contact;

        this.data_contacts();
    }


    data_contacts() {
        let ajax = $.ajax({
            url: this.api_contact + '?ordering=name',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                this.count_contact = data['count']
                if (this.count_contact > 0) {
                    var contacts = []
                    for (let contact in data['results']) {
                        contacts.push({
                            id: data['results'][contact]['id'],
                            name: data['results'][contact]['name'],
                            surnames: data['results'][contact]['surnames'],
                            image_contact: data['results'][contact]['image_contact'],
                            url: window.reverse('contact', data['results'][contact]['url']),

                        })
                    }

                }
                var context = {
                    contacts: contacts
                };
                var source = document.getElementById("template_items_contact").innerHTML;
                var template = Handlebars.compile(source);
                var html = template(context);

                $("#item_contacts").html(html);


                this.app.page_ready()
                this.app.textVisible(0, '#contact_list_page')
            },
            error: data => {
                this.app.NotificationError(this.app.message_error_generic);
            }
        });
    }


}


function holaContact() {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var context = {title: "My New Post", body: "This is my first post!"};
    var html = template(context);

    $("#item_contacts").html(html);

}

