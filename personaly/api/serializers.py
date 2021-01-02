from rest_framework import serializers

from accounts.models import User

from dashboard.models import NoteContact, ThingCommonContact, MusicContact, FamilyContact


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
