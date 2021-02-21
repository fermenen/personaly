import os
import spotipy
from rest_framework import serializers
from spotipy import SpotifyClientCredentials
from accounts.models import User
from dashboard.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.is_active = False
        user.set_password(password)
        user.save()
        return user


class IsActiveTag(serializers.ListSerializer):

    def to_representation(self, data):
        if isinstance(data, list):
            return super().to_representation(data)
        data = data.filter(active=True)
        return super().to_representation(data)


class ImageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = ImageModel
        fields = ('id', 'image')

 # - - - - - -


class TagContactSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = TagContact
        list_serializer_class = IsActiveTag
        fields = ('id', 'icon', 'text', 'contact', 'created_at')


class ContactSerializer(serializers.ModelSerializer):
    contact_tag = TagContactSerializer(many=True, read_only=True)
    url = serializers.CharField(read_only=True)
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Contact
        fields = (
            'id', 'name', 'surnames', 'image_contact', 'location', 'phone', 'email', 'birthday', 'remember_birthday',
            'keep_in_touch', 'url', 'contact_tag')


class ReminderContactSerializer(serializers.ModelSerializer):
    contact_info = ContactSerializer(source='contact', read_only=True)
    id = serializers.CharField(read_only=True)

    class Meta:
        model = ReminderContact
        fields = ('id', 'text', 'completed', 'deadline', 'days', 'past', 'today', 'future', 'contact', 'contact_info')


class NoteContactSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = NoteContact
        fields = ('id', 'text', 'created_at', 'contact')


class FamilyContactSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = FamilyContact
        fields = ('id', 'name', 'surnames', 'relation_type', 'relation_name', 'contact')


class ExperienceContactSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = ExperienceContact
        fields = ('id', 'tittle', 'location', 'date', 'images', 'created_at', 'contact')


class MusicContactSerializer(serializers.ModelSerializer):
    name_artist = serializers.CharField(required=False)
    id = serializers.CharField(read_only=True)

    class Meta:
        model = MusicContact
        fields = (
            'id', 'id_artist', 'name_artist', 'photo_artist', 'url_artist', 'get_list_tags', 'popularity', 'contact')

    def create(self, validated_data):
        """
        Create and return a new `MusicContact` instance, given the validated data.
        """
        music = MusicContact.objects.create(**validated_data)
        if 'id_artist' in validated_data and validated_data['id_artist'] is not None:
            artist_spotify = self.find_artist_spotify(validated_data['id_artist'])
            music.name_artist = artist_spotify['name']
            music.photo_artist = artist_spotify['images'][1]['url']
            music.url_artist = artist_spotify['external_urls']['spotify']
            music.tags = ';'.join(artist_spotify['genres'][0:4])
            music.popularity = int(artist_spotify['popularity'])
        music.save()
        return music

    def find_artist_spotify(self, id_artist):
        spotify = spotipy.Spotify(
            auth_manager=SpotifyClientCredentials(client_id=os.getenv("CLIENT_ID"),
                                                  client_secret=os.getenv("CLIENT_SECRET")))
        return spotify.artist(id_artist)


class CommonContactSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = ThingCommonContact
        fields = ('id', 'text', 'created_at', 'contact')

