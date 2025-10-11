from django.urls import path
from shop import views

urlpatterns = [
    path('product/', views.ProductList.as_view()),
    path('customers/', views.CustomerstList.as_view()),
]