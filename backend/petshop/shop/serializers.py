from rest_framework import serializers
from shop.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name"
        ]

class ProductSerializer(serializers.ModelSerializer):
    categories = serializers.StringRelatedField(many=True)
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

class ProductReadSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)

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

    def validate_first_name(self, value):
        
        if not value.isalpha():
            raise serializers.ValidationError("กรุณากรอกชื่อจริงเป็นตัวอักษรเท่านั้น")
        return value

    def validate_last_name(self, value):
        
        if not value.isalpha():
            raise serializers.ValidationError("กรุณากรอกนามสกุลเป็นตัวอักษรเท่านั้น")
        return value

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

# ยังไม่เสร็จ
class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_pass = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get("username")
        password = data.get("password")
        confirm_pass = data.get("con_new_password")
        
        if not username or not password or not confirm_pass:
            raise serializers.ValidationError("กรุณากรอกข้อมูลให้ครบ")
        return data