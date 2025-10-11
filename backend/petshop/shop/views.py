from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Value
from django.db.models.functions import Concat

from shop.models import *
from shop.serializers import ProductSerializer, CustomerSerializer
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
        serializer = ProductSerializer(data.request.data)

    
class CustomerstList(APIView):

    def get(self, request, format=None):
                
        customers =Customer.objects.annotate(
            full_name=Concat("first_name", Value(" "), "last_name")
        )

        serializer = CustomerSerializer(customers, many=True)



        return Response({
            "customers": serializer.data
        })
