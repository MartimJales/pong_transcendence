from django.urls import path, re_path
from . import views

#URL COFIG for the app
urlpatterns = [
    #path('agora/', views.mama_eu), 
    #  path('', views.homerender, name='landing'),
    path('api/login/', views.loginrender, name='api_login'), 
    #path('signup/', views.signup, name='signup'),
    re_path(r'^.*$', views.index, name='index'),   
] 