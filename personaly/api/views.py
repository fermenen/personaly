from django.contrib import messages
from django.contrib.auth import authenticate, login

from .serializers import *
from rest_framework.views import APIView
from django.http import JsonResponse
from django.core import serializers
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import viewsets
from dashboard.services import send_code_user

from accounts.models import User

from dashboard.models import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404


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


class CreateNoteContact(APIView):

    def post(self, request):
        note_serializer = NoteSerializer(data=request.data)
        if note_serializer.is_valid():
            note = note_serializer.save()
            noteSe = serializers.serialize('json', [note, ])
            return JsonResponse({'ok': 'true', 'note': noteSe}, status=201)
        else:
            return JsonResponse({'ok': 'false', 'message': 'A problem occurred, try again. Contact support if persist'},
                                status=400)


class DeleteNoteContact(APIView):

    def post(self, request):
        delete_note_serializer = DeleteNoteSerializer(data=request.data)
        if delete_note_serializer.is_valid():
            note = NoteContact.objects.get(id=request.data['id'])
            note.active = False
            note.save()
            return JsonResponse({'ok': 'true'}, status=200)
        else:
            return JsonResponse({'ok': 'false'}, status=400)


class CreateCommonContact(APIView):

    def post(self, request):
        common_serializer = CommonSerializer(data=request.data)
        if common_serializer.is_valid():
            common = common_serializer.save()
            return JsonResponse({'ok': 'true'}, status=201)
        else:
            return JsonResponse({'ok': 'false', 'message': 'A problem occurred, try again. Contact support if persist'},
                                status=400)


class DeleteCommonContact(APIView):

    def post(self, request):
        delete_common_serializer = DeleteNoteSerializer(data=request.data)
        if delete_common_serializer.is_valid():
            common = ThingCommonContact.objects.get(id=request.data['id'])
            common.active = False
            common.save()
            return JsonResponse({'ok': 'true'}, status=200)
        else:
            return JsonResponse({'ok': 'false'}, status=400)


class UploadPhoto(APIView):

    def post(self, request):
        data = request.data['files[]']
        path = default_storage.save(f'images_contacts/{data.name}', ContentFile(data.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        return JsonResponse({'ok': 'true', 'file': path}, status=200)


class SearchArtist(APIView):

    def post(self, request):
        search_text = request.data['name_artist']
        data = []
        spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="3d64112da0524f90ac6617210804754a",
                                                                        client_secret="5b67c11ca4eb4bb3b95513a4f1d0f442"))
        results = spotify.search(q=search_text, type='artist', market='ES', limit=4)
        results = results['artists']['items']
        for artist in results:
            data.append({
                'id': artist['id'],
                'name': artist['name']
            })
        return JsonResponse({'ok': 'true', 'data': data}, status=200)


class FamilyContactView(viewsets.ModelViewSet):
    serializer_class = FamilyContactSerializer
    queryset = FamilyContact.objects.all()

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


class MusicContactView(viewsets.ModelViewSet):
    serializer_class = MusicContactSerializer
    queryset = MusicContact.objects.all()

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

