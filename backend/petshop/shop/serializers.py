from rest_framework import serializers
from shop.models import *

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
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'full_name'
        ]