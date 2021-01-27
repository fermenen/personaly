import Handlebars from 'handlebars';
class Contact {

    constructor(app, contact_id, owner, api_contact) {
        this.app = app;
        this.contact_id = contact_id;
        this.owner = owner;
        this.api_contact = api_contact;

        $(document).on('contact_edited', () => this.data_contact_header());
    }


    // Metodo para hacer visilbe o no el texto promo debajo del boton de añadir
    textVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).removeClass('uk-hidden')
        } else {
            $(textVisible).addClass('uk-hidden')
        }
    }

    compileTemplate() {
        this.source = document.getElementById("template_contact_header").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_header();
        this.app.page_ready();
    }

    data_contact_header() {
        let ajax = $.ajax({
            url: this.api_contact + this.contact_id + '/',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
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


}

$(window).on('load resize', function mobileContact() {
    let win = $(this);
    if (win.width() <= 700) {
        $('#tab_contact').addClass('uk-tab-right');
    } else {
        $("#tab_contact").removeClass('uk-tab-right');
    }

});


export default Contact