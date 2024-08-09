from django.urls import path
from . import views

#URL COFIG for the app
urlpatterns = [   
    path('agora/', views.mama_eu), 
    path('', views.homerender, name='landing'),
    path('login/', views.loginrender, name='login'), 
    path('signup/', views.signup, name='signup'),
    path('wordcounter/', views.wordcounter, name='wordcounter'),
    path('result/', views.result, name='result'),
]