# scripts/reminder_touch.py
from datetime import timedelta, date
from dashboard.models import ReminderContact


def run():
    reminders = ReminderContact.objects.filter(active=True, recursive=True, type='TC')
    for reminder in reminders:
        if reminder.deadline == date.today():
            reminder.pk = None
            reminder.deadline = reminder.deadline + timedelta(days=reminder.days_recursive)
            reminder.save()
            print(f"reminder_changed")
