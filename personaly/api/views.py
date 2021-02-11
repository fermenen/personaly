import os

import django_filters
import spotipy
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from django_property_filter import PropertyFilterSet, PropertyNumberFilter, PropertyBooleanFilter
from spotipy.oauth2 import SpotifyClientCredentials

from django.contrib.auth import login
from .serializers import *
from django.http import JsonResponse
from django.core import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth.models import User

from dashboard.services import send_code_user
from accounts.models import User
from dashboard.models import *


class UserCreate(APIView):

    def post(self, request):
        import time
        print("x-1-1")
        time.sleep(1)
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            return JsonResponse({'ok': 'true', 'id': user.id}, status=201)
        else:
            return JsonResponse({'ok': 'false'}, status=500)


class SendCodeMailUser(APIView):

    def post(self, request):
        data = request.data
        send_code_user(data['id'])
        return JsonResponse({'ok': 'true'}, status=200)


class CheckCodeMailUser(APIView):

    def post(self, request):
        data = request.data
        code = int(data['code'])
        uer_id = data['id']
        print(code)
        user = User.objects.get(id=uer_id)
        if user.code_validated_mail == code:
            user.validated_mail = True
            user.is_active = True
            user.save()
            login(request, user)
            return JsonResponse({'ok': 'true'}, status=200)
        else:
            return JsonResponse({'ok': 'codigo incorrecto'}, status=404)


class UploadPhoto(APIView):

    def post(self, request):
        data = request.data['files[]']
        path = default_storage.save(f'images_contacts/{data.name}', ContentFile(data.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        return JsonResponse({'ok': 'true', 'file': path}, status=200)


# Contact_001 View - GET - POST - PUT - DELETE
class ContactView(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['name']
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.contacts_active += 1
        contact = serializer.save()
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        contact = self.get_object()
        contact.active = False
        user = request.user
        user.contacts_active -= 1
        user.save()
        contact.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# TagContact View
class TagContactView(viewsets.ModelViewSet):
    serializer_class = TagContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['created_at']
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return TagContact.objects.filter(owner=self.request.user, active=True)


class ReminderContactFilter(PropertyFilterSet):
    lte_days = PropertyNumberFilter(field_name='days', lookup_expr='lte')
    gte_days = PropertyNumberFilter(field_name='days', lookup_expr='gte')
    days = PropertyNumberFilter(field_name='days', lookup_expr='exact')
    past = PropertyBooleanFilter(field_name='past')
    future = PropertyBooleanFilter(field_name='future')

    class Meta:
        model = ReminderContact
        fields = ['completed', 'gte_days', 'lte_days', 'days', 'contact', 'past', 'future']


# Reminder Contact_001
class ReminderContactView(viewsets.ModelViewSet):
    serializer_class = ReminderContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ReminderContactFilter
    ordering_fields = ['deadline', 'completed']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        return ReminderContact.objects.filter(owner=self.request.user, active=True)


# Note Contact_001
class NoteContactView(viewsets.ModelViewSet):
    serializer_class = NoteContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return NoteContact.objects.filter(owner=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.note_active += 1
        note = serializer.save()
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        note = self.get_object()
        note.active = False
        user = request.user
        user.note_active -= 1
        user.save()
        note.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Common Contact_001
class CommonContactView(viewsets.ModelViewSet):
    serializer_class = CommonContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return ThingCommonContact.objects.filter(owner=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.common_active += 1
        common = serializer.save()
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        common = self.get_object()
        common.active = False
        user = request.user
        user.common_active -= 1
        user.save()
        common.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Music Contact_001 - GET - POST - DELETE
class MusicContactView(viewsets.ModelViewSet):
    serializer_class = MusicContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return MusicContact.objects.filter(owner=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.music_active += 1
        music = serializer.save()
        user.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        music = self.get_object()
        music.active = False
        user = request.user
        user.music_active -= 1
        user.save()
        music.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchArtist(APIView):

    def post(self, request):
        search_text = request.data['name_artist']
        data = []
        spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=os.getenv("CLIENT_ID"),
                                                                        client_secret=os.getenv("CLIENT_SECRET")))
        results = spotify.search(q=search_text, type='artist', market='ES', limit=4)
        results = results['artists']['items']
        for artist in results:
            data.append({
                'id': artist['id'],
                'name': artist['name']
            })
        return JsonResponse({'ok': 'true', 'data': data}, status=200)


# Family Contact_001 - GET - POST - PUT - DELETE
class FamilyContactView(viewsets.ModelViewSet):
    serializer_class = FamilyContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return FamilyContact.objects.filter(owner=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.family_active += 1
        user.save()
        family = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        family = self.get_object()
        family.active = False
        user = request.user
        user.family_active -= 1
        user.save()
        family.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
