from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import User, Listing, Bid, Comment, Watchlist

def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.all()
    })


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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def create_listing(request):
    if request.method == "POST":
        user = request.user
        title = request.POST.get("title", "")
        description = request.POST.get("description", "")
        start_bid = request.POST.get("start_bid", 0)
        image = request.POST.get("image", None)
        category = request.POST.get("category", None)

        listing = Listing(
            owner=user,
            title=title,
            description=description,
            start_bid=start_bid,
            current_bid=start_bid,
            num_bids=0,
            image=image,
            category=category,
            active=True
            )
        listing.save()
        listing_id = listing.id
        return HttpResponseRedirect(reverse("show_listing", args=(listing_id,)))
    else:
        return render(request, "auctions/create_listing.html")

def show_listing(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        raise Http404("Listing not found.")
    return render(request, "auctions/show_listing.html", {
        "listing": listing,
    })

def filter_auctions(request):
    if request.method == "GET":
        cat = request.GET.get("category", None)
        return render(request, "auctions/categories.html", {
            "filtered_listings": Listing.objects.filter(category=cat).all()
        })
    return render(request, "auctions/index.html", {
        "filtered_listings": Listing.objects.all()
    })

def watchlist(request):
    try:
        watchlist = Watchlist.objects.get(id = request.user)
    except Watchlist.DoesNotExist:
        raise Http404("Watchlist not found.")
    return render(request, "auctions/watchlist.html", {
        "user": watchlist.owner,
        "watchlist": watchlist.listings,
    })
