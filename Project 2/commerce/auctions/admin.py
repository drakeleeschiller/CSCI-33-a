from django.contrib import admin

from .models import User, Product, Listing, Bid, Comment

# Register your models here.

admin.site.register(User)
admin.site.register(Product)
admin.site.register(Listing)
admin.site.register(Bid)
admin.site.register(Comment)