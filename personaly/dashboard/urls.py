from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='app'),
    path('contacts/', views.contacts_list, name='contacts'),
    path('contact/<slug:url>/', views.contact_view, name='contact'),

]
