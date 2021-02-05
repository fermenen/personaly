import Contact from "./Contact";
import App from "./Application";
import Handlebars from "handlebars";
import tippy from "tippy.js";
import 'emoji-picker-element';

export default class ContactTag {

    constructor() {
        this.message_success_create_tag = gettext('¡Etiqueta creada con éxito!');
        this.message_error_create_tag = gettext('Error al crear la etiqueta, inténtelo de nuevo.');
        this.message_success_delete_tag = gettext('¡Etiqueta borrada con éxito!');
        this.message_error_delete_tag = gettext('Error al borrar la etiqueta');
    }


    compileTemplate() {
        this.configureFormModalTag();
        this.source_tags_edit = document.getElementById("template_tags_contact").innerHTML;
        this.template_tags_edit = Handlebars.compile(this.source_tags_edit);

        $(document).on('contact_tag_created', () => this.dataTags());
        $(document).on('contact_tag_deleted', () => this.dataTags());
        this.eventEmojiSelect();
    }


    dataTags() {
        this.configureEmojiPicker();
        let ajax = $.ajax({
            url: window.reverse('api_v2:api_v2:tag_contact-list', '?contact=' + Contact.getContactId()),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            type: 'GET',
            dataType: 'json',
            success: data => {
                let tags = []
                this.count_tag = data['count'];
                for (let tag in data['results']) {
                    tags.push({
                        id_tag: data['results'][tag]['id'],
                        icon_tag: data['results'][tag]['icon'],
                        name_tag: data['results'][tag]['text']
                    })
                }
                const tagsA = {tags: tags}
                $("#component_all_tags_edit").html(this.template_tags_edit(tagsA));
            }
        });

    }


    openModalEditTags() {
        this.dataTags();
        App.ShowModal(modal_edit_label);
    }


    createTagContact() {
        let button_save = '#button_create_tag_contact'
        let form_modal_tag = '#form_modal_tag'
        if ($(form_modal_tag).valid()) {
            App.DisabledButton(button_save)
            App.LoadingButton(button_save)
            $.ajax({
                url: window.reverse('api_v2:api_v2:tag_contact-list', ''),
                headers: {"X-CSRFToken": App.getCsrfToken()},
                data: {
                    icon: $("#form_modal_tag input[name=icon_emoji]").val(),
                    text: $("#form_modal_tag input[name=name_tag]").val(),
                    contact: Contact.getContactId(),
                    owner: App.getOwner(),
                },
                type: 'POST',
                dataType: 'json',
                success: data => {
                    jQuery.event.trigger('contact_tag_created');
                    App.NotificationSuccess(this.message_success_create_tag)
                    App.HideModal(modal_edit_label)
                    $("#form_modal_tag input[name=icon_emoji]").val("")
                    $("#form_modal_tag input[name=name_tag]").val("")
                },
                error: data => {
                    App.NotificationError(this.message_error_create_tag)
                },
                complete: data => {
                    App.AvailableButton(button_save)
                    App.AvailableloadingButton(button_save)
                }
            });
        }
    }


    deleteTagContact(tag_id) {
        $.ajax({
            url: window.reverse('api_v2:api_v2:tag_contact-detail', tag_id, ''),
            headers: {"X-CSRFToken": App.getCsrfToken()},
            data: {
                owner: Contact.getContactId(),
            },
            type: 'DELETE',
            dataType: 'json',
            success: data => {
                jQuery.event.trigger('contact_tag_deleted');
                App.NotificationSuccess(this.message_success_delete_tag)
                this.count_tag -= 1
                // this.app.textVisible(this.count_notes, '#text_note_contact')
            },
            error: data => {
                App.NotificationError(this.message_error_delete_tag)
            },
        });
    }


    configureEmojiPicker() {
        this.tippy1 = tippy('#button_select_emoji', {
            content: '<div id="picker_emoji"><emoji-picker></emoji-picker></div>',
            allowHTML: true,
            trigger: "click",
            interactive: true,
            animation: "fade",
            arrow: true,
        });
    }


    eventEmojiSelect() {
        $(document).on('emoji-click', event => {
                $('#emoji-label-input').val(event.detail.emoji.unicode)
                this.tippy1[0].hide();
                this.configureEmojiPicker();
            }
        );
    }

    configureFormModalTag() {
        $("#form_modal_tag").on('submit', function (evt) {
            evt.preventDefault();
        });
        $(document).ready(function () {
            $('#form_modal_tag').validate({
                    errorClass: "uk-form-danger uk-text-small",
                    rules: {
                        name_tag: {
                            required: true,
                            minlength: 3,
                            maxlength: 350
                        }
                    },
                    messages: {
                        name_tag: {
                            required: '',
                            minlength: '',
                            maxlength: ''
                        }
                    }
                }
            )
        });

    }

};