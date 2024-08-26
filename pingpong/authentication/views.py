from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, auth
from django.contrib import messages
from . forms import UserCreateForm
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Match
from django.contrib.auth.models import User
import json
from datetime import datetime


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

def game(request, user_id):
    user = request.user 
    return render(request, 'game.html', {'user': user})

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
        #'image_url': profile.userpic.url #if profile.userpic else None,
    }
    return render(request, 'profile.html', context)

@login_required
def edit_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    profile = user.playerprofile

    if request.method == 'POST':
        new_nick = request.POST.get('nick')
        if new_nick:
            profile.nick = new_nick
            profile.save()
            messages.success(request, 'Your nickname has been updated successfully.')
        else:
            messages.error(request, 'Please provide a valid nickname.')
        return redirect('user_profile', user_id=user.id)

    context = {
        'nick': profile.nick,
    }
    return render(request, 'edit_profile.html', context)

def game_option(request, user_id):
    user = request.user
    return render(request, 'game_option.html', {'user': user})

@csrf_exempt  # Desabilita a verificação CSRF (apenas para desenvolvimento)
# @login_required  # Descomenta se quiseres exigir login para acessar esta view
def game_end(request, user_id):
    print("Request method:", request.method)
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)

            player = User.objects.get(id=data['player_id'])
            player2 = User.objects.get(id=data['player2_id']) if data['player2_id'] else None

            match = Match.objects.create(
                player=player,
                player2=player2,
                earned_points=data['earned_points'],
                mode=data['mode'],
                opponent=data['opponent'],
                result=data['result'],
                match_date=datetime.fromisoformat(data['match_date'].replace('Z', '+00:00'))
            )
            
            # Redireciona para o perfil do utilizador após criar o match
            return redirect('user_profile', user_id=player.id)
        
        except Exception as e:
            # Renderiza novamente a página com a mensagem de erro
            return render(request, 'game.html', {'error': str(e), 'user_id': user_id})

    # Se for um GET ou outro método, renderiza a página padrão
    return render(request, 'profile.html', {'user_id': user_id})