"use strict";
import Handlebars from 'handlebars';
import App from "./Application";

export default class ContactsList {

    constructor() {
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
        $.ajax({
            url: window.reverse('api_v2:api_v2:contact-list', '?ordering=-name'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
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
                $('#total_contacts').text(this.count_contact)
                $("#item_contacts").html(this.template(context));
                App.textVisible(0, '#contact_list_page')
                App.textVisible(this.count_contact, '#text_contact_list')
                App.textInVisible(this.count_contact, '#button_add_contact_card_desktop')
                App.textInVisible(this.count_contact, '#button_add_contact_card_mobile')
                App.textInVisible(this.count_contact, '#component_all_contacts')
                App.page_ready()
            },
            error: data => {
                App.NotificationError(gettext('Error al obtener la lista de contactos.'));
            }
        });
    }

};