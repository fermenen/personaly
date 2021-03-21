"use strict";
import Darkmode from 'darkmode-js';

class App {

    constructor(owner) {
        this.configureModeOffline();
        this.addServiceWorker()
        this.dark()
        this.jQueryValidators();
        this.owner = owner;

        console.log('%cADVERTENCIA WARNING', 'background: #ee395b; color: #DFEDF2; font-size: 21px');
        console.log('%cSi utilizas esta consola, otras personas podrían hacerse pasar por ti y robarte datos mediante un ataque llamado Self-XSS', 'background: #ee395b; color: #05C7F2; font-size: 16px');
    }

    dark() {
        const options = {
            saveInCookies: true,
            autoMatchOsTheme: false
        }
        this.darkmode = new Darkmode(options);
    }

    get darkMode(){
        return this.darkmode
    }

    darkToggle() {
        this.darkmode.toggle();
    }

    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js');
            });
        }
    }

    configureModeOffline() {
        $(window).on("load", this.updateModeOffline);
        window.addEventListener('offline', this.updateModeOffline);
        window.addEventListener("online", this.updateModeOffline);
    }

    updateModeOffline(event) {
        if (navigator.onLine) {
            $('#mode_offline_warning').addClass('uk-hidden')
        } else {
            $('#mode_offline_warning').removeClass('uk-hidden')
        }
    }

    actionOffline() {
        if (navigator.onLine) {
            return true
        } else {
            App.NotificationWarning(gettext('Acción no disponible en modo offline.'))
            return false
        }
    }

    static page_ready() {
        $('#loading_app').addClass('uk-hidden')
    }

    get getOwner() {
        return this.owner;
    }

    static getOwner() {
        return owner;
    }

    static lang() {
        return $('#lang').text();
    }

    static urlLang() {
        return '/' + this.lang();
    }

    get getCountContacts() {
        return this.count_contact;
    }


    static textVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).removeClass('uk-hidden')
        } else {
            $(textVisible).addClass('uk-hidden')
        }
    }

    static textInVisible(count, textVisible) {
        if (count === 0) {
            $(textVisible).addClass('uk-hidden')
        } else {
            $(textVisible).removeClass('uk-hidden')
        }
    }

    static NotificationError(message_error) {
        UIkit.notification({message: message_error, status: 'danger'})
    }

    static NotificationSuccess(message_success) {
        UIkit.notification({message: message_success, status: 'success'})
    }

    static NotificationWarning(message_warning) {
        UIkit.notification({message: message_warning, status: 'warning'})
    }

    static HideModal(modal) {
        UIkit.modal(modal).hide();
    }

    static ShowModal(modal) {
        UIkit.modal(modal).show();
    }

    static DisabledButton(name) {
        $(name).addClass('uk-disabled')
    }

    static AvailableButton(name) {
        $(name).removeClass('uk-disabled')
    }

    static LoadingButton(name) {
        $(name).html('<div uk-spinner></div>')
    }

    static AvailableloadingButton(name) {
        $(name).html($(name).data('value'))
    }


    searchPlaces() {
        const places = require('places.js');
        const fixedOptions = {
            appId: 'plVYBCB02Y6T',
            apiKey: '2e2a874c73db4a2dcf6ea5f5bbed99f5',
            container: document.querySelector('#input_city_contact')
        };
        const reconfigurableOptions = {
            language: 'es',
            type: 'city',
            aroundLatLngViaIP: true
        };
        const placesInstance = places(fixedOptions).configure(reconfigurableOptions);
    }

    jQueryValidators() {
        jQuery.validator.addMethod("lettersonly", function (value, element) {
            let myRegex = /^[a-z ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/i
            return this.optional(element) || myRegex.test(value);
        }, "Letters only please");
    }


    static getCsrfToken() {
        return $("input[name=csrfmiddlewaretoken]").val();
    }

    page_ready() {
        $('#loading_app').addClass('uk-hidden')
    }
}


export default App