
# personaly

<img src="https://user-images.githubusercontent.com/32095133/201309098-0aaa4c35-8734-4e13-888a-89bddad85b1a.png" alt="personaly." width="400"/>

## About
personaly is a CRM to build strong relationships. It's an easy way to keep in touch with all your friends, co-workers, clients and family.

Learn more at https://personaly.app


## Getting Started

First, run the development server:

```bash
python manage.py makemigrations
sass ./static/theme/app.scss ./static/css/app.css
django-admin.py makemessages -en
django-admin compilemessages --use-fuzzy

npx webpack
python manage.py runscript reminder_touch

python manage.py runserver
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) with your browser to see the result.
