from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='app'),
    path('contacts/', views.contacts_list_view, name='contacts'),
    path('contact/<slug:url>/', views.contact_view, name='contact'),
    path('settings/', views.settings_view, name='settings'),

    path('legal-warning/', views.legal_warning_view, name='legal_warning'),
    path('privacy-policy/', views.privacy_policy_view, name='privacy_policy'),
    path('code-of-conduct/', views.code_conduct_view, name='code_conduct'),

]
