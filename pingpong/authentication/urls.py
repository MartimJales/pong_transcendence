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
    path('game/<int:user_id>/', views.game, name='game'),
    path('logout/', views.logout, name='logout'),
    path('profile/<int:user_id>/', views.profile_view, name='user_profile'), 
    path('profile/<int:user_id>/edit/', views.edit_profile, name='edit_profile'),
    path('game_option/<int:user_id>/', views.game_option, name='game_option'),
    path('api/game_local/', views.game_end, name='game_local_api'),
    #path('game/<int:user_id>/game/', views.game_end, name='game_end'),
    path('history/<int:user_id>/', views.user_history, name='user_history'),
] 