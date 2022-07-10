from django.urls import path
from . import util

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.show_entry, name="entry"),
    path("search", views.show_search, name="search"),
    path("create_new", views.create_new, name="create"),
    path("random", views.random_page, name="random"),
    path("edit/<str:title>", views.edit_entry, name="edit"),
]

