from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime, timedelta


class User(AbstractUser):
    pass
    
class Listing(models.Model):
    CATEGORIES = (
        ("TOY", "Toys"),
        ("TEC", "Tech"),
        ("HOM", "Home"),
        ("CLT", "Clothes"),
        ("MIS", "Miscellaneous"),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    image = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=64, blank=True, choices=CATEGORIES, default="MIS")

    current_bid = models.IntegerField()
    num_bids = models.IntegerField()
    active = models.BooleanField()

    def __str__(self):
        return f"{self.title}: {self.description}"

class Bid(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.FloatField()

class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    text = models.CharField(max_length=64)