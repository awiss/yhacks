from django.http import HttpResponse,HttpResponseRedirect
import requests
import logging

def firstText(request):
	if request.method == 'POST':
		pass
	else:
		return HttpResponse("Go away")
