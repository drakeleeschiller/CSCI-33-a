from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # path("auctions/categories", views.categories, name="categories"),
    # path("auctions/watchlist", views.watchlist, name="watchlist"),
    path("auctions/create_listing", views.create_listing, name="create_listing"),
    path("auctions/<int:listing_id>", views.show_listing, name="show_listing")
]
