from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from dashboard.models import Contact, TagContact
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
        return render(request, 'dashboard/contact.html', {'contact': contact, 'tags_list': list_tags})
    except Exception as e:
        return redirect("contacts")


@login_required
def settings_view(request):
    return render(request, 'dashboard/settings.html')
