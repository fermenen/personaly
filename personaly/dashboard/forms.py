from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django import forms

from . import views
from .models import Contact


class AddContactForm(forms.ModelForm):

    class Meta:
        model = Contact
        fields = ('name', 'surnames')

    # form_name = forms.CharField(label='Nombre', max_length=100, required=True)
    # form_surname = forms.CharField(label='Apellido', max_length=100,  required=True)
    # form_select = forms.ChoiceField(required=False)
    # form_photo = forms.ImageField(required=False)


@login_required
def add_contact_view(request):
    if request.method == 'POST':
        form = AddContactForm(request.POST)
        if form.is_valid():
            contact = form.save(commit=False)
            contact.owner = request.user
            contact.save()
            messages.success(request, 'Contacto creado con exito!')

            return redirect('contacts')
        else:
            return views.contacts_list_view(request, form_add_contact=form, errors=True)
    return redirect('contacts')


