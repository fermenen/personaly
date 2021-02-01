class Web {

    constructor() {
        $(window).on('load resize', function () {
            var win = $(this);
            if (win.width() <= 600) {
                $('#text-2-web').addClass('uk-flex-first')
            } else {
                $('#text-2-web').removeClass('uk-flex-first')
            }

        });

    }

}

export default Web