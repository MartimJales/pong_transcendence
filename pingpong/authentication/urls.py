from django.urls import path, re_path
from . import views

#URL COFIG for the app
urlpatterns = [
    #path('agora/', views.mama_eu), 
    #  path('', views.homerender, name='landing'),
    path('api/login/', views.api_login, name='api_login'), 
    path('api/signup/', views.signup, name='signup'),
    #re_path(r'^(?!admin/).*$', views.index, name='index'),
    re_path(r'^.*$', views.index, name='index'),   
] 