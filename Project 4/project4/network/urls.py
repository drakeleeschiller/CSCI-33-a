
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts_home", views.posts_home, name="new_post"),
    path("posts", views.get_posts, name="get_posts"),

    # API
    path("profile/<str:username>", views.profile, name="profile"),
    path("change_follow", views.change_follow, name="change_follow"),
    path("check_follow", views.check_follow, name="check_follow"),


]
