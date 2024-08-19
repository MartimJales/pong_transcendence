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
    path('game/', views.game, name='game'),
    path('logout/', views.logout, name='logout'),
    path('profile/<int:user_id>/', views.profile_view, name='user_profile')
] 