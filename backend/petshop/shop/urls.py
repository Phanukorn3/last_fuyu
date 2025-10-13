from django.urls import path
from shop import views

urlpatterns = [
    path('product/', views.ProductList.as_view()),
    path('customers/', views.CustomerstList.as_view()),
    path('register/', views.Register.as_view()),
    path('login/', views.Login.as_view()),
    path("categories/", views.CategoryList.as_view()),
    path("resetpassword/", views.ResetPassword.as_view()),
]