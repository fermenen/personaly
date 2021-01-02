from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.forms import Select
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django import forms

from . import views
from .models import *
from .services import ContactService



class RelationTypeForm(forms.ModelForm):

    class Meta:
        model = FamilyContact
        fields = ['relation_type']
        labels = {
            'relation_type': '',
        }
        widgets = {
            'relation_type': Select(attrs={'class': 'uk-select'}),
        }


class AddContactForm(forms.ModelForm):

    class Meta:
        model = Contact
        fields = ('name', 'surnames')


@login_required
def add_contact_view(request):
    if request.method == 'POST':
        form = AddContactForm(request.POST)
        if form.is_valid():
            contact = form.save(commit=False)
            response = ContactService().add_contact_service(contact, request)
            if response[0] == 200:
                messages.success(request, 'Contacto creado con exito!')
                return redirect('contacts')
            else:
                messages.error(request, 'problema')
                return redirect('contacts')
        else:
            return views.contacts_list_view(request, form_add_contact=form, errors=True)
    return redirect('contacts')


@login_required
def delete_contact_view(request):
    if request.method == 'POST':
        contact = Contact.objects.get(id=request.POST.get("contact_id"))
        response = ContactService().remove_contact_service(contact, request)
        if response[0] == 200:
            messages.success(request, 'Contacto borrado con exito!')
            return redirect('contacts')
        else:
            messages.error(request, 'problema')
            return redirect('contacts')
    else:
        return views.contacts_list_view(request, form_add_contact=form, errors=True)
    return redirect('contacts')