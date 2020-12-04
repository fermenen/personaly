from django.contrib import messages
from django.contrib.auth import authenticate, login

from .serializers import UserSerializer, NoteSerializer
from rest_framework.views import APIView
from django.http import JsonResponse
from django.core import serializers

from dashboard.services import send_code_user

from accounts.models import User


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
