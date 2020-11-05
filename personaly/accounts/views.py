from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect


def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard_app")
    elif request.method == "POST":
        next_url = request.POST['next']
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            if next_url != "None":
                return redirect(next_url)
            return redirect("dashboard_app")
        else:
            return render(request, 'accounts/login.html', {'error_login': True, 'next': next_url})
    else:
        next_url = request.GET.get('next')
        return render(request, 'accounts/login.html', {'next': next_url})


def logout_view(request):
    logout(request)
    return redirect("web")
