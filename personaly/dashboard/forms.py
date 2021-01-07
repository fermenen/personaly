from django.forms import Select
from django import forms
from .models import *


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


class KeepTouchForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ['keep_in_touch']
        labels = {
            'keep_in_touch': '',
        }
        widgets = {
            'keep_in_touch': Select(attrs={'class': 'uk-select'}),
        }
