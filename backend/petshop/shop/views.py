from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Value, Min, Max
from django.db.models.functions import Concat
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.db.models import Q

from shop.models import *
from shop.serializers import ProductSerializer, CustomerSerializer, RegisterSerializer, LoginSerializer, ResetPasswordSerializer, ProductReadSerializer
# Create your views here.


class ProductList(APIView):

    def get(self, request):

        products = Product.objects.all().order_by('id')
        stats = Product.objects.aggregate(
            min_quantity=Min('quantity'),
            max_quantity=Max('quantity'),
            total_products=Sum('quantity')
        )

        # รับ filter price

        price_ranges = request.GET.getlist("price[]", [])
        price_filters = Q()
        for range_str in price_ranges:
            if range_str == "0-200":
                price_filters |= Q(price__lte=200)
            elif range_str == "201-400":
                price_filters |= Q(price__gt=200, price__lte=400)
            elif range_str == "401-700":
                price_filters |= Q(price__gt=400, price__lte=700)
            elif range_str == "700+":
                price_filters |= Q(price__gt=700)
        if price_filters:
            products = products.filter(price_filters)

        serializer = ProductReadSerializer(products, many=True)
        return Response({
            "min_quantity": stats.get('min_quantity'),
            "max_quantity": stats.get('max_quantity'),
            "total_products": stats.get('total_products'), 
            "products": serializer.data
        })
    
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetail(APIView):
    
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
        
    def put(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class AddProduct(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)

        return Response({
            "categories": serializer.data
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
    
class CategoryList(APIView):
    def get(self, request, format=None):
        categories = Category.objects.all().values_list('name', flat=True)
        return Response({"categories": list(categories)})

# ยังไม่เสร้จ
class ResetPassword(APIView):
    def post(self, request, format=None):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)