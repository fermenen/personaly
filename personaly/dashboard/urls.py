from django.urls import path

from . import views, forms

urlpatterns = [
    path('', views.index, name='app'),
    path('contacts/', views.contacts_list_view, name='contacts'),
    path('contact/<slug:url>/', views.contact_view, name='contact'),
    path('settings/', views.settings_view, name='settings'),

    path('add_contact', forms.add_contact_view, name='api_add_contact'),
    path('delete_contact', forms.delete_contact_view, name='api_delete_contact'),

    path('legal-warning/', views.legal_warning_view, name='legal_warning'),
    path('privacy-policy/', views.privacy_policy_view, name='privacy_policy'),
    path('code-of-conduct/', views.code_conduct_view, name='code_conduct'),

]

from django.urls import path
from django.conf.urls.i18n import i18n_patterns
from django.utils.translation import gettext_lazy as _

# urlpatterns += i18n_patterns(
#         path(_('contactos/'), views.contacts_list, name='contacts'),
#         # prefix_default_language=False
#     )
