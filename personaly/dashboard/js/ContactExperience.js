"use strict";
import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";
import Splide from '@splidejs/splide';
import {DateTime} from "luxon";

export default class ContactExperience {

    constructor() {
        $(document).on('contact_experience_created', () => this.data_contact_experience());
        $(document).on('contact_note_updated', () => this.data_contact_experience());
        $(document).on('contact_note_deleted', () => this.data_contact_experience());
    }

    compileTemplate() {
        this.source = document.getElementById("template_contact_experience").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_experience();
    }

    data_contact_experience() {
        $.ajax({
            url: window.reverse('api_v2:api_v2:experience_contact-list', '?contact=' + Contact.getContactId() + '&ordering=-created_at'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let experiences = []
                this.count_experience = data['count']
                for (let experience in data['results']) {
                    let imagesA = []
                    for (let image in data['results'][experience]['images']) {
                        imagesA.push({
                            id_image: data['results'][experience]['images'][image]['id'],
                            url_image: data['results'][experience]['images'][image]['image']
                        })
                    }
                    experiences.push({
                        experience_id: data['results'][experience]['id'],
                        experience_tittle: data['results'][experience]['tittle'],
                        experience_location: data['results'][experience]['location'],
                        experience_year: DateTime.fromISO(data['results'][experience]['date']).year,
                        images: imagesA,
                    })
                }
                let context = {experiences: experiences};
                $("#component_all_experiences").html(this.template(context));
                experiences.forEach(experience => {
                    if (experience['images'].length > 0) {
                        slideImages(experience['experience_id'])
                    }
                });
            },
            complete: data => {
                App.textVisible(this.count_experience, '#text_experience_contact')
                App.textInVisible(this.count_experience, '#component_all_experiences')
            }
        });
    }


    modalCreateExperience() {
        if (appJS.actionOffline()) {
            App.ShowModal(modal_create_experience)
        }
    }


    uploadImage() {
        UIkit.upload('.images_experience', {
            url: window.reverse('api_v2:image-list', ''),
            multiple: false,
            params: {
                csrfmiddlewaretoken: App.getCsrfToken()
            },
            completeAll: function (data) {
                let response = JSON.parse(data['response'])
                let textDelete = gettext('Borrar')
                let html = `<li id='${response.id}'><div class="uk-flex uk-flex-inline"><img src='${response.image}' style="height: 45px"><button onclick="experienceJS.deleteImageModal('${response.id}')" class="uk-button uk-button-danger uk-button-small uk-margin-small-left">${textDelete}</div></li>`
                $('#list_images').append(html)
            },
            error: function () {
                App.NotificationError(gettext('Error al subir imagen.'))
            },
        });
    }


    createContactExperience() {
        if (appJS.actionOffline()) {
            let images = []
            $('#list_images').each(item_list => {
                images.push($('#list_images li').get(item_list).id)
            })
            $.ajax({
                url: window.reverse('api_v2:api_v2:experience_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    tittle: $('#form_create_experience input[name=tittle]').val(),
                    location: $('#form_create_experience input[name=location]').val(),
                    date: $('#form_create_experience input[name=date]').val(),
                    images: images,
                    contact: Contact.getContactId(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_experience_created');
                    App.NotificationSuccess(gettext('¡Experiencia añadida con éxito!'))
                    App.HideModal(modal_create_experience)
                },
                error: data => {
                    App.NotificationError(gettext('Error téntelo de nuevo.'))
                }
            });
        }
    }


    deleteImageModal(id_image) {
        if (appJS.actionOffline()) {
            $.ajax({
                url: window.reverse('api_v2:api_v2:image-detail', id_image, ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                type: 'DELETE',
                dataType: 'json',
                success: function () {
                    $('#' + id_image).remove()
                },
                error: function () {
                    App.NotificationError(gettext('Ocurrió un problema al borrar la imagen.'))
                },
            });
        }
    }

}

function slideImages(experience_id) {
    new Splide('#image_slider_' + experience_id, {
        type: 'loop',
        padding: {
            right: '5rem',
            left: '5rem',
        },
        focus: 'center',
        autoWidth: true,
    }).mount();
}