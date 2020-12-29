from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import uuid
import datetime
from dashboard.models import Contact, TagContact, NoteContact, ThingCommonContact, ExperienceContact, MusicContact
from .forms import AddContactForm
from django.shortcuts import get_list_or_404, get_object_or_404


@login_required
def index(request):
    date = datetime.date.today()

    return render(request, 'dashboard/index.html', {'date_today': date})


@login_required
def contacts_list_view(request, form_add_contact=AddContactForm, errors=False):
    owner = request.user
    list_contacts = Contact.objects.filter(owner=owner, active=True).order_by('name')
    count_contacts = len(list_contacts)
    list_tags = TagContact.objects.filter(owner=owner)
    return render(request, 'dashboard/contacts_list.html', {'contact_list': list_contacts, 'tags_list': list_tags,
                                                            'form_add_contact': form_add_contact,
                                                            'count_contacts': count_contacts,
                                                            'errors': errors})


@login_required
def contact_view(request, url):
    try:
        owner = request.user
        contact = get_object_or_404(Contact, url=url, owner=owner, active=True)
        list_tags = TagContact.objects.filter(owner=owner, contact=contact)
        list_notes = NoteContact.objects.filter(contact=contact, owner=owner, active=True).order_by('-created_at')
        list_common = ThingCommonContact.objects.filter(contact=contact, owner=owner, active=True)
        list_experiences = ExperienceContact.objects.filter(contact=contact, owner=owner, active=True)
        list_music = MusicContact.objects.filter(contact=contact, owner=owner, active=True)

        data = {'owner': owner,
                'contact': contact,
                'tags_list': list_tags,
                'list_notes': list_notes,
                'count_list_notes': list_notes.count(),
                'list_common': list_common,
                'count_list_common': list_common.count(),
                'list_experiences': list_experiences,
                'count_list_experiences': list_experiences.count(),
                'list_music': list_music,
                'count_list_music': list_music.count(),
                'list_family': None,
                'count_list_family': 0,
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
