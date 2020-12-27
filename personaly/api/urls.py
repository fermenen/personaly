from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('v1/account/register', views.UserCreate.as_view(), name='api_register_user'),
    path('v1/mail/send_code_user', views.SendCodeMailUser.as_view(), name='api_send_mail_code'),
    path('v1/mail/check_code_user', views.CheckCodeMailUser.as_view(), name='api_check_mail_code'),

    path('v1/contact/create_note', views.CreateNoteContact.as_view(), name='api_create_note'),
    path('v1/contact/delete_note', views.DeleteNoteContact.as_view(), name='api_delete_note'),

    path('v1/contact/create_common', views.CreateCommonContact.as_view(), name='api_create_common'),
    path('v1/contact/delete_common', views.DeleteCommonContact.as_view(), name='api_delete_common'),

    path('v1/contact/upload_photo', views.UploadPhoto.as_view(), name='api_upload_photo'),

]
