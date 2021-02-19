"use strict";
import Handlebars from 'handlebars';
import Contact from "./Contact";
import App from "./Application";

export default class ContactMusic {

    constructor() {
        $(document).on('contact_music_created', () => this.data_contact_music());
        $(document).on('contact_music_deleted', () => this.data_contact_music());
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_music").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_music();
        this.configureValidationForms();
    }


    data_contact_music() {
        $.ajax({
            url: window.reverse('api_v2:api_v2:music_contact-list', '?contact=' + Contact.getContactId() + '&ordering=name_artist'),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let musics = []
                this.count_music = data['count']
                for (let music in data['results']) {
                    let genreA = []
                    for (let genre in data['results'][music]['get_list_tags']) {
                        genreA.push({
                            name_genre: data['results'][music]['get_list_tags'][genre]
                        })
                    }
                    musics.push({
                        music_id: data['results'][music]['id'],
                        name_artist: data['results'][music]['name_artist'],
                        photo_artist: data['results'][music]['photo_artist'],
                        popularity: data['results'][music]['popularity'],
                        url_artist: data['results'][music]['url_artist'],
                        genre: genreA

                    })
                }
                let context = {music: musics};
                $("#component_all_music").html(this.template(context));
            },
            complete: data => {
                App.textVisible(this.count_music, '#text_music_contact')
                App.textInVisible(this.count_music, '#component_all_music')
            }
        });
    }


    search_artist() {
        let inputSearch = $('#input_name_artist')
        if ($('#form_modal_music').valid()) {
            $.ajax({
                url: window.reverse('api_v2:api_search_artist', ''),
                data: {
                    name_artist: inputSearch.val(),
                    csrfmiddlewaretoken: App.getCsrfToken()
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    this.removeSameID('#artist_auto')
                    $('#name_artist_manual').text(inputSearch.val())
                    $('#result_search_music').removeClass('uk-hidden')
                },
                error: data => {
                    App.NotificationError(gettext('Error al buscar artista, grupo.'))
                },
                complete: (response, textStatus) => {
                    if (textStatus === 'success') {
                        let responseArtist = response['responseJSON']['data']
                        for (let artist in responseArtist.reverse()) {
                            let id = responseArtist[artist]['id']
                            let name = responseArtist[artist]['name']
                            let html = `<li id='artist_auto' onclick="musicJS.create_contact_music('${id}')"><a>${name}</a></li>`
                            $('#list_result_music').prepend(html)
                        }
                    }
                }
            });

        }
    }


    create_contact_music(id_artist) {
        let nameArtist = $('#name_artist_manual').text()
        $.ajax({
            url: window.reverse('api_v2:api_v2:music_contact-list', ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            data: {
                id_artist: id_artist,
                name_artist: nameArtist,
                contact: Contact.getContactId(),
            },
            type: 'POST',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_music_created');
                App.NotificationSuccess(gettext('¡Artista, grupo añadido con éxito!'))
                App.HideModal(modal_add_music)
            },
            error: data => {
                App.NotificationError(gettext('Error al añadir artista, grupo, inténtelo de nuevo.'))
            }
        });

    }


    deleteMusicContact(music_id) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:music_contact-detail', music_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_music_deleted');
                App.NotificationSuccess(gettext('¡Artista, grupo eliminado con éxito!'))
            },
            error: data => {
                App.NotificationError(gettext('Ocurrió un problema al borrar el artista.'))
            },
        });
    }


    removeSameID(id) {
        const elements = document.querySelectorAll(id);
        for (let i = 0; i < elements.length; i++) {
            elements[i].remove();
        }
    }

    cleanCloseModalAddMusic() {
        UIkit.modal(modal_add_music).hide();
        this.removeSameID('#artist_auto')
        $('#result_search_music').addClass('uk-hidden')
        $('#input_name_artist').val('')
    }


    configureValidationForms() {

        $("#form_modal_music").on('submit', function (evt) {
            evt.preventDefault();
            musicJS.search_artist();
        });
        $(document).ready(function () {
            $('#form_modal_music').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        input_search_artist: {
                            required: true,
                            minlength: 3
                        }
                    },
                    messages: {
                        input_search_artist: {
                            required: gettext('Campo obligatorio.'),
                            minlength: gettext('Mínimo 3 caracteres.'),
                        }
                    }
                }
            )
        });
    }

};