from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static

from . import views

#from pqrapp.views import formcsvView
from django.views.generic.base import TemplateView

urlpatterns = [
    url(r'^$',views.index, name='index'),
    url(r'^map/$', views.mapView, name='mapview'),
    url(r'^about/$', views.aboutView, name='about'),
    url(r'^fillslide/(?P<type>\d{0,})/(?P<stage>\d{0,})/(?P<tag>\w{3,})/$', views.fillSlide, name='fillslide'),
    url(r'^fillLogs/(?P<type>\d{0,})/(?P<tag>\w{3,})/$', views.fillLogs, name='fillLogs'),
    url(r'^moreLogs/(?P<step>\d{0,})/(?P<tag>\w{3,})/$', views.moreLogs, name='moreLogs'),
    url(r'^checktag/(?P<tag>\w{3,})/$', views.checkTag, name='checkTag'),
]