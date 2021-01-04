class Contact_music {

    constructor(app, contact, count_music, message_error_search, message_error_save, message_error_delete_music, message_success_delete_music, url_api_music, url_api_search_artist) {
        this.app = app;
        this.contact = contact;
        this.count_music = count_music;
        this.message_error_search = message_error_search;
        this.message_error_save = message_error_save;
        this.message_error_delete_music = message_error_delete_music;
        this.message_success_delete_music = message_success_delete_music;
        this.url_api_music = url_api_music;
        this.url_api_search_artist = url_api_search_artist;
    }

    get getCountMusic() {
        return this.count_music;
    }

    // Buscar artist a traves de api propia
    searchArtist() {
        let inputSearch = $('#input_name_artist')
        if ($('#form_modal_music').valid()) {
            $.ajax({
                url: this.url_api_search_artist,
                data: {name_artist: inputSearch.val(), csrfmiddlewaretoken: this.app.getCsrftoken},
                type: 'POST',
                dataType: 'json',
                success: data => {
                    removeSameID('#artist_auto')
                    $('#name_artist_manual').text(inputSearch.val())
                    $('#result_search_music').removeClass('uk-hidden')
                },
                error: data => {
                    this.app.NotificationError(this.message_error_search)
                },
                complete: (response, textStatus) => {
                    if (textStatus === 'success') {
                        let responseArtist = response['responseJSON']['data']
                        for (let artist in responseArtist.reverse()) {
                            let id = responseArtist[artist]['id']
                            let name = responseArtist[artist]['name']
                            let html = `<li id='artist_auto' onclick="musicJS.createContactMusic('${id}')"><a>${name}</a></li>`
                            $('#list_result_music').prepend(html)
                        }
                    }
                }
            });

        }
    }


    // Crear MusicContact
    createContactMusic(id) {
        let nameArtist = $('#name_artist_manual').text()
        $.ajax({
            url: this.url_api_music,
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                id_artist: id,
                name_artist: nameArtist,
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
            },
            type: 'POST',
            dataType: 'json',
            success: data => {
                this.app.HideModal(modal_add_music)
                location.reload();
            },
            error: data => {
                cleanCloseModalAddMusic()
                this.app.NotificationError(this.message_error_save)
            },
        });
    }


    // Borrar MusicContact a traves de ID
    deleteContactMusic(id) {
        let StringDivID = '#' + id
        $.ajax({
            url: this.url_api_music + id + '/',
            headers: {"X-CSRFToken": this.app.getCsrftoken},
            data: {
                contact: this.contact.getContact,
                owner: this.contact.getOwner,
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                this.app.NotificationSuccess(this.message_success_delete_music)
                $(StringDivID).addClass('uk-hidden')
                this.count_music -= 1
                this.contact.textVisible(this.count_music, '#text_music_contact')
            },
            error: data => {
                this.app.NotificationError(this.message_error_delete_music)
            },
        });
    }


}

function removeSameID(id) {
    const elements = document.querySelectorAll(id);
    for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
}

function cleanCloseModalAddMusic() {
    UIkit.modal(modal_add_music).hide();
    removeSameID('#artist_auto')
    $('#result_search_music').addClass('uk-hidden')
    $('#input_name_artist').val('')
}