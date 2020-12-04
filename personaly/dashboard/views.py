from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
import uuid

from dashboard.models import Contact, TagContact, NoteContact, ThingCommonContact, ExperienceContact
from .forms import AddContactForm
from django.shortcuts import get_list_or_404, get_object_or_404


@login_required
def index(request):

    contacts = Contact.objects.filter(owner=request.user)

    print(contacts)

    return render(request, 'dashboard/index.html', {'contact_list': contacts})


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
        return render(request, 'dashboard/contact.html', {'owner': owner, 'contact': contact, 'tags_list': list_tags,
                                                          'list_notes': list_notes, 'list_common': list_common,
                                                          'list_experiences': list_experiences})
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
