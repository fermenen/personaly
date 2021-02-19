from uuid import uuid4
from PIL import Image

from django_filters.rest_framework import DjangoFilterBackend
from django_property_filter import PropertyFilterSet, PropertyNumberFilter, PropertyBooleanFilter
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.http import JsonResponse

from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework import permissions

from .serializers import *

from dashboard.services import send_code_user
from accounts.models import User
from dashboard.models import *
from dashboard.Storage import StorageGoogle


class IsOwner(permissions.BasePermission):
    """
    Only owner has permission
    """

    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            return True
        else:
            return False


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


@permission_classes([IsAuthenticated])
class UploadPhoto(APIView):

    def post(self, request):
        data = request.data['files[]']
        path = default_storage.save(f'images/{data.name}', ContentFile(data.read()))
        tmp_file = os.path.join(settings.MEDIA_ROOT, path)
        tmp_new = self.get_transform_image(tmp_file)
        public_url = StorageGoogle(f'public/{request.user.id}{tmp_new}').upload('./' + tmp_new)
        os.remove('./' + tmp_file)
        os.remove('./' + tmp_new)
        return JsonResponse({'ok': 'true', 'file': public_url}, status=200)

    def get_transform_image(self, image_path):
        basewidth = 400
        quality = 75
        img = Image.open(image_path)
        wpercent = (basewidth / float(img.size[0]))
        hsize = int((float(img.size[1]) * float(wpercent)))
        img_new = img.resize((basewidth, hsize))
        image_name = '{}.{}'.format(uuid4().hex, 'jpg')
        img_new.save(os.path.join('images/', image_name), quality=quality, optimize=True)
        return os.path.join('/images/', image_name)


# - - - - - - - - -

@permission_classes([IsAuthenticated])
class ContactView(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['name']
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return Contact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        user.contacts_active += 1
        user.contacts_created += 1
        user.save()
        return serializer.save(owner=user)

    def perform_destroy(self, instance):
        instance.active = False
        user = self.request.user
        user.contacts_active -= 1
        self.delete_data(user)
        user.save()
        return instance.save()

    def delete_data(self, user):
        for reminder in ReminderContact.objects.filter(owner=user):
            reminder.active = False
            reminder.save()
        for tag in TagContact.objects.filter(owner=user):
            tag.active = False
            tag.save()
        for note in NoteContact.objects.filter(owner=user):
            note.active = False
            note.save()
        for common in ThingCommonContact.objects.filter(owner=user):
            common.active = False
            common.save()
        for experience in ExperienceContact.objects.filter(owner=user):
            experience.active = False
            experience.save()
        for music in MusicContact.objects.filter(owner=user):
            music.active = False
            music.save()
        for family in FamilyContact.objects.filter(owner=user):
            family.active = False
            family.save()


@permission_classes([IsAuthenticated])
class TagContactView(viewsets.ModelViewSet):
    serializer_class = TagContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['created_at']
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return TagContact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        tag = serializer.save(owner=self.request.user)
        return tag

    def perform_destroy(self, instance):
        instance.active = False
        return instance.save()


class ReminderContactFilter(PropertyFilterSet):
    lte_days = PropertyNumberFilter(field_name='days', lookup_expr='lte')
    gte_days = PropertyNumberFilter(field_name='days', lookup_expr='gte')
    days = PropertyNumberFilter(field_name='days', lookup_expr='exact')
    past = PropertyBooleanFilter(field_name='past')
    future = PropertyBooleanFilter(field_name='future')

    class Meta:
        model = ReminderContact
        fields = ['completed', 'gte_days', 'lte_days', 'days', 'contact', 'past', 'future']


@permission_classes([IsAuthenticated])
class ReminderContactView(viewsets.ModelViewSet):
    serializer_class = ReminderContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ReminderContactFilter
    ordering_fields = ['deadline', 'completed']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        return ReminderContact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        reminder = serializer.save(owner=self.request.user)
        return reminder

    def perform_destroy(self, instance):
        instance.active = False
        return instance.save()


@permission_classes([IsAuthenticated])
class NoteContactView(viewsets.ModelViewSet):
    serializer_class = NoteContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return NoteContact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        user.note_active += 1
        user.save()
        return serializer.save(owner=user)

    def perform_destroy(self, instance):
        instance.active = False
        user = self.request.user
        user.note_active -= 1
        user.save()
        return instance.save()


@permission_classes([IsAuthenticated])
class CommonContactView(viewsets.ModelViewSet):
    serializer_class = CommonContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return ThingCommonContact.objects.filter(owner=self.request.user, active=True)


    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        user.common_active += 1
        user.save()
        return serializer.save(owner=user)

    def perform_destroy(self, instance):
        instance.active = False
        user = self.request.user
        user.common_active -= 1
        user.save()
        return instance.save()


@permission_classes([IsAuthenticated])
class MusicContactView(viewsets.ModelViewSet):
    serializer_class = MusicContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return MusicContact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        user.music_active += 1
        user.save()
        return serializer.save(owner=user)

    def perform_destroy(self, instance):
        instance.active = False
        user = self.request.user
        user.music_active -= 1
        user.save()
        return instance.save()


@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
class FamilyContactView(viewsets.ModelViewSet):
    serializer_class = FamilyContactSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['contact']
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return FamilyContact.objects.filter(owner=self.request.user, active=True)

    def perform_create(self, serializer):
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        user.family_active += 1
        user.save()
        return serializer.save(owner=user)

    def perform_destroy(self, instance):
        instance.active = False
        user = self.request.user
        user.family_active -= 1
        user.save()
        return instance.save()
