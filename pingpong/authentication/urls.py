from django.urls import path, re_path
from . import views

#URL CONFIG for the app
urlpatterns = [ 
    path('api/login/', views.api_login, name='api_login'), 
    path('api/signup/', views.signup, name='signup'),
    path('api/profile/', views.get_profile_data, name='profile'),
    path('api/logout/', views.handle_user_logout, name='logout'),
    path('api/add/', views.add_friend, name='add_friend'),
    path('api/editNick/', views.editNick, name='editNick'),
    path('api/game_local/', views.game_local, name='game_local'),
    path('api/matchhistory/', views.get_match_history, name='get_match_history'),
    path('api/endTour/', views.endTour, name='endTour'),
    path('api/getTournament/', views.getTournament, name='getTournament'),
    path('api/setOff/', views.setOff, name='setOff'),
    path('api/upload_profile_image/', views.upload_profile_image, name='upload_profile_image'),
    path('api/auth-status/', views.auth_status, name='auth_status'),
    path('api/getTournament/<int:index>/', views.getTournament2, name='get_tournament_by_index'),
    re_path(r'^.*$', views.index, name='index'),   
]