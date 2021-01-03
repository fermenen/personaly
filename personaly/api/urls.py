from django.conf.urls import url
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter


app_name = 'api_v2'

router = DefaultRouter()
router.register(r'family_contact', views.FamilyContactView, basename='family_contact')
router.register(r'music_contact', views.MusicContactView, basename='music_contact')



urlpatterns = [

    path(r'contact/', include((router.urls, app_name), namespace='api_v2')),


    path('v1/account/register', views.UserCreate.as_view(), name='api_register_user'),
    path('v1/mail/send_code_user', views.SendCodeMailUser.as_view(), name='api_send_mail_code'),
    path('v1/mail/check_code_user', views.CheckCodeMailUser.as_view(), name='api_check_mail_code'),

    path('v1/contact/create_note', views.CreateNoteContact.as_view(), name='api_create_note'),
    path('v1/contact/delete_note', views.DeleteNoteContact.as_view(), name='api_delete_note'),

    path('v1/contact/create_common', views.CreateCommonContact.as_view(), name='api_create_common'),


    path('v1/contact/search_artist', views.SearchArtist.as_view(), name='api_search_artist'),

    path('v1/contact/upload_photo', views.UploadPhoto.as_view(), name='api_upload_photo'),

]

urlpatterns += router.urls
