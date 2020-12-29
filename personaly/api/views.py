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


class AddMusic(APIView):

    def post(self, request):
        add_music_serializer = AddMusicSerializer(data=request.data)
        if add_music_serializer.is_valid():
            music = add_music_serializer.save()
            try:
                spotify = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="3d64112da0524f90ac6617210804754a", client_secret="5b67c11ca4eb4bb3b95513a4f1d0f442"))
                results = spotify.search(q=music.name_artist, type='artist', market='ES', limit=1)
                artist_spotify = results['artists']['items'][0]
                music.id_artist = artist_spotify['id']
                music.name_artist = artist_spotify['name']
                music.photo_artist = artist_spotify['images'][1]['url']
                music.url_artist = artist_spotify['external_urls']['spotify']
                music.tags = ';'.join(artist_spotify['genres'][0:4])
                music.popularity = int(artist_spotify['popularity'])
                music.save()
            except:
                pass
            return JsonResponse({'ok': 'true'}, status=200)
        else:
            return JsonResponse({'ok': 'false'}, status=400)
