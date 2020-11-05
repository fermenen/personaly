from django.urls import path

from . import views

urlpatterns = [
    path('', views.web, name='web'),
    path('change_language/', views.change_language_view, name="set_language"),
]
