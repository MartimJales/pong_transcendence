from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserCreateForm(UserCreationForm): #user creation form already in
    class Meta:
        model = User #user already has everything needed password, username, email, first_name.........
        fields = ['username' ,'email', 'password1'] #personalizadinho