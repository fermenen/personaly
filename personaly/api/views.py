from rest_framework import generics
from rest_framework.permissions import AllowAny

from accounts.models import User
from .serializers import UserSerializer


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
