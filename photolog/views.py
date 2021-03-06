from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.template import loader, RequestContext
from django.urls import reverse
from django.views.generic import TemplateView
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.decorators import login_required

from collections import defaultdict

from PIL import Image

from photolog.models import *
#from pholog.forms import DocumentForm

import datetime
import os, struct, json
import ntpath
from django.conf import settings

# Global variables here

# Carrying tag variable server-side to lighten ajax processes
# Bad idea, left here for remembrance : this modify state of server for all users by action of one !!
#globalTag = 'NAN'


# Inner processing function

def clearPhotos():
    """
        Deletes photo files that are not related to any photo object
        To be run after photo object deletion with db api
    """
    listPhotoName = []

    for photo in Photo.objects.all():

        fileName = ntpath.basename(photo.file.url)
        listPhotoName.append(fileName)
        filename, ext = os.path.splitext(fileName)
        listPhotoName.append(filename + '_lowRes' + ext)

    filenames = []

    for path, subdirs, files in os.walk(settings.MEDIA_ROOT):
        for name in files:
            item = os.path.join(path, name)
            if ntpath.basename(item) not in listPhotoName:
                filenames.append(item)
                os.remove(item)

    print('Following files were deleted : \n', filenames)


# Rendering views

def index(request):
    """
        Renders introduction with no intro animation
    """

    context = {'today': datetime.date.today(),
               'city': Location.objects.order_by('-id')[0].city,
               'country': Location.objects.order_by('-id')[0].country
               }

    return render(request, 'photolog/index.html', context)


def welcome(request):
    """
        Renders introduction with intro animation
    """

    context = {'today': datetime.date.today(),
               'city': Location.objects.order_by('-id')[0].city,
               'country': Location.objects.order_by('-id')[0].country,
               'intro': 1
               }

    return render(request, 'photolog/index.html', context)


def mapView(request):
    """
        Quite empty for now, rendering OSM TravelMap
    """
    return render(request, 'photolog/mapview.html', {'today': datetime.date.today() })


def fillLogs(request, type, tag='NAN'):
    """
      Fills logs section with either logs (type 0), whole map selection (type 1),
      or log map section (type 2), or whole log section (type 3)
    """
    if tag == 'NAN':
        listArticle = Article.objects.order_by('-creationDate')
    else:
        countries = Country.objects.filter(tag_Id = tag)

        if len(countries):
            currentCountry = countries[0]

            listArticle = Article.objects.filter(relatedCountries = currentCountry).order_by('-creationDate')

        else:
            listArticle = Article.objects.order_by('-creationDate')


    if len(listArticle) == 0:
        return HttpResponseRedirect(reverse('welcome'))

    else:
        lastlog = listArticle[0]
        recentlogs = listArticle[1:3]
        otherlogs = listArticle[3:]

        if len(otherlogs) > 6:
            additionnallogs = otherlogs[6:]
            otherlogs = otherlogs[0:6]

        else:
            additionnallogs = []

    context = {
               'listArticle' : listArticle,
               'lastlog' : lastlog,
               'recentlogs' : recentlogs,
               'otherlogs' : otherlogs,
               'additionnallogs' : additionnallogs,
               'today' : datetime.date.today(),
               'tag' : tag,
                }
    if int(type) == 3:
        return render(request, 'photolog/logs.html', context)

    elif int(type) == 2:
        return render(request, 'photolog/fillsidemap.html', context)

    elif int(type) == 1:
        return render(request, 'photolog/fillmap.html', context)

    else:
        return render(request, 'photolog/filllogs.html', context)

def moreLogs(request, step, tag='NAN'):
    """
        Add more logs. Step contains the number of 'more' clicked, and determines what logs to send.
    """
    moreLogStep = 6

    point = 9 + (int(step)-1) * moreLogStep

    if tag == 'NAN':
        listArticle = Article.objects.order_by('-creationDate')
    else:
        countries = Country.objects.filter(tag_Id = tag)

        if len(countries):
            currentCountry = countries[0]

            listArticle = Article.objects.filter(relatedCountries = currentCountry).order_by('-creationDate')

        else:
            listArticle = Article.objects.order_by('-creationDate')

    if len(listArticle) <= point:

        print('nolog')
        context = {
                   'additionnallogs' : [],
                  }

        return render(request, 'photolog/morelogs.html', context)

    else:
        if len(listArticle) <= (point + moreLogStep):
            context = {
                       'additionnallogs' : listArticle[point:],
                       'tag' : tag,
                      }

        else:
            context = {
                       'additionnallogs' : listArticle[point:point+moreLogStep],
                       'tag' : tag,
                      }

        return render(request, 'photolog/morelogs.html', context) 


def checkTag(request, tag):
    """
      Checks if there is any country related to this tag
    """
    countries = Country.objects.filter(tag_Id = tag)

    if len(countries):
        listArticle = Article.objects.filter(relatedCountries = countries[0])
        check = len(listArticle)

    else:
        check = 0

    return JsonResponse({"check": check})


def getSideId(stage, tag='NAN'):
    """
        Based on stage, returns a pair of ids, of side articles of same tag
    """
    idList = []

    if tag == 'NAN':
        listArticle = Article.objects.order_by('-creationDate')
    else:
        currentCountry = Country.objects.filter(tag_Id = tag)[0]
        listArticle = Article.objects.filter(relatedCountries = currentCountry).order_by('-creationDate')

    for article in listArticle:
        idList.append(article.id)

    currentIndex = idList.index(int(stage))
    idSize = len(idList)

    if currentIndex == idSize-1:
        if currentIndex == 0:
            idSide = [idList[currentIndex],idList[currentIndex]]
        else:
            idSide = [idList[currentIndex-1],idList[0]]
    else:
        if currentIndex == 0:
            idSide = [idList[idSize-1],idList[currentIndex+1]]
        else:
            idSide = [idList[currentIndex-1],idList[currentIndex+1]]

    return (idSide, idList)


def fillSlide(request, type, stage, tag='NAN'):
    """
        Based on type, launches slideshow, or fills content, or cover
    """
    if int(type) == 3:
        currentArticle = Article.objects.latest('id')
    else:
        currentArticle = get_object_or_404(Article, id = stage)

    photo = currentArticle.relatedPhotos.all()[0]

    (idSide, idList) = getSideId(currentArticle.id, tag)

    context = {
               'idSide' : idSide,
               'idList' : idList,
               'currentArticle' : currentArticle,
               'photo' : photo,
               'today' : datetime.date.today(),
               'tag' : tag,
               }

    if int(type) == 2 or int(type) == 3:
        return render(request, 'photolog/slideshow.html', context)
    elif int(type) == 1:
        return render(request, 'photolog/fillslide.html', context)
    else:
        return render(request, 'photolog/fillcover.html', context)


def aboutView(request):
    """
        Quite empty for now, rendering About stuff
    """
    return render(request, 'photolog/about.html', {'today': datetime.date.today(), 'locations' : Location.objects.all() })




    # def modifyStuff(request):

    # post = request.POST['list_bouteille']
    # counter = json.loads(post)


    # # for bouteille in list_bouteille:
    # #     nom = bouteille['nom']
    # #     quantite = bouteille['quantite']
    # #     print "Une bouteille du nom de "+nom+ " et de quantite "+quantite


    # listArticle = Article.objects.order_by('-creationDate')

    # currentArticle = listArticle[0]

    # realcount = int(counter)

    # print(realcount)

    # text = currentArticle.textContent[:realcount]
    # photo = Photo.objects.all()[1]

    # # on fait un retour au client
    # json_data = json.dumps({"HTTPRESPONSE":"fcker"})

    # # json data est maintenant au format JSON et pret a etre envoye au client
    # #return HttpResponse(json_data, content_type="application/json")


    # return JsonResponse({"HTTPRESPONSE":str(photo.file),"contextt":text})




