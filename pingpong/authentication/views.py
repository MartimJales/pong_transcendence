from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from . forms import UserCreateForm


# Create your views here.

def mama_eu(request):
    #name = 'isadora pinto
    merdas = {
        'name': 'armando pinto',
        'age': 20,
        'email': 'armando@pinto.com'
    }
    return render(request, 'try.html', {'name' : 'armando pinto'}) #{'name' : name} #to pass struct => return render(request, 'try.html', merdas) 

def signup(request):

    form = UserCreateForm() #get form from forms.py

    if request.method == 'POST':
        form = UserCreateForm(request.POST) #post for login, gets everything from the form
        if form.is_valid(): # check everything is ok for register
            form.save() # dale in database
            return redirect ('login')
            #return render(request, 'index.html') #redirect to login page

    context = {'registerform':form} # to be able to use in .html
    return render(request, 'signup.html', context=context)

def result(request):
    wordis = request.POST['wordis']
    wordslen = len(wordis.split())
    return render(request, 'resultcounter.html', {'resultado': wordslen, 'teste': "hello"})

def game(request):
    return render(request, 'game.html')

def wordcounter(request):
    return render(request, 'wordcounter.html')

def homerender(request):
    return render(request, 'index.html')

def loginrender(request):
    if request.method == 'POST':
        username = request.POST['username'] 
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect('user_profile', user_id=user.pk)
        else:
            messages.info(request, 'Wrong user or password meu parceiro, try again')
            return redirect ('login')
    else:
        return render(request, 'login.html')


def logout(request):
    auth.logout(request)
    return render(request, 'index.html')

def profile_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    #profile = user.playerprofile - objeto inteiro, we in .hmlt as profile.nick this way
    #context = {
        #'profile': profile,
    #}
    profile = user.playerprofile
    context = {
        'nick': profile.nick,
        'total_points': profile.total_points,
        'wins': profile.wins,
        'losses': profile.losses,
    }
    return render(request, 'profile.html', context)
