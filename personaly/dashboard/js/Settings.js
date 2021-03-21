import App from "./Application";

export default class Settings {

    constructor() {
        this.configureCheckboxTheme()
    }

    compileTemplate() {
        App.page_ready();
        App.textVisible(0, '#settings_card')
    }


    configureCheckboxTheme() {
        $(document).ready(function () {
            if (appJS.darkMode.isActivated()) {
                $('#checkbox_theme').prop("checked", true);
            } else {
                $('#checkbox_theme').prop("checked", false);
            }
        })

    }

}