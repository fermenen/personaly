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
    list_contacts = Contact.objects.filter(owner=owner, active=True).order_by('name')
    list_tags = TagContact.objects.filter(owner=owner)
    form_keep_touch = KeepTouchForm

    data = {'owner': owner,
            'tags_list': list_tags,
            'list_contacts': list_contacts,
            'count_list_contacts': list_contacts.count(),
            'form_keep_in_touch': form_keep_touch
            }

    return render(request, 'dashboard/contacts_list.html', data)


@login_required
def contact_view(request, url):
    try:
        owner = request.user
        contact = get_object_or_404(Contact, url=url, owner=owner, active=True)
        list_tags = TagContact.objects.filter(owner=owner, contact=contact)
        list_reminder = ReminderContact.objects.filter(contact=contact, owner=owner, active=True).order_by(
            '-created_at')
        list_notes = NoteContact.objects.filter(contact=contact, owner=owner, active=True).order_by('-created_at')
        list_common = ThingCommonContact.objects.filter(contact=contact, owner=owner, active=True)
        list_experiences = ExperienceContact.objects.filter(contact=contact, owner=owner, active=True)
        list_music = MusicContact.objects.filter(contact=contact, owner=owner, active=True)
        list_family = FamilyContact.objects.filter(contact=contact, owner=owner, active=True)

        form_relation = RelationTypeForm

        data = {'owner': owner,
                'contact': contact,
                'tags_list': list_tags,
                'list_reminder': list_reminder,
                'list_notes': list_notes,
                'count_list_notes': list_notes.count(),
                'list_common': list_common,
                'count_list_common': list_common.count(),
                'list_experiences': list_experiences,
                'count_list_experiences': list_experiences.count(),
                'list_music': list_music,
                'count_list_music': list_music.count(),
                'list_family': list_family,
                'count_list_family': list_family.count(),
                'form_relation': form_relation
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
