-- สร้างตาราง Category ก่อน
CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- INSERT ข้อมูล Category
INSERT INTO Category (name) VALUES
('สุนัข'),
('แมว'),
('อาหารเม็ด'),
('อาหารเปียก'),
('ของเล่น');

INSERT INTO public.shop_product (picture, name, price, quantity, crate_at) VALUES
('images/royalcanin_puppy.jpg', 'Royal Canin Puppy', 850.00, 20, CURRENT_TIMESTAMP),
('images/royalcanin_adult_dog.jpg', 'Royal Canin Adult Dog', 900.00, 15, CURRENT_TIMESTAMP),
('images/royalcanin_kitten.jpg', 'Royal Canin Kitten', 780.00, 30, CURRENT_TIMESTAMP),
('images/royalcanin_adult_cat.jpg', 'Royal Canin Adult Cat', 820.00, 25, CURRENT_TIMESTAMP),
('images/royalcanin_senior_dog.jpg', 'Royal Canin Senior Dog', 950.00, 10, CURRENT_TIMESTAMP);

INSERT INTO public.shop_customer (first_name, last_name, phone_number, address, role) VALUES
('สมชาย', 'ใจดี', '0891234567', '123/45 หมู่บ้านสุขสันต์ ถนนสุขุมวิท กรุงเทพฯ', 'user');