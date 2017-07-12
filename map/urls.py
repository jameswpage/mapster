from django.conf.urls import url

from . import views

#this is the namespace so that django knows which app to create
#for a url when using the {% url %} template tag
#now when using that tag, you say {% url 'app_name:name' %}
app_name = 'map'

urlpatterns = [
    url(r'^$', views.index, name='index'),
    #ex: /map/image
    url(r'^image/$', views.image, name='image')
]