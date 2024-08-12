from django.shortcuts import render
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
            return redirect('landing') 

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
    return render(request, 'login.html')

