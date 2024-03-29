"""personaly URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import django_js_reverse
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.utils.translation import ugettext_lazy as _
from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.views.generic import TemplateView
from js_urls.views import JsUrlsView
from django.views.i18n import JavaScriptCatalog

urlpatterns = [
    url(r'^robots\.txt', include('robots.urls')),
    path('api/', include('api.urls')),
    url(r'^js-urls/$', JsUrlsView.as_view(), name='js_urls'),
    url(r'^sw.js', (TemplateView.as_view(template_name="sw.js", content_type='application/javascript', )),
        name='sw.js'),
]

urlpatterns += i18n_patterns(
    path('jsi18n/', JavaScriptCatalog.as_view(), name='javascript-catalog'),
    path('my/', include('dashboard.urls')),
    path('users/', include('allauth.urls')),
    path('', include('web.urls')),

)

if settings.DEBUG:
    urlpatterns += static(settings.DIST_URL, document_root=settings.DIST_ROOT)
