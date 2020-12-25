from rest_framework import serializers

from accounts.models import User

from dashboard.models import NoteContact, ThingCommonContact




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

class CommonSerializer(serializers.ModelSerializer):

    class Meta:
        model = ThingCommonContact
        fields = ('text', 'contact', 'owner')

    def create(self, validated_data):
        common = ThingCommonContact(**validated_data)
        common.save()
        return common
