from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import datetime
from datetime import date
from dashboard.models import *
from .forms import RelationTypeForm, KeepTouchForm
from django.shortcuts import get_object_or_404


@login_required
def index(request):
    date = datetime.date.today()
    return render(request, 'dashboard/index.html', {'date_today': date})


@login_required
def contacts_list_view(request):
    owner = request.user
    form_keep_touch = KeepTouchForm

    data = {'owner': owner,
            'form_keep_in_touch': form_keep_touch,
            }

    return render(request, 'dashboard/contacts_list.html', data)


@login_required
def contact_view(request, url):
    try:
        owner = request.user
        contact = get_object_or_404(Contact, url=url, owner=owner, active=True)
        form_relation = RelationTypeForm
        form_keep_touch = KeepTouchForm

        data = {'owner': owner,
                'contact': contact,
                'form_relation': form_relation,
                'form_keep_in_touch': form_keep_touch,
                }

        return render(request, 'dashboard/contact.html', data)
    except Exception as e:
        return redirect("contacts")


@login_required
def settings_view(request):
    user = request.user
    return render(request, 'dashboard/settings.html', {'user': user})


@login_required
def legal_warning_view(request):
    return render(request, 'dashboard/legal/legal_warning.html')


@login_required
def privacy_policy_view(request):
    return render(request, 'dashboard/legal/privacy_policy.html')


@login_required
def code_conduct_view(request):
    return render(request, 'dashboard/legal/code_conduct.html')
