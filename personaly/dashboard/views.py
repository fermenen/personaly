from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import datetime

from dashboard.models import *
from .forms import RelationTypeForm, KeepTouchForm
from django.shortcuts import get_object_or_404
from django.utils import translation

from django.utils.translation import get_language_info


from allauth.socialaccount.models import SocialAccount



@login_required
def index(request):
    owner = request.user
    date = datetime.date.today()
    return render(request, 'dashboard/index.html', {'owner': owner, 'date_today': date})


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
    li = get_language_info(translation.get_language())
    email_data = []
    for email in request.user.emailaddress_set.all():
        email_data.append(
            {
                "id": email.pk,
                "email": email.email,
                "verified": email.verified,
                "primary": email.primary,
            }
        )

    account_data = []
    for account in SocialAccount.objects.filter(user=request.user):
        provider_account = account.get_provider_account()
        account_data.append(
            {
                "id": account.pk,
                "uid": account.uid,
                "provider": account.provider,
                "name": provider_account.to_str(),
            }
        )

    data = {'user': request.user,
            'email_data': email_data,
            'account_data': account_data,
            'LANGUAGE': li['name_local'],
            }

    return render(request, 'dashboard/settings.html', data)


@login_required
def legal_warning_view(request):
    return render(request, 'dashboard/legal/legal_warning.html')


@login_required
def privacy_policy_view(request):
    return render(request, 'dashboard/legal/privacy_policy.html')


@login_required
def code_conduct_view(request):
    return render(request, 'dashboard/legal/code_conduct.html')
