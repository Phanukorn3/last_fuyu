from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Value
from django.db.models.functions import Concat
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login

from shop.models import *
from shop.serializers import ProductSerializer, CustomerSerializer, RegisterSerializer, LoginSerializer
# Create your views here.


class ProductList(APIView):

    def get(self, request):

        products = Product.objects.all()
        total_products = Product.objects.aggregate(total=Sum('quantity'))
        min_quantity = products.first().quantity
        max_quantity = products.last().quantity
        serializer = ProductSerializer(products, many=True)

        return Response({
            "min_quantity": min_quantity,
            "max_quantity": max_quantity,
            "total_products": total_products,
            "products": serializer.data
        })
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class CustomerstList(APIView):

    def get(self, request, format=None):
                
        customers =Customer.objects.annotate(
            full_name=Concat("first_name", Value(" "), "last_name")
        )

        serializer = CustomerSerializer(customers, many=True)



        return Response({
            "customers": serializer.data
        })

class Register(APIView):

    def post(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
