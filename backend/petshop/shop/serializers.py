from rest_framework import serializers
from shop.models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


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

        if len(data["password"]) < 6:
            raise serializers.ValidationError("กรุณาตั้งรหัสผ่านมากกว่า 6 ตัวอักษร")
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

        customer = Customer(user=user)
        customer.save()
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

        data["user"] = user
        return data


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate_username(self, value):

        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("ไม่พบชื่อผู้ใช้ในระบบ")
        self.user = user
        return value

    def validate(self, data):
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if new_password != confirm_password:
            raise serializers.ValidationError("รหัสผ่านไม่ตรงกัน")

        if len(new_password) < 6:
            raise serializers.ValidationError("กรุณาตั้งรหัสผ่านใหม่ มากกว่า 6 ตัวอักษร")

        return data

    def save(self):
        user = self.user
        new_password = self.validated_data["new_password"]

        user.set_password(new_password)
        user.save()

        return user
