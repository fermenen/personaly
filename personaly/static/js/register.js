// Button 1 register
function step1register(url) {
    disabledButton('#button-register')
    registerUser(url)
}
// Button 2 confirm
function step2register(url) {
    disabledButton('#button-confirm')
    checkMailCode()
}


function registerUser(url) {
    let requestRegister = $.ajax({
        url: url,
        data: {
            plan: 1, email: $('#email').val(), password: $('#password').val(), terms: $('#terms').prop('checked'),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            showStep2Mail()
        },
        error: function (jqXHR, status, error) {
            alert("Disculpe, existió un problema " + error);
        },
    });
    requestRegister.done(function (json) {
        $('#userId').text(json['id'])
        sendCode();
    })
}

function sendCode() {
    console.log('Enviando mail a ' + $('#userId').text())
    let requestSendCode = $.ajax({
        url: 'http://127.0.0.1:8000/api/v1/mail/send_code_user',
        data: {
            id: $('#userId').text(), csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {

        },
        error: function (jqXHR, status, error) {
            alert("Disculpe, existió un problema " + error);
        },
    });

}

function checkMailCode(){

    console.log('compirbo el codugo')


    let requestSendCode = $.ajax({
        url: 'http://127.0.0.1:8000/api/v1/mail/check_code_user',
        data: {
            code: $('#code').val(), id: $('#userId').text(), csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            // login();
            window.location.replace("http://127.0.0.1:8000/es/app/");
        },
        error: function (jqXHR, status, error) {
            alert("Dise, existió un problema " + error);
        },
    });

}

function login(){

    let requestSendCode = $.ajax({
        url: 'http://127.0.0.1:8000/es/accounts/login',
        data: {
            next: '', email: $('#email').val() , password: $('#password').val()
        },
        type: 'POST',
        error: function (jqXHR, status, error) {
            alert("existió un problema " + error);
        },
    });

}


// aux

function disabledButton(name) {
    $(name).html('<div uk-spinner></div>')
    $(name).addClass('uk-disabled')

}

function showStep2Mail() {
    $('#step2-register').removeClass('uk-hidden ')
    $('#step1-register').addClass('uk-hidden ')
}