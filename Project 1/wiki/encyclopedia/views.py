from django.shortcuts import render
from markdown2 import markdown
from django import forms
from django.contrib import messages
from random import randint
# import logging
# logger = logging.getLogger('app_api') #from LOGGING.loggers in settings.py

from . import util

class NewSearchForm(forms.Form):
    search_term = forms.CharField(label="Search Encyclopedia")

class NewPageForm(forms.Form):
    title = forms.CharField(label="Page title")
    markdown = forms.CharField(label="Markdown content", widget=forms.Textarea(attrs={"rows":4, "cols":10}))


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "search_form": NewSearchForm(),
    })

def show_entry(request, title):
    content = markdown(util.get_entry(title))
    return render(request, "encyclopedia/wiki_page.html", {
        "title": title,
        "content": content,
        "search_form": NewSearchForm(),
    })

# Search box for looking for existing wikipedia entries
def show_search(request):
    if request.method == "GET":
        search = NewSearchForm(request.GET)
        if search.is_valid():
            search_term = str(search.cleaned_data['search_term'])
        else:
            # display old search form back to them if there is an error
            messages.error(request,'There is an error with your search request!')
            return render(request, "encyclopedia/index.html", {
                "entries": util.list_entries(),
                "search_form": search,
            })
    # logger.log(50, "The search term is: " + search_term)
    # print("The search term is: " + search_term)
    results = []
    for entry in util.list_entries():
        # if search term is exact match
        if (search_term.lower() == entry.lower()):
            return show_entry(request, entry)
        # if search term is a substring
        if (search_term.lower() in entry.lower()):
            results.append(entry)
    return render(request, "encyclopedia/search_results.html", {
        "results": results,
        "search_form": NewSearchForm(),
    })

# Form for creating a new wiki page
def create_new(request):
    if request.method == "POST":
        create = NewPageForm(request.POST)
        if create.is_valid():
            title = str(create.cleaned_data['title'])
            markdown = str(create.cleaned_data['markdown'])
        else:
            # Return the same search page/session if there's an error
            return render(request, "encyclopedia/new_page.html", {
                "search_form": NewSearchForm(),
                "new_page_form": create,
            })
        # Error pop-up if it's a valid form with an already existing title
        if title in util.list_entries():
            messages.error(request,'A page with that title already exists!')
            return render(request, "encyclopedia/new_page.html", {
                "search_form": NewSearchForm(),
                "new_page_form": create,
            })
        util.save_entry(title, markdown)
        # Go back to home screen if valid save
        return index(request)
    # Go back to home screen if not POST method
    return index(request)

def random_page(request):
    entries = util.list_entries()
    n = len(entries)
    return show_entry(request, entries[randint(0, n-1)])

def edit_entry(request, title):
    content = markdown(util.get_entry(title))
    edit_page_form = NewPageForm(initial={
                    'title':title, 
                    'markdown':content}),
    return render(request, "encyclopedia/edit_page.html", {
                "search_form": NewSearchForm(),
                "edit_page_form": edit_page_form
            })


