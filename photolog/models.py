from __future__ import unicode_literals

from django.db import models

from django.utils import timezone
from django.utils.encoding import python_2_unicode_compatible
from django.template.defaultfilters import default
from django.conf import settings

#from PIL import Image

import struct
import os
import datetime


class Location(models.Model):
    """
        Singleton storing current location
    """
    city = models.CharField(max_length=200, default='No City', verbose_name='City')
    country = models.CharField(max_length=200, default='No Country', verbose_name='Country')

    def __str__(self):
        return str(self.city)


class Photo(models.Model):
    """
        Stores photo and meta, plus low res verion to speed up loadings
    """
    title = models.CharField(max_length=200, default='No Title', verbose_name='Title')
    file = models.FileField(upload_to='', default='No File')
    lowResFile = models.FileField(upload_to='', default='No File')
    is_dark = models.BooleanField(default=False)

    def __str__(self):
        return str(self.title)

    def fillLowRes(self):
        """
            Fill LowRes field based on full res stored in attribute "file"
        """
        if self.lowResFile == 'No File':

            filePath = str(self.file.url)

            filename, ext = os.path.splitext(filePath)

            cwd = os.getcwd()

            im = im2 # Image.open(cwd+filePath)
            #nx, ny = im.size
            #im2 = im.resize((int(nx*0.4), int(ny*0.4)), Image.ANTIALIAS)

            newName = str(cwd + filename + '_lowRes' + ext)

            im2.save(newName)

            self.lowResFile = filename[7:] + '_lowRes' + ext

            self.save()

    def save(self, *args, **kwargs):
        """
            Overrides default save
        """
        super(Photo, self).save(*args, **kwargs)

        self.fillLowRes()


class Country(models.Model):
    """
        Tags attributed to logs to sort them
    """
    tag_Id = models.CharField(max_length=200, default='NAN', verbose_name='Tag ID')
    name = models.CharField(max_length=200, default='No name', verbose_name='Full Name')

    def __str__(self):
        return str(self.name)

    def createSubDirs(self):
        """
            Creates dir and subdirs to tidy media and their tag
        """
        cwd = os.getcwd()

        newDirPath = cwd + settings.MEDIA_URL + self.tag_Id

        subDir1 = newDirPath + '/hiRes'

        subDir2 = newDirPath + '/lowRes'

        # New dir for tag, first subdir also creates parent tag dir
        try:
            os.makedirs(subDir1)
            os.mkdir(subDir2)
        except:
            pass


    def save(self, *args, **kwargs):
        """
            Overrides default save
        """
        print
        super(Country, self).save(*args, **kwargs)

        self.createSubDirs()


class Article(models.Model):
    """
        Basic article class to associate some text with metas and PhotoImage
    """
    textContent = models.TextField(verbose_name='Article Content')
    creationDate = models.DateField(default=datetime.date.today(),verbose_name='Creation Date')
    author = models.CharField(max_length=200, default='No Author', verbose_name='Author')
    title = models.CharField(max_length=200, default='No Title', verbose_name='Title')
    relatedPhotos = models.ManyToManyField(Photo)
    relatedCountries = models.ManyToManyField(Country)

    def __str__(self):
        return str(self.title)

    def tidyPhoto(self):

        countries = self.relatedCountries.all()

        if len(countries):
            currentCountry = self.relatedCountries.all()[0]
            currentTag = currentCountry.tag_Id
        else:
            currentTag = 'NAN'
            return 0

        cwd = os.getcwd()
        lowResPath = cwd + settings.MEDIA_URL + currentTag + '/lowRes/'
        hiResPath = cwd + settings.MEDIA_URL + currentTag + '/hiRes/'

        for photo in self.relatedPhotos.all():

            photoUrl = photo.file.url
            photoLowResUrl = photo.lowResFile.url
            photoName = str(photo.file.name)
            photoLowResName = str(photo.lowResFile.name)

            if 'hiRes/' not in photoUrl:
                os.rename(cwd + photoUrl, hiResPath + photoName)

                photo.file = currentTag + '/hiRes/' +  photoName

            if 'lowRes/' not in photoLowResUrl:
                os.rename(cwd + photoLowResUrl, lowResPath + photoLowResName)

                photo.lowResFile = currentTag + '/lowRes/' +  photoLowResName

            photo.save()


    def save(self, *args, **kwargs):
        """
            Overrides default save
        """
        super(Article, self).save(*args, **kwargs)

        self.tidyPhoto()

