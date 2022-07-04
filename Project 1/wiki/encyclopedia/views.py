from django.shortcuts import render
from markdown2 import markdown

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def show_entry(request, title):
    content = markdown(util.get_entry(title))
    return render(request, "encyclopedia/wiki_page.html", {
        "title": title,
        "entry": util.get_entry(title),
        "content": content
    })

