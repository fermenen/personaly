
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.utils import translation
from django.utils.translation import activate
from django.utils.translation import (
    LANGUAGE_SESSION_KEY, check_for_language,)


def web(request):
    return render(request, 'web/index.html')


def change_language_view(request):
    lang_code = request.POST['code']
    url_next = request.POST['next']
    if lang_code and check_for_language(lang_code):
        if hasattr(request, 'session'):
            request.session['language_app'] = lang_code
            translation.activate(lang_code)
            activate(lang_code)
            return redirect('web')
    else:
        return HttpResponse("eror")



