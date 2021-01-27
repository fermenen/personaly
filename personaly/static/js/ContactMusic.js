import Handlebars from 'handlebars';
class ContactMusic {

    constructor(app, contact, url_api_music, url_api_search_artist) {
        this.app = app;
        this.contact = contact;

        this.url_api_music = url_api_music;
        this.url_api_search_artist = url_api_search_artist;

        this.message_success_create_music = 'message_success_create_music';
        this.message_error_create_music = 'message_error_create_music';
        this.message_error_search_music = 'message_error_search_music';

        $(document).on('contact_music_created', () => this.data_contact_music());
        $(document).on('contact_music_deleted', () => this.data_contact_music());
    }


    compileTemplate() {
        this.source = document.getElementById("template_contact_music").innerHTML;
        this.template = Handlebars.compile(this.source);
        this.data_contact_music();
    }


    data_contact_music() {
        let ajax = $.ajax({
            url: this.url_api_music + '?contact=' + this.contact.contact_id + '&ordering=name_artist',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let musics = []
                this.count_music = data['count']
                for (let music in data['results']) {
                    musics.push({
                        music_id: data['results'][music]['id'],
                        name_artist: data['results'][music]['name_artist'],
                        photo_artist: data['results'][music]['photo_artist'],
                        popularity: data['results'][music]['popularity'],
                        url_artist: data['results'][music]['url_artist'],

                    })
                }
                let context = {music: musics};
                $("#component_all_music").html(this.template(context));
            },
            complete: data => {
                this.app.textVisible(this.count_music, '#text_music_contact')
                this.app.textInVisible(this.count_music, '#component_all_music')
            }
        });
    }


    search_artist() {
        let inputSearch = $('#input_name_artist')
        if ($('#form_modal_music').valid()) {
            $.ajax({
                url: this.url_api_search_artist,
                data: {name_artist: inputSearch.val(), csrfmiddlewaretoken: this.app.getCsrftoken},
                type: 'POST',
                dataType: 'json',
                success: data => {
                    this.removeSameID('#artist_auto')
                    $('#name_artist_manual').text(inputSearch.val())
                    $('#result_search_music').removeClass('uk-hidden')
                },
                error: data => {
                    this.app.NotificationError(this.message_error_search_music)
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
            url: this.url_api_music, headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                id_artist: id_artist,
                name_artist: nameArtist,
                contact: this.contact.contact_id,
                owner: this.app.getOwner,
            },
            type: 'POST',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_music_created');
                this.app.NotificationSuccess(this.message_success_create_music)
                this.app.HideModal(modal_add_music)
            },
            error: data => {
                this.app.NotificationError(this.message_error_create_music)
            }
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

}

export default ContactMusic