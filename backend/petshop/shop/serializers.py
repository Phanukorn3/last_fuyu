from rest_framework import serializers
from shop.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "picture",
            "name",
            "description",
            "price",
            "quantity",
            "crate_at",
            "categories",
        ]


class CustomerSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "full_name",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "password2",
        ]

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError("Password ไม่ตรงกัน")
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise serializers.ValidationError("กรุณากรอก username และ password")

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError("Username หรือ password ไม่ถูกต้อง")
        
        data['user'] = user
        return data