"use strict";
import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";
import Splide from '@splidejs/splide';
import {DateTime} from "luxon";

export default class ContactExperience {

    constructor() {
        $(document).on('contact_note_created', () => this.data_contact_experience());
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
                        experience_year:  DateTime.fromISO(data['results'][experience]['date']).year,
                        images: imagesA,
                    })
                }
                let context = {experiences: experiences};
                $("#component_all_experiences").html(this.template(context));
                experiences.forEach(experience => {
                    slideImages(experience['experience_id'])
                });

            },
            complete: data => {
                App.textVisible(this.count_experience, '#text_experience_contact')
                App.textInVisible(this.count_experience, '#component_all_experiences')
            }
        });
    }


    modalCreateExperience() {

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