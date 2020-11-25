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
    path('v1/account/register', views.UserCreate.as_view(), name='api_register_user')
]



# path('api/v1/add-user', services.add_user, name='api_add_user'),