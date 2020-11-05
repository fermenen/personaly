from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from dashboard.models import Contact


@login_required
def index(request):

    contacts = Contact.objects.filter(owner=request.user)

    print(contacts)

    return render(request, 'dashboard/index.html', {'contact_list': contacts})



@login_required
def contact_view(request, url):

    try:
        for contact in Contact.objects.filter(url=url):
            if contact.owner.id == request.user.id:
                return render(request, 'dashboard/contact.html', {'contact': contact})
    except Contact.DoesNotExist:
        return redirect("dashboard_app")
    return redirect("dashboard_app")
