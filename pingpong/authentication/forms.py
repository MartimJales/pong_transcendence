from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserCreateForm(UserCreationForm): #user creation form already in
    class Meta:
        model = User #from de model
        fields = ['username', 'email', 'password1', 'password2']