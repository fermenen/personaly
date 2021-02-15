from django.conf.urls import url
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth

app_name = 'api_v2'

router = DefaultRouter()
router.register(r'contact', views.ContactView, basename='contact')
router.register(r'tag_contact', views.TagContactView, basename='tag_contact')
router.register(r'reminder_contact', views.ReminderContactView, basename='reminder_contact')
router.register(r'note_contact', views.NoteContactView, basename='note_contact')
router.register(r'common_contact', views.CommonContactView, basename='common_contact')
router.register(r'music_contact', views.MusicContactView, basename='music_contact')
router.register(r'family_contact', views.FamilyContactView, basename='family_contact')


urlpatterns = [
    # path('api-token-auth/', auth.obtain_auth_token),

    path(r'v2/', include((router.urls, app_name), namespace='api_v2')),

    path('v1/account/register', views.UserCreate.as_view(), name='api_register_user'),
    path('v1/mail/send_code_user', views.SendCodeMailUser.as_view(), name='api_send_mail_code'),
    path('v1/mail/check_code_user', views.CheckCodeMailUser.as_view(), name='api_check_mail_code'),

    path(r'search_artist', views.SearchArtist.as_view(), name='api_search_artist'),
    path('v1/contact/upload_photo', views.UploadPhoto.as_view(), name='api_upload_photo'),

]

urlpatterns += router.urls
