import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


from .models import Post, User, Follow


@csrf_exempt
@login_required
def index(request):
    return render(request, "network/index.html")


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


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


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
@login_required
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


def get_posts(request):
    if request.method == "GET":
        # Get all the posts from the DB and return it
        posts = Post.objects.all()
        posts = posts.order_by("-timestamp").all()
        print("in get_posts", posts)
        return JsonResponse([post.serialize() for post in posts], safe=False)


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
        name = user.username
        posts_by_user = list(Post.objects.filter(owner=user).values())
        followers = list(Follow.objects.filter(following_user=user).values())
        following = list(Follow.objects.filter(user=user).values())

        return JsonResponse({"name": name, "posts": posts_by_user, "followers": followers, "following": following})
