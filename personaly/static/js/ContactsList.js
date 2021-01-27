import Handlebars from 'handlebars';
class ContactsList {

    constructor(app, api_contact) {
        this.app = app;
        this.api_contact = api_contact;

        $(document).on('contact_created', () => this.data_contacts());
        $(document).on('contact_deleted', () => this.data_contacts());
        $(document).on('contact_edited', () => this.data_contacts());

    }

    compileTemplate() {
        this.source = document.getElementById("template_items_contact").innerHTML;
        this.template = Handlebars.compile(this.source);
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
                        let tags = []
                        for (let tag in data['results'][contact]['contact_tag']) {
                            tags.push({
                                icon_tag: data['results'][contact]['contact_tag'][tag]['icon'],
                                name_tag: data['results'][contact]['contact_tag'][tag]['text']
                            })
                        }
                        contacts.push({
                            id: data['results'][contact]['id'],
                            name: data['results'][contact]['name'],
                            surnames: data['results'][contact]['surnames'],
                            image_contact: data['results'][contact]['image_contact'],
                            url: window.reverse('contact', data['results'][contact]['url']),
                            tags: tags

                        })
                    }
                }

                let context = {contacts: contacts};
                $("#item_contacts").html(this.template(context));

                this.app.page_ready()
                this.app.textVisible(0, '#contact_list_page')
            },
            error: data => {
                this.app.NotificationError(this.app.message_error_generic);
            }
        });
    }

}

export default ContactsList