from typing import Tuple



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
