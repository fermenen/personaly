from random import randint
from typing import Tuple

from django.contrib.auth import authenticate
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.conf import settings
from django.db import transaction
from accounts.models import User


class ContactService:

    def add_contact_service(self, contact, request) -> Tuple[int, str]:
        try:
            user = request.user
            contact.owner = user
            user.contacts_created += 1
            user.save()
            contact.save()
            return 200, "contacto creado con exito"
        except Exception:
            return 500, "contacto no creado"

    def remove_contact_service(self, contact, request) -> Tuple[int, str]:
        try:
            user = request.user
            if contact.owner == user:
                contact.active = False
                user.contacts_created -= 1
                user.save()
                contact.save()
                return 200, "contacto borrada con exito"
            else:
                raise UserWarning
        except Exception:
            return 500, "contacto no borrado"


@transaction.atomic
def send_code_user(userId):
    user = User.objects.get(id=userId)
    user.code_validated_mail = code = randint(1000, 9999)
    subject = 'Codigo registro | personaly'
    template = get_template('mail/check_code_mail.html')
    content = template.render({'code': code})
    message = EmailMultiAlternatives(subject, '', settings.EMAIL_HOST_USER, [user.email])
    message.attach_alternative(content, 'text/html')
    user.save()
    message.send()


