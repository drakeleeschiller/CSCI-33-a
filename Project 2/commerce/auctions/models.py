from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime, timedelta


class User(AbstractUser):
    # TO-DO: Implement this class
    pass
    
class Listing(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=256)

    current_bid = models.IntegerField()
    num_bids = models.IntegerField()
    active = models.BooleanField()

    def __str__(self):
        return f"{self.title}: {self.description}"

class Bid(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")
    amount = models.FloatField()


class Comment(models.Model):
    # TO-DO: Implement this class
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    text = models.CharField(max_length=64)