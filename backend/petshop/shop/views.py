from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Value
from django.db.models.functions import Concat
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout
from django.db.models import Q
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


from shop.models import *
from shop.serializers import ProductSerializer, CustomerSerializer, RegisterSerializer, LoginSerializer, ResetPasswordSerializer, ProfileSerializer

class ProductList(APIView):

    def get(self, request):

        products = Product.objects.all()
        total_products = Product.objects.aggregate(total=Sum('quantity'))
        min_quantity = products.first().quantity
        max_quantity = products.last().quantity

        
        categories = request.GET.getlist("categories[]", [])
        if categories:
            products = products.filter(categories__name__in=categories).distinct()


        # filter price
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
            login(request, user) # ยังคง login session ไว้
            
            # ส่งข้อมูลจาก serializer กลับไป ซึ่งตอนนี้มี token และ user_id แล้ว
            return Response({
                "user_id": serializer.validated_data['user_id'],
                "token": serializer.validated_data['access'] # ส่ง access token กลับไป
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryList(APIView):
    def get(self, request, format=None):
        categories = Category.objects.all().values_list('name', flat=True)
        return Response({"categories": list(categories)})


class ResetPassword(APIView):
    @csrf_exempt
    def post(self, request, format=None):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Logout(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self, pk):
        """
        Helper method เพื่อดึง User จาก pk
        """
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        """สำหรับดึงข้อมูลโปรไฟล์"""
        user = self.get_object(pk)

        # --- ⬇️ ส่วนตรวจสอบความปลอดภัยที่สำคัญที่สุด ⬇️ ---
        if request.user != user:
            return Response(
                {"detail": "คุณไม่มีสิทธิ์เข้าถึงโปรไฟล์นี้"},
                status=status.HTTP_403_FORBIDDEN
            )
        # --- ⬆️ สิ้นสุดส่วนตรวจสอบ ⬆️ ---

        customer = Customer.objects.get(user=user)
        serializer = ProfileSerializer(customer)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        """สำหรับอัปเดตข้อมูลโปรไฟล์"""
        user = self.get_object(pk)

        # --- ⬇️ ตรวจสอบความปลอดภัยอีกครั้ง ⬇️ ---
        if request.user != user:
            return Response(
                {"detail": "คุณไม่มีสิทธิ์แก้ไขโปรไฟล์นี้"},
                status=status.HTTP_403_FORBIDDEN
            )
        # --- ⬆️ สิ้นสุดส่วนตรวจสอบ ⬆️ ---

        customer = Customer.objects.get(user=user)
        serializer = ProfileSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """
        ส่งคืนข้อมูลพื้นฐานของผู้ใช้ที่กำลัง login อยู่
        """
        # เราใช้ request.user ซึ่ง Django จัดการให้แล้วว่าคือใคร
        customer = Customer.objects.get(user=request.user)
        
        # ใช้ ProfileSerializer เดิมของคุณได้เลย!
        serializer = ProfileSerializer(customer) 
        return Response(serializer.data, status=status.HTTP_200_OK)