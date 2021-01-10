import os
import spotipy
from rest_framework import serializers

from accounts.models import User

from dashboard.models import NoteContact, ThingCommonContact, MusicContact, FamilyContact, Contact
from spotipy import SpotifyClientCredentials


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


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteContact
        fields = ('text', 'contact', 'owner')

    def create(self, validated_data):
        note = NoteContact(**validated_data)
        note.save()
        return note


class DeleteNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteContact
        fields = ('id', 'contact', 'owner')


class DeleteMusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteContact
        fields = ('id', 'contact', 'owner')


class DeleteCommonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThingCommonContact
        fields = ('id', 'contact', 'owner')


class AddMusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicContact
        fields = ('id_artist', 'contact', 'owner')


class AddMusicSerializerManual(serializers.ModelSerializer):
    class Meta:
        model = MusicContact
        fields = ('name_artist', 'contact', 'owner')


class CommonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ThingCommonContact
        fields = ('text', 'contact', 'owner')

    def create(self, validated_data):
        common = ThingCommonContact(**validated_data)
        common.save()
        return common


class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyContact
        fields = ('name', 'relation_type', 'contact', 'owner')

    def create(self, validated_data):
        family = FamilyContact(**validated_data)
        family.save()
        return family


class DeleteFamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyContact
        fields = ('id', 'contact', 'owner')


# // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -- - - - - - - - -


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = (
        'id', 'name', 'surnames', 'image_contact', 'location', 'phone', 'email', 'birthday', 'remember_birthday',
        'keep_in_touch', 'owner')


class NoteContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoteContact
        fields = ('id', 'text', 'contact', 'owner')


class FamilyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyContact
        fields = ('id', 'name', 'surnames', 'relation_type', 'contact', 'owner')

    def create(self, validated_data):
        """
        Create and return a new `FamilyContact` instance, given the validated data.
        """
        return FamilyContact.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `FamilyContact` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.surnames = validated_data.get('surnames', instance.surnames)
        instance.relation_type = validated_data.get('relation_type', instance.relation_type)
        instance.save()
        return instance


class MusicContactSerializer(serializers.ModelSerializer):
    name_artist = serializers.CharField(required=False)

    class Meta:
        model = MusicContact
        fields = (
            'id', 'id_artist', 'name_artist', 'photo_artist', 'url_artist', 'tags', 'popularity', 'contact', 'owner')

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
    class Meta:
        model = ThingCommonContact
        fields = ('id', 'text', 'contact', 'owner')

    def create(self, validated_data):
        """
        Create and return a new `ThingCommonContact` instance, given the validated data.
        """
        return ThingCommonContact.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `ThingCommonContact` instance, given the validated data.
        """
        instance.text = validated_data.get('text', instance.name)
        instance.save()
        return instance
