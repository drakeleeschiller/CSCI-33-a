from django.contrib import admin

from .models import User, Listing, Bid, Comment, Watchlist

# Register your models here.

class WatchlistAdmin(admin.ModelAdmin):
    filter_horizontal = ("listings",)

admin.site.register(User)
admin.site.register(Listing)
admin.site.register(Watchlist, WatchlistAdmin)
admin.site.register(Bid)
admin.site.register(Comment)