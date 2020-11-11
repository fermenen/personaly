from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django import forms

from . import views


@login_required
def add_contact(request):
    if request.method == 'POST':
        form = AddContactForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/thanks/')
        else:
            return views.contacts_list_view(request, form_add_contact=form)
    return redirect('contacts')


class AddContactForm(forms.Form):
    form_name = forms.CharField(label='Nombre', max_length=100, required=True)
    form_surname = forms.CharField(label='Apellido', max_length=100,  required=True)
    form_select = forms.ChoiceField(required=False)
    form_photo = forms.ImageField(required=False)
