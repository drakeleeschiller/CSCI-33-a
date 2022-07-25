import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from itertools import chain

from .models import Post, User, Follow


@csrf_exempt
def index(request):
    return render(request, "network/index.html")

@csrf_exempt
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

@csrf_exempt
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

@csrf_exempt
def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@csrf_exempt
def posts_home(request):
    print("in posts_home")
    # If the request is a POST request, then a user is trying to create a new post
    if request.method == "POST":
        # Get the request info via request.body (different from post_body)
        data = json.loads(request.body)
        # Default value is empty string
        post_body = data.get("post_body", "")
        post = Post(
            owner=request.user,
            post_body=post_body,
        )
        print("before", post)
        post.save()
        print("after", post)
        return HttpResponse(status=204)
        # TO-DO: Figure out what to do after save

@csrf_exempt
def get_posts(request):
    if request.method == "GET":
        # Get all the posts from the DB and return it
        posts = Post.objects.all()
        print("type of posts is", type(posts))
        posts = posts.order_by("-timestamp").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
def profile(request, username):
    # Query for requested user
    print("Profile in views.py")
    try:
        user = User.objects.get(username=username)
        print("user is ", user)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    # Return the user's information
    if request.method == "GET":
        # user_context is the username of the person currently logged in
        user_context = request.user.username
        name = user.username
        posts_by_user = Post.objects.filter(owner=user)
        posts_by_user = [post.serialize() for post in posts_by_user]
        followers = list(Follow.objects.filter(following_user=user).values())
        following = list(Follow.objects.filter(user=user).values())
        # return JsonResponse({"name": name, "posts": posts_by_user, "followers": followers, "following": following,})

        return JsonResponse({"name": name, "posts": posts_by_user, "followers": followers, "following": following, "user_context": user_context,})

@csrf_exempt
@login_required
def change_follow(request):
    data = json.loads(request.body)
    username = data['username']
    username = User.objects.get(username=username)
    user_context = data['user_context']
    user_context = User.objects.get(username=user_context)

    print("username is", username)
    print("user_context is", user_context)


    # If the user wants to unfollow someone, delete the Follow object in the table
    if request.method == 'DELETE':
        print("DELETE clause")
        print(Follow.objects.filter(
            user = user_context, following_user = username
        ))
        Follow.objects.filter(
            user = user_context, following_user = username
        ).delete()
    
     # If the user wants to follow someone, add the Follow object in the table
    elif request.method == 'POST':
        print("POST clause")
        follow = Follow(user = user_context, following_user = username)
        follow.save()
    
    return HttpResponse(status=204)

# Check if the follow object exists; if it throws an error during get, then it doesn't
@csrf_exempt
@login_required
def check_follow(request):
    data = json.loads(request.body)
    username = data['username']
    username = User.objects.get(username=username)
    user_context = data['user_context']
    user_context = User.objects.get(username=user_context)
    print("HELLO")
    print(Follow.objects.filter(user = user_context).filter(following_user = username))
    if (Follow.objects.filter(user = user_context).filter(following_user = username)):
        print("MODEL EXISTS / TRUE clause")
        return HttpResponse("true")
    else:
        print("MODEL DOES NOT EXIST / FALSE clause")
        return HttpResponse("false")

@csrf_exempt
@login_required
def fetch_following_posts(request):
    username = request.user
    username = User.objects.get(username=username)
    following = list(Follow.objects.filter(user=username).values())
    target_posts = []
    following_users_id = []
    for following_dict in following:
        following_user_id = following_dict['following_user_id']
        following_users_id.append(following_user_id)
    
    # iterate through all users this person follows and get those people's
    for user_id in following_users_id:
        user = User.objects.get(pk=user_id)
        posts = Post.objects.filter(owner = user)
        target_posts += posts
    
    posts = [post.serialize() for post in target_posts]
    sorted_posts = sorted(posts, key=lambda x: x['timestamp'], reverse=True)

    # target_posts = target_posts.order_by("-timestamp").all()
    return JsonResponse(sorted_posts, safe=False)
