from django import template
from photolog.views import *
from photolog.models import *

register = template.Library()


@register.filter
def listindex(List, i):
    try:
        return List[int(i)]
    except:
        pass
    
@register.filter
def llistindex(List, i):
    try:
        return [List[int(i)]]
    except:
        pass

@register.filter
def iseqnocare(a,b):
    return int(a) == int(b)

@register.filter
def iseq(a,b):
    try:
        return a == b
    except:
        return int(a) == int(b)


@register.filter
def selecfirstorder(list,b):
    return [list.order_by(b)[0]]

@register.filter
def order_by(list,b):
    return list.order_by(b)

@register.filter
def filtercol(list,b):
    return list.filter(colcolor = 'CMYK'[b])

@register.filter
def filtercolrep(list,b):
    return list.filter(colreport = b)

@register.filter
def indexof(list,b):
    return list.index(b)

@register.filter
def add(a,b):
    return int(a)+int(b)

@register.filter
def step(list,pas):
    return list[::pas]

@register.filter
def diff(a,b):
    try:
        return a != b
    except:
        return int(a) != int(b)