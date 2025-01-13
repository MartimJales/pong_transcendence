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
from .models import Match, PlayerProfile, Friendship
from django.contrib.auth.models import User
import json
from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError

from PIL import Image
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import uuid

# blockchain stuff
import os
from . import web3_settings 
from web3 import Web3
from eth_account import Account
from eth_utils import to_checksum_address
from hexbytes import HexBytes
from datetime import datetime, timezone


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('userName')
            email = data.get('email')
            password = data.get('pass')
            password_conf = data.get('passconf')

            try:
                User.objects.create_user(
                    username=username,
                    email=email,
                    password=password
                )
                return JsonResponse({
                    'success': 'Account created successfully, please login'
                }, status=201)

            except IntegrityError:
                return JsonResponse({
                    'error': 'Username or email already exists'
                },status=401)

        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON data'
            }, status=400)

        except Exception as e:
            return JsonResponse({
                'error': f'{str(e)}'
            }, status=500)

    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'status': 'CSRF cookie set'})

@csrf_exempt 
def api_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if username is None or password is None:
            return JsonResponse({'error': 'Please provide username and password'}, status=400)

        user = authenticate(username=username, password=password)

        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        login(request, user)
        return JsonResponse({
            'success': 'User logged in successfully',
            'user_id': user.id,
            'username': user.username,
            })
    return JsonResponse({'something went wrong': 'Method not allowed'})

@csrf_exempt
def auth_status(request):
    return JsonResponse({
        'isAuthenticated': request.user.is_authenticated,
        'username': request.user.username if request.user.is_authenticated else None
    })


@login_required
def add_friend(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            friend_name = data.get('friendName')
            
            if not friend_name:
                return JsonResponse({'error': 'Please enter friend name'}, status=400)
            
            current_profile = request.user.playerprofile
            try:
                friend_user = User.objects.get(username=friend_name)
                friend_profile = friend_user.playerprofile
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            except PlayerProfile.DoesNotExist:
                return JsonResponse({'error': 'User profile not found'}, status=404)
                
            
            if friend_user == request.user:
                return JsonResponse({'error': 'Cannot add yourself as friend'}, status=400)
                
            
            if Friendship.objects.filter(
                from_playerprofile_id=current_profile,
                to_playerprofile_id=friend_profile
            ).exists():
                return JsonResponse({'error': 'Already friends with this user'}, status=400)
                
            
            Friendship.objects.create(
                from_playerprofile_id=current_profile,
                to_playerprofile_id=friend_profile
            )
            
            return JsonResponse({'success': 'Friend added successfully'})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
       
    return JsonResponse({'something went wrong': 'Method not allowed'}, status=405)

@login_required
def get_profile_data(request):
    # print("chegou")
    try:
        user = request.user
        profile = user.playerprofile
        profile.is_online = True # logica da gambiarra
        profile.save()
        
        data = {
            'username': user.username,
            'nick': profile.nick,
            'losses': profile.losses,
            'wins': profile.wins,
            'total_points': profile.total_points,
            'image_url': f'/static/images/{profile.userpic}' if profile.userpic else '/static/images/default.jpg',
            'friends': [
                {'username': friend.user.username, 'is_online': friend.is_online}
                for friend in profile.friends.all()
            ]
        }
        return JsonResponse(data)
        
    except Exception as e:
        print(f"Error in get_profile_data: {str(e)}")  # Server-side logging
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def editNick(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_nick = data.get('nick')
            
            if not new_nick:
                return JsonResponse({
                    'error': 'Please provide a nickname'
                }, status=400)
            
            # Get user's profile and update nick
            profile = request.user.playerprofile
            profile.nick = new_nick
            profile.save()
            
            return JsonResponse({
                'success': True,
                'nick': new_nick
            })
            
        except Exception as e:
            return JsonResponse({
                'error': str(e)
            }, status=500)
    
    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

@login_required
def get_match_history(request):
    try:
        user = request.user
        profile = user.playerprofile
        
        # Get matches for the user, ordered by date
        matches = Match.objects.filter(player=user).order_by('-match_date')
        
        matches_data = [{
            'opponent': match.opponent,
            'result': match.result,
            'mode': match.mode,
            'earned_points': match.earned_points,
            'match_date': match.match_date.isoformat()
        } for match in matches]
        
        data = {
            'nick': profile.nick,
            'image_url': profile.userpic.url if profile.userpic else '/media/profile_pics/default.jpg',
            'matches': matches_data
        }
        
        return JsonResponse(data)
        
    except Exception as e:
        print(f"Error in get_match_history: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@login_required  
def game_local(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)

            player = request.user

            match = Match.objects.create( 
                player=player,
                player2=None,
                earned_points=data['earned_points'],
                mode=data['mode'],
                opponent=data['opponent'],
                result=data['result'],
                match_date=datetime.fromisoformat(data['match_date'].replace('Z', '+00:00'))
            )

            return JsonResponse({
                'status': 'success',
                'message': 'Match created successfully',
                'match_id': match.id
            })
        except json.JSONDecodeError as e:
            print("JSON Decode Error:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data'
            }, status=400)
        except KeyError as e:
            print("KeyError:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': f'Missing required field: {str(e)}'
            }, status=400)
        except User.DoesNotExist:
            print("User DoesNotExist Error")
            return JsonResponse({
                'status': 'error',
                'message': 'User not found'
            }, status=404)
        except Exception as e:
            print("Unexpected Error:", str(e))
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)

    return JsonResponse({
        'status': 'error',
        'message': 'Only POST requests are allowed SEU ARROMBADO'
    }, status=405)


def user_history(request, user_id):
    
    user = request.user
    #user = get_object_or_404(User, id=user_id) 
    user_matches = user.matches_as_player.all() # da para puxar no nome do model, só usar o related_name

    context = {'user': user, 'matches': user_matches}

    return render(request, 'profile_history.html', context)

@login_required
def get_friends_list(request):
    user = request.user
    friends = user.playerprofile.friends.all()
    friend_data = [{'username': friend.user.username, 'is_online': friend.is_online} for friend in friends]
    return JsonResponse({'friends': friend_data})


@ensure_csrf_cookie
def index(request):
    #if request.path.startswith('/admin/'):
     #   return HttpResponseRedirect('/admin/')  # Redirect to admin if someone tries to access it
    return render(request, 'index.html')

@login_required
def handle_user_logout(request):
    if request.user.is_authenticated:
        
        profile = request.user.playerprofile
        profile.is_online = False
        profile.save()

        logout(request)
        
        request.session.flush()
        
        return JsonResponse({
                    'status': 'success',
                    'message': 'Logged out successfully'
                })
        
    return HttpResponse(status=200)


@login_required
def upload_profile_image(request):
    try:
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image file provided'}, status=400)
        
        image_file = request.FILES['image']
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if image_file.content_type not in allowed_types:
            return JsonResponse({'error': 'Invalid file type. Please upload a JPEG, PNG or GIF'}, status=400)
        
        if image_file.size > 5 * 1024 * 1024:
            return JsonResponse({'error': 'File too large. Maximum size is 5MB'}, status=400)
        
        file_extension = os.path.splitext(image_file.name)[1]
        new_filename = f"profile_{request.user.id}_{uuid.uuid4().hex[:10]}{file_extension}"
        upload_path = os.path.join('profile_pics', new_filename)
        
        try:
            img = Image.open(image_file)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            max_size = (800, 800)
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            temp_path = os.path.join('profile_pics', f'temp_{new_filename}')
            with default_storage.open(temp_path, 'wb') as f:
                img.save(f, format='JPEG', quality=85)
            
            if request.user.playerprofile.userpic and \
               str(request.user.playerprofile.userpic) != 'profile_pics/default.jpg' and \
               os.path.exists(os.path.join(settings.MEDIA_ROOT, str(request.user.playerprofile.userpic))):
                default_storage.delete(str(request.user.playerprofile.userpic))
            
            request.user.playerprofile.userpic = upload_path
            request.user.save()
            default_storage.save(upload_path, default_storage.open(temp_path))
            default_storage.delete(temp_path)
            image_url = default_storage.url(upload_path)
            
            return JsonResponse({
                'success': True,
                'image_url': image_url
            })
            
        except Exception as e:
            if 'temp_path' in locals() and default_storage.exists(temp_path):
                default_storage.delete(temp_path)
            return JsonResponse({'error': str(e)}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
def endTour(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            quarter1 = data['quarter1']
            quarter2 = data['quarter2']
            finals = data['finals']
            date = data['date']

            quarter1_data = [quarter1['p1'], quarter1['p2'], quarter1['w'], quarter1['score']]
            quarter2_data = [quarter2['p1'], quarter2['p2'], quarter2['w'], quarter2['score']]
            finals_data = [finals['p1'], finals['p2'], finals['w'], finals['score']]
            nonce = web3_settings.w3.eth.get_transaction_count(web3_settings.WALLET_ADDRESS)
            
            transaction = web3_settings.contract.functions.addTournament(
                date,
                quarter1_data,
                quarter2_data,
                finals_data
            ).build_transaction({
                'from': web3_settings.WALLET_ADDRESS,
                'nonce': nonce,
                'gas': 3000000,  # Increased gas limit
                'gasPrice': web3_settings.w3.eth.gas_price,
                'chainId': 11155111  # Sepolia chain ID
            })

            signed = web3_settings.w3.eth.account.sign_transaction(
                transaction,
                private_key=web3_settings.WALLET_PRIVATE_KEY
            )
            
            tx_hash = web3_settings.w3.eth.send_raw_transaction(signed.raw_transaction)
            tx_receipt = web3_settings.w3.eth.wait_for_transaction_receipt(tx_hash)
            ne1w_count = web3_settings.contract.functions.getTournamentCount().call({
                'from': web3_settings.WALLET_ADDRESS
            })
            
            return JsonResponse({
                'success': True,
                'transaction_hash': tx_hash.hex(),
                'score': finals['score'],
                'winner': finals['w'],
                'indx': ne1w_count
            })
            
        except Exception as e:
            import traceback
            print(f"Error in endTour: {str(e)}")
            print(traceback.format_exc())
            return JsonResponse({
                'error': str(e),
                'traceback': traceback.format_exc()
            }, status=500)
            
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required
def setOff(request):
    if request.user.is_authenticated:
        
        profile = request.user.playerprofile
        profile.is_online = False
        profile.save()
                
        return JsonResponse({
                    'status': 'success',
                    'message': 'Set to off'
                })
        
    return HttpResponse(status=200)



@login_required
def getTournament(request):
    try:
        print("Contract Address:", web3_settings.CONTRACT_ADDRESS)
        print("Is Connected:", web3_settings.w3.is_connected())
        print("Chain ID:", web3_settings.w3.eth.chain_id)
        print("Contract Functions:", web3_settings.contract.functions)
        
        tournament_count = web3_settings.contract.functions.getTournamentCount().call({
            'from': web3_settings.WALLET_ADDRESS
        })

        index = tournament_count - 1
        date, quarter1_data, quarter2_data, finals_data = web3_settings.contract.functions.getTournament(index).call()

        tournament_data = {
            'date': date,
            'quarter1': {
                'player1': quarter1_data[0],
                'player2': quarter1_data[1],
                'winner': quarter1_data[2],
                'score': quarter1_data[3]
            },
            'quarter2': {
                'player1': quarter2_data[0],
                'player2': quarter2_data[1],
                'winner': quarter2_data[2],
                'score': quarter2_data[3]
            },
            'finals': {
                'player1': finals_data[0],
                'player2': finals_data[1],
                'winner': finals_data[2],
                'score': finals_data[3]
            }
        }

        return JsonResponse({
            'success': True,
            'quantity': index,
            'tour':tournament_data
        })
        
    except Exception as e:
        print(f"Error in getTournament: {str(e)}")
        # Add more detailed error information
        import traceback
        print(traceback.format_exc())
        return JsonResponse({
            'error': str(e),
            'details': {
                'contract_address': web3_settings.CONTRACT_ADDRESS,
                'is_connected': web3_settings.w3.is_connected(),
                'chain_id': web3_settings.w3.eth.chain_id
            }
        }, status=500)

@login_required
def getTournament2(request, index):
    try:
        print(f"Getting tournament at index: {index}")
        
        # Get tournament data using the provided index
        date, quarter1_data, quarter2_data, finals_data = web3_settings.contract.functions.getTournament(index).call({
            'from': web3_settings.WALLET_ADDRESS
        })
        
        tournament_data = {
            'date': date,
            'quarter1': {
                'player1': quarter1_data[0],
                'player2': quarter1_data[1],
                'winner': quarter1_data[2],
                'score': quarter1_data[3]
            },
            'quarter2': {
                'player1': quarter2_data[0],
                'player2': quarter2_data[1],
                'winner': quarter2_data[2],
                'score': quarter2_data[3]
            },
            'finals': {
                'player1': finals_data[0],
                'player2': finals_data[1],
                'winner': finals_data[2],
                'score': finals_data[3]
            }
        }
        
        return JsonResponse({
            'success': True,
            'tournament': tournament_data
        })
        
    except Exception as e:
        print(f"Error in getTournament: {str(e)}")
        return JsonResponse({
            'error': str(e)
        }, status=500)