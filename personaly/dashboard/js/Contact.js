import App from "./Application";
import Handlebars from 'handlebars';

export default class Contact {

    constructor(contact_id) {
        this.contact_id = contact_id;
        $(document).on('contact_edited', () => this.data_contact_header());
        $(document).on('contact_tag_created', () => this.data_contact_header());
        $(document).on('contact_tag_deleted', () => this.data_contact_header());

    }

    static getContactId() {
        return contact_id;
    }

    compileTemplate() {
        this.mobileAdapt();
        this.source = document.getElementById("template_contact_header").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_header();
        App.page_ready();
    }

    data_contact_header() {
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:contact-detail', this.contact_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let tags = []
                for (let tag in data['contact_tag']) {
                    tags.push({
                        icon_tag: data['contact_tag'][tag]['icon'],
                        name_tag: data['contact_tag'][tag]['text']
                    })
                }
                var contact = {
                    id: data['id'],
                    name: data['name'],
                    surnames: data['surnames'],
                    image_contact: data['image_contact'],
                    phone: data['phone'],
                    location: data['location'],
                    tags: tags

                }
                $("#component_contact_header").html(this.template(contact));
            }
        });

    }

    mobileAdapt() {
        $(window).on('load resize', function mobileContact() {
            let win = $(this);
            if (win.width() <= 700) {
                $('#tab_contact').addClass('uk-tab-right');
            } else {
                $("#tab_contact").removeClass('uk-tab-right');
            }
        })
    }

};