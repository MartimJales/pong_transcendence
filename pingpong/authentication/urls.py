from django.urls import path
from . import views

#URL COFIG for the app
urlpatterns = [   
    path('agora/', views.mama_eu), 
    path('poha/', views.viadinho), 
    path('home/', views.homerender, name='landing'),
    path('login/', views.loginrender, name='login')
]