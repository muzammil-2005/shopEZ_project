const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Order = require('./models/Order');
const Review = require('./models/Review');
const connectDB = require('./config/db');

if (require.main === module) {
  dotenv.config();
  connectDB();
}

const sampleProducts = [
  {
    "name": "Wireless Noise-Canceling Headphones",
    "description": "Immersive sound experience with industry-leading noise cancellation, 30-hour battery life, and crystal-clear call quality.",
    "price": 16599,
    "originalPrice": 20749,
    "discount": 20,
    "category": "Electronics",
    "brand": "AudioTech",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.8,
    "numReviews": 12
  },
  {
    "name": "Ultra-HD Smart Watch Series 5",
    "description": "Track your fitness, heart rate, sleep quality, and receive calls & notifications with a stunning AMOLED display.",
    "price": 12449,
    "originalPrice": 16599,
    "discount": 25,
    "category": "Electronics",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "stock": 18,
    "rating": 4.6,
    "numReviews": 9
  },
  {
    "name": "Portable Bluetooth Waterproof Speaker",
    "description": "360-degree deep bass sound, IPX7 waterproof rating, and 24 hours of continuous playback.",
    "price": 6639,
    "originalPrice": 8299,
    "discount": 20,
    "category": "Electronics",
    "brand": "AudioTech",
    "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.6,
    "numReviews": 11
  },
  {
    "name": "4K Ultra HD Action Camera",
    "description": "Capture 4K 60fps action videos with EIS stabilization, waterproof case up to 130ft, and dual touchscreens.",
    "price": 10789,
    "originalPrice": 14109,
    "discount": 24,
    "category": "Electronics",
    "brand": "CamPro",
    "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.7,
    "numReviews": 8
  },
  {
    "name": "Wireless Mechanical Gaming Keyboard",
    "description": "Tactile mechanical switches, customizable RGB backlighting, and ultra-low latency 2.4GHz wireless connection.",
    "price": 7469,
    "originalPrice": 9959,
    "discount": 25,
    "category": "Electronics",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.8,
    "numReviews": 15
  },
  {
    "name": "Ergonomic RGB Gaming Mouse",
    "description": "16,000 DPI optical sensor, 8 programmable buttons, and ergonomic palm grip for marathon gaming sessions.",
    "price": 4149,
    "originalPrice": 5809,
    "discount": 28,
    "category": "Electronics",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.5,
    "numReviews": 10
  },
  {
    "name": "Smart WiFi Home Projector",
    "description": "Native 1080p resolution, 500 ANSI lumens brightness, built-in stereo speakers, and screen mirroring.",
    "price": 18259,
    "originalPrice": 23239,
    "discount": 21,
    "category": "Electronics",
    "brand": "VisionTech",
    "image": "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80",
    "stock": 14,
    "rating": 4.6,
    "numReviews": 13
  },
  {
    "name": "Portable Fast Power Bank 20000mAh",
    "description": "PD 65W fast charging for laptops, tablets, and smartphones. Dual USB-C and USB-A output ports.",
    "price": 3817,
    "originalPrice": 4979,
    "discount": 23,
    "category": "Electronics",
    "brand": "PowerPro",
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.9,
    "numReviews": 24
  },
  {
    "name": "Noise Canceling Earbuds Pro",
    "description": "Active noise cancellation, transparency mode, spatial audio, and wireless charging case.",
    "price": 9959,
    "originalPrice": 12449,
    "discount": 20,
    "category": "Electronics",
    "brand": "AudioTech",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    "stock": 28,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "Dual Monitor Desk Mount Stand",
    "description": "Full motion adjustable gas spring arms supporting dual monitors up to 32 inches.",
    "price": 4979,
    "originalPrice": 6639,
    "discount": 25,
    "category": "Electronics",
    "brand": "DeskCraft",
    "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    "stock": 22,
    "rating": 4.6,
    "numReviews": 7
  },
  {
    "name": "Smart LED Desk Lamp with Wireless Charging",
    "description": "5 color modes, 10 brightness levels, eye-caring flicker-free light, and integrated 10W wireless charger.",
    "price": 3319,
    "originalPrice": 4564,
    "discount": 27,
    "category": "Electronics",
    "brand": "DeskCraft",
    "image": "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.8,
    "numReviews": 14
  },
  {
    "name": "USB-C Multiport Docking Station",
    "description": "11-in-1 hub with Dual HDMI 4K, Gigabit Ethernet, 100W Power Delivery, SD Card reader, and 4 USB ports.",
    "price": 5809,
    "originalPrice": 7469,
    "discount": 22,
    "category": "Electronics",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.7,
    "numReviews": 16
  },
  {
    "name": "Classic Denim Jacket",
    "description": "Timeless style made from 100% premium cotton denim. Durable, stylish, and perfect for all seasons.",
    "price": 5809,
    "originalPrice": 7469,
    "discount": 22,
    "category": "Fashion",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.5,
    "numReviews": 7
  },
  {
    "name": "Casual Slim Fit Cotton Chinos",
    "description": "Comfortable stretch cotton casual trousers tailored for a sharp, modern silhouette.",
    "price": 4149,
    "originalPrice": 5809,
    "discount": 28,
    "category": "Fashion",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.4,
    "numReviews": 10
  },
  {
    "name": "Premium Leather Biker Jacket",
    "description": "Handcrafted genuine lambskin leather jacket with asymmetric zipper and quilted shoulder details.",
    "price": 15769,
    "originalPrice": 20749,
    "discount": 24,
    "category": "Fashion",
    "brand": "LeatherCraft",
    "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    "stock": 15,
    "rating": 4.9,
    "numReviews": 21
  },
  {
    "name": "Vintage Washed Graphic Hoodie",
    "description": "Heavyweight fleece cotton blend pullover hoodie with relaxed fit and vintage wash.",
    "price": 4564,
    "originalPrice": 6224,
    "discount": 26,
    "category": "Fashion",
    "brand": "StreetVibe",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.7,
    "numReviews": 18
  },
  {
    "name": "Tailored Slim Fit Blazer",
    "description": "Modern 2-button notch lapel jacket crafted from premium breathable wool blend fabric.",
    "price": 11619,
    "originalPrice": 14939,
    "discount": 22,
    "category": "Fashion",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.6,
    "numReviews": 12
  },
  {
    "name": "Organic Cotton Crewneck T-Shirt Pack (3-Pack)",
    "description": "Ultra-soft 100% organic combed cotton basics in neutral everyday colors.",
    "price": 2904,
    "originalPrice": 3734,
    "discount": 22,
    "category": "Fashion",
    "brand": "EcoBasics",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.8,
    "numReviews": 32
  },
  {
    "name": "High-Waisted Stretch Denim Jeans",
    "description": "Flattering body-shaping denim jeans with comfortable 4-way stretch and ankle length cut.",
    "price": 4979,
    "originalPrice": 6639,
    "discount": 25,
    "category": "Fashion",
    "brand": "DenimCo",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.6,
    "numReviews": 14
  },
  {
    "name": "Waterproof Outdoor Windbreaker Jacket",
    "description": "Lightweight packable rain jacket with adjustable hood, sealed seams, and reflective accents.",
    "price": 6224,
    "originalPrice": 8299,
    "discount": 25,
    "category": "Fashion",
    "brand": "TrailWear",
    "image": "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.7,
    "numReviews": 9
  },
  {
    "name": "Classic Double-Breasted Trench Coat",
    "description": "Elegant water-resistant cotton blend trench coat with removable waist belt.",
    "price": 13279,
    "originalPrice": 17429,
    "discount": 23,
    "category": "Fashion",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80",
    "stock": 18,
    "rating": 4.8,
    "numReviews": 15
  },
  {
    "name": "Linen Casual Button-Down Shirt",
    "description": "100% natural European flax linen long sleeve shirt for relaxed summer elegance.",
    "price": 4149,
    "originalPrice": 5394,
    "discount": 23,
    "category": "Fashion",
    "brand": "EcoBasics",
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.5,
    "numReviews": 11
  },
  {
    "name": "Stylish Oversized Knit Sweater",
    "description": "Cozy chunky knit wool blend crewneck sweater for maximum warmth and comfort.",
    "price": 5394,
    "originalPrice": 7054,
    "discount": 23,
    "category": "Fashion",
    "brand": "StreetVibe",
    "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80",
    "stock": 28,
    "rating": 4.7,
    "numReviews": 16
  },
  {
    "name": "Ergonomic Leather Gaming Chair",
    "description": "Premium lumbar support, adjustable armrests, and 180-degree recline for ultimate gaming and work comfort.",
    "price": 19007,
    "originalPrice": 24817,
    "discount": 23,
    "category": "Home & Kitchen",
    "brand": "ComfortPlus",
    "image": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=80",
    "stock": 10,
    "rating": 4.7,
    "numReviews": 15
  },
  {
    "name": "Automatic Espresso & Coffee Machine",
    "description": "Brew cafe-quality lattes, cappuccinos, and espresso at home with touch controls and built-in milk frother.",
    "price": 24899,
    "originalPrice": 31539,
    "discount": 21,
    "category": "Home & Kitchen",
    "brand": "BrewMaster",
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    "stock": 12,
    "rating": 4.9,
    "numReviews": 20
  },
  {
    "name": "Modern Ceramic Dinnerware Set (16-Piece)",
    "description": "Elegant matte finish scratch-resistant dinner plates, salad bowls, and mugs for sophisticated dining.",
    "price": 7469,
    "originalPrice": 9959,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "HomeDeco",
    "image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
    "stock": 15,
    "rating": 4.7,
    "numReviews": 5
  },
  {
    "name": "Air Fryer Max XL 5.8 Qt",
    "description": "8-in-1 digital touchscreen air fryer with 85% less oil crisping technology and nonstick dishwasher safe basket.",
    "price": 8299,
    "originalPrice": 10789,
    "discount": 23,
    "category": "Home & Kitchen",
    "brand": "ChefPro",
    "image": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.8,
    "numReviews": 22
  },
  {
    "name": "Smart Robot Vacuum Cleaner",
    "description": "2500Pa strong suction, LiDAR navigation, self-charging, and app/voice control for pet hair and hard floors.",
    "price": 20749,
    "originalPrice": 27389,
    "discount": 24,
    "category": "Home & Kitchen",
    "brand": "CleanHome",
    "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
    "stock": 18,
    "rating": 4.7,
    "numReviews": 17
  },
  {
    "name": "Non-Stick Granite Cookware Set (10-Piece)",
    "description": "PFOA-free eco-friendly granite nonstick frying pans and saucepans with heat-resistant handles.",
    "price": 9959,
    "originalPrice": 13279,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "ChefPro",
    "image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.6,
    "numReviews": 11
  },
  {
    "name": "Premium Stainless Steel Knife Block Set (15-Piece)",
    "description": "High-carbon German steel kitchen knives with ergonomic handles and built-in sharpener block.",
    "price": 6639,
    "originalPrice": 9129,
    "discount": 27,
    "category": "Home & Kitchen",
    "brand": "ChefPro",
    "image": "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.9,
    "numReviews": 26
  },
  {
    "name": "Touchless Sensor Kitchen Trash Can (13 Gal)",
    "description": "Infrared motion sensor lid with smudge-proof stainless steel finish and odor filter system.",
    "price": 5809,
    "originalPrice": 7469,
    "discount": 22,
    "category": "Home & Kitchen",
    "brand": "HomeDeco",
    "image": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    "stock": 22,
    "rating": 4.5,
    "numReviews": 8
  },
  {
    "name": "Ultrasonic Cool Mist Humidifier (4L)",
    "description": "Whisper-quiet operation, essential oil tray, auto shut-off, and 30 hours continuous humidification.",
    "price": 3319,
    "originalPrice": 4564,
    "discount": 27,
    "category": "Home & Kitchen",
    "brand": "CleanHome",
    "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "Memory Foam Ergonomic Bed Pillow",
    "description": "Contoured neck support memory foam pillow for side, back, and stomach sleepers.",
    "price": 2904,
    "originalPrice": 4149,
    "discount": 30,
    "category": "Home & Kitchen",
    "brand": "ComfortPlus",
    "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.8,
    "numReviews": 28
  },
  {
    "name": "French Press Coffee Maker (34 oz)",
    "description": "Heavy-duty borosilicate glass coffee press with 4-level filtration system and stainless steel plunger.",
    "price": 2074,
    "originalPrice": 2904,
    "discount": 28,
    "category": "Home & Kitchen",
    "brand": "BrewMaster",
    "image": "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.6,
    "numReviews": 14
  },
  {
    "name": "Luxury 1800 Microfiber Sheet & Duvet Set",
    "description": "Silky soft, wrinkle-free, deep pocket bed sheet set included with matching pillowcases.",
    "price": 3734,
    "originalPrice": 4979,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "ComfortPlus",
    "image": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.7,
    "numReviews": 15
  },
  {
    "name": "Organic Hydra Glow Facial Serum",
    "description": "Enriched with Vitamin C, Hyaluronic Acid, and Niacinamide for glowing, youthful, and hydrated skin.",
    "price": 2904,
    "originalPrice": 4149,
    "discount": 30,
    "category": "Beauty",
    "brand": "GlowOrganics",
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    "stock": 55,
    "rating": 4.7,
    "numReviews": 18
  },
  {
    "name": "Luxury Velvet Matte Lipstick Set",
    "description": "Set of 5 long-lasting, smudge-proof, high-pigment matte lip shades suitable for all skin tones.",
    "price": 3319,
    "originalPrice": 4979,
    "discount": 33,
    "category": "Beauty",
    "brand": "GlowOrganics",
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.6,
    "numReviews": 16
  },
  {
    "name": "Vitamin C Skin Brightening Face Wash",
    "description": "Gentle foaming cleanser infused with natural citrus extracts and antioxidants to reveal radiant skin.",
    "price": 1659,
    "originalPrice": 2323,
    "discount": 28,
    "category": "Beauty",
    "brand": "PureBotanicals",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.8,
    "numReviews": 25
  },
  {
    "name": "Revitalizing Retinol Anti-Aging Cream",
    "description": "Deeply moisturizing night cream formulated with 2.5% active Retinol and Hyaluronic Acid.",
    "price": 2489,
    "originalPrice": 3568,
    "discount": 30,
    "category": "Beauty",
    "brand": "DermaCare",
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.7,
    "numReviews": 20
  },
  {
    "name": "Professional Ionic Hair Dryer 1875W",
    "description": "Fast drying ceramic ionic blow dryer with 3 heat / 2 speed settings and diffuser attachments.",
    "price": 4149,
    "originalPrice": 5809,
    "discount": 28,
    "category": "Beauty",
    "brand": "GlamPro",
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.6,
    "numReviews": 14
  },
  {
    "name": "Organic Argan Oil Deep Hair Mask",
    "description": "Nourishing repair treatment mask for damaged, dry, or color-treated hair.",
    "price": 1908,
    "originalPrice": 2655,
    "discount": 28,
    "category": "Beauty",
    "brand": "PureBotanicals",
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.9,
    "numReviews": 30
  },
  {
    "name": "Activated Charcoal Detoxifying Scrub",
    "description": "Exfoliating face and body scrub that deep-cleans pores and eliminates blackheads.",
    "price": 1576,
    "originalPrice": 2074,
    "discount": 24,
    "category": "Beauty",
    "brand": "GlowOrganics",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    "stock": 55,
    "rating": 4.5,
    "numReviews": 13
  },
  {
    "name": "Rose Water Hydrating Facial Toner Spray",
    "description": "100% pure steam-distilled Moroccan rose water mist for refreshing skin and setting makeup.",
    "price": 1410,
    "originalPrice": 1908,
    "discount": 26,
    "category": "Beauty",
    "brand": "PureBotanicals",
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
    "stock": 65,
    "rating": 4.8,
    "numReviews": 22
  },
  {
    "name": "Hydrating Plumping Lip Oil Combo",
    "description": "Non-sticky tinted lip oil enriched with Jojoba and Coconut oils for ultra-shiny plump lips.",
    "price": 1327,
    "originalPrice": 1825,
    "discount": 27,
    "category": "Beauty",
    "brand": "GlamPro",
    "image": "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80",
    "stock": 70,
    "rating": 4.6,
    "numReviews": 17
  },
  {
    "name": "All-Natural Mineral Sunscreen SPF 50",
    "description": "Reef-safe non-nano Zinc Oxide sunscreen providing broad spectrum UVA/UVB protection.",
    "price": 2074,
    "originalPrice": 2738,
    "discount": 24,
    "category": "Beauty",
    "brand": "DermaCare",
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "Jade Roller & Gua Sha Facial Tool Set",
    "description": "100% natural Xiuyan Jade stone massager for anti-aging skin tightening and lymphatic drainage.",
    "price": 1659,
    "originalPrice": 2323,
    "discount": 28,
    "category": "Beauty",
    "brand": "GlowOrganics",
    "image": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.8,
    "numReviews": 26
  },
  {
    "name": "Pro Performance Running Shoes",
    "description": "Lightweight cushioned soles designed for maximum endurance, shock absorption, and speed.",
    "price": 9959,
    "originalPrice": 12449,
    "discount": 20,
    "category": "Sports",
    "brand": "SprintAir",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.8,
    "numReviews": 14
  },
  {
    "name": "Stainless Steel Insulated Water Bottle",
    "description": "Keeps beverages cold for 24 hours or hot for 12 hours. Leak-proof cap with eco-friendly powder coat finish.",
    "price": 2074,
    "originalPrice": 2904,
    "discount": 28,
    "category": "Sports",
    "brand": "HydroLife",
    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.9,
    "numReviews": 22
  },
  {
    "name": "Pro Non-Slip Yoga Mat & Carrying Strap",
    "description": "6mm eco-friendly TPE high-density cushioning mat for joint protection during workout & yoga.",
    "price": 2738,
    "originalPrice": 3817,
    "discount": 28,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.8,
    "numReviews": 13
  },
  {
    "name": "Adjustable Cast Iron Dumbbell Set (50 lbs)",
    "description": "Heavy-duty cast iron weight plates with textured chrome handles and secure star-lock collars.",
    "price": 7469,
    "originalPrice": 9959,
    "discount": 25,
    "category": "Sports",
    "brand": "IronGym",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.9,
    "numReviews": 28
  },
  {
    "name": "Heavy-Duty Resistance Exercise Bands Set (5 Pack)",
    "description": "100% natural latex workout bands with door anchor, handles, and ankle straps for home training.",
    "price": 2489,
    "originalPrice": 3319,
    "discount": 25,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "Professional Leather Boxing Gloves (14 oz)",
    "description": "Shock-absorbing foam padding and wrist wrap closure for heavy bag sparring and martial arts.",
    "price": 4149,
    "originalPrice": 5809,
    "discount": 28,
    "category": "Sports",
    "brand": "IronGym",
    "image": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.8,
    "numReviews": 16
  },
  {
    "name": "Waterproof Trail Hiking Backpack 40L",
    "description": "Tear-resistant nylon backpack with rain cover, trekking pole attachments, and breathable mesh back.",
    "price": 4979,
    "originalPrice": 6639,
    "discount": 25,
    "category": "Sports",
    "brand": "TrailWear",
    "image": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.6,
    "numReviews": 11
  },
  {
    "name": "Insulated Hydration Pack with 2L Bladder",
    "description": "BPA-free leak-proof water reservoir backpack for marathon running, cycling, and hiking.",
    "price": 3319,
    "originalPrice": 4398,
    "discount": 25,
    "category": "Sports",
    "brand": "HydroLife",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.7,
    "numReviews": 14
  },
  {
    "name": "Aerodynamic Bicycle Helmet with Rear Safety Light",
    "description": "In-mold PC shell with EPS foam protection, 21 ventilation airflow vents, and rechargeable LED light.",
    "price": 3734,
    "originalPrice": 4979,
    "discount": 25,
    "category": "Sports",
    "brand": "CyclePro",
    "image": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.8,
    "numReviews": 15
  },
  {
    "name": "Non-Slip Burst-Resistant Fitness Ball",
    "description": "Heavy-duty 65cm exercise Swiss ball included with quick foot pump for core stability training.",
    "price": 1825,
    "originalPrice": 2489,
    "discount": 26,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.6,
    "numReviews": 12
  },
  {
    "name": "Portable Double Camping Hammock with Tree Straps",
    "description": "Ultra-strong 210T parachute nylon hammock supporting up to 500 lbs for travel and camping.",
    "price": 2489,
    "originalPrice": 3319,
    "discount": 25,
    "category": "Sports",
    "brand": "TrailWear",
    "image": "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.9,
    "numReviews": 27
  },
  {
    "name": "Polarized Aviator Sunglasses",
    "description": "100% UV400 protection with lightweight stainless steel frame and anti-glare scratch-resistant lenses.",
    "price": 3735,
    "originalPrice": 5395,
    "discount": 31,
    "category": "Accessories",
    "brand": "VisionCraft",
    "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.4,
    "numReviews": 6
  },
  {
    "name": "Minimalist Genuine Leather Wallet",
    "description": "RFID blocking slim bifold wallet made from top-grain handcrafted genuine leather.",
    "price": 2489,
    "originalPrice": 3734,
    "discount": 33,
    "category": "Accessories",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.5,
    "numReviews": 8
  },
  {
    "name": "Vintage Canvas Messenger Laptop Bag",
    "description": "Water-resistant waxed canvas shoulder bag with padded sleeve fitting 15.6-inch laptops.",
    "price": 4979,
    "originalPrice": 6639,
    "discount": 25,
    "category": "Accessories",
    "brand": "LeatherCraft",
    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.7,
    "numReviews": 18
  },
  {
    "name": "Smart Key Finder Tracker Keychain",
    "description": "Bluetooth item finder with loud ringer, replaceable battery, and phone camera remote shutter.",
    "price": 2074,
    "originalPrice": 2904,
    "discount": 28,
    "category": "Accessories",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.6,
    "numReviews": 15
  },
  {
    "name": "Premium Silk Necktie & Cufflinks Gift Set",
    "description": "Handmade 100% jacquard woven silk tie, matching pocket square, and silver cufflinks.",
    "price": 2904,
    "originalPrice": 4149,
    "discount": 30,
    "category": "Accessories",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.8,
    "numReviews": 12
  },
  {
    "name": "Stainless Steel Chronograph Wristwatch",
    "description": "Water-resistant 50m analog quartz watch with Japanese movement and date window.",
    "price": 9959,
    "originalPrice": 13279,
    "discount": 25,
    "category": "Accessories",
    "brand": "VisionCraft",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.9,
    "numReviews": 22
  },
  {
    "name": "Anti-Theft Laptop Backpack with USB Port",
    "description": "Hidden zippers, cut-proof material, TSA lock, and external USB charging port.",
    "price": 4149,
    "originalPrice": 5809,
    "discount": 28,
    "category": "Accessories",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.7,
    "numReviews": 25
  },
  {
    "name": "Natural Leather Braided Bracelet Set (4 Pack)",
    "description": "Handcrafted genuine leather rope bracelets with adjustable magnetic stainless steel clasps.",
    "price": 1659,
    "originalPrice": 2323,
    "discount": 28,
    "category": "Accessories",
    "brand": "LeatherCraft",
    "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.5,
    "numReviews": 10
  },
  {
    "name": "Classic Wool Felt Fedora Hat",
    "description": "100% Australian wool structured fedora with stylish leather band and internal sweatband.",
    "price": 3319,
    "originalPrice": 4564,
    "discount": 27,
    "category": "Accessories",
    "brand": "VisionCraft",
    "image": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.6,
    "numReviews": 9
  },
  {
    "name": "Compact Travel Umbrella (Windproof 10 Rib)",
    "description": "Automatic open/close Teflon coated canopy withstands speeds up to 55 mph winds.",
    "price": 1825,
    "originalPrice": 2489,
    "discount": 26,
    "category": "Accessories",
    "brand": "UrbanStyle",
    "image": "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.8,
    "numReviews": 19
  },
  {
    "name": "Slim Aluminum RFID Cardholder Wallet",
    "description": "Pop-up quick access card mechanism holding up to 12 cards with integrated money clip.",
    "price": 2323,
    "originalPrice": 3153,
    "discount": 26,
    "category": "Accessories",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.7,
    "numReviews": 16
  },
  {
    "name": "Ultra-Portable Power Bank 20000mAh",
    "description": "High-speed 22.5W fast charging power bank with dual USB ports and LED digital battery display.",
    "price": 2499,
    "originalPrice": 3499,
    "discount": 28,
    "category": "Electronics",
    "brand": "PowerPro",
    "image": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "ThunderBolt 4 Multi-Port USB-C Hub",
    "description": "7-in-1 aluminum USB-C hub with 4K HDMI, 100W Power Delivery, SD card reader, and USB 3.0 ports.",
    "price": 4149,
    "originalPrice": 5499,
    "discount": 24,
    "category": "Electronics",
    "brand": "TechGear",
    "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.6,
    "numReviews": 14
  },
  {
    "name": "Compact Wireless Bluetooth Earbuds",
    "description": "Ergonomic in-ear TWS earbuds with touch controls, Bluetooth 5.3, and 28-hour total playtime with charging case.",
    "price": 3999,
    "originalPrice": 5999,
    "discount": 33,
    "category": "Electronics",
    "brand": "AudioTech",
    "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.8,
    "numReviews": 27
  },
  {
    "name": "Full HD Streaming Webcam 1080p",
    "description": "Pro streaming webcam with autofocus, built-in dual noise-reducing microphones, and privacy shutter.",
    "price": 3499,
    "originalPrice": 4999,
    "discount": 30,
    "category": "Electronics",
    "brand": "CamPro",
    "image": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.5,
    "numReviews": 16
  },
  {
    "name": "Smart Wi-Fi Security Camera 360",
    "description": "Indoor security camera with 1080p night vision, two-way audio talk, motion tracking, and cloud storage.",
    "price": 2999,
    "originalPrice": 3999,
    "discount": 25,
    "category": "Electronics",
    "brand": "SmartLife",
    "image": "https://images.unsplash.com/photo-1557862921-37829c790f19?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.6,
    "numReviews": 22
  },
  {
    "name": "Wireless Charging Pad Dual Station",
    "description": "Qi-certified 15W fast wireless charging pad for simultaneous smartphone and smartwatch charging.",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "category": "Electronics",
    "brand": "PowerPro",
    "image": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.4,
    "numReviews": 12
  },
  {
    "name": "Foldable Drone with 4K HD Camera",
    "description": "GPS drone with 4K camera, optical flow positioning, 30 minutes flight time, and one-key return feature.",
    "price": 24999,
    "originalPrice": 31999,
    "discount": 21,
    "category": "Electronics",
    "brand": "AeroTech",
    "image": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    "stock": 12,
    "rating": 4.9,
    "numReviews": 31
  },
  {
    "name": "Portable External Solid State Drive 1TB",
    "description": "Ultra-fast NVMe portable SSD with up to 1050MB/s read speed, drop-resistant aluminum enclosure.",
    "price": 7899,
    "originalPrice": 9999,
    "discount": 21,
    "category": "Electronics",
    "brand": "DataCore",
    "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80",
    "stock": 28,
    "rating": 4.8,
    "numReviews": 25
  },
  {
    "name": "Active Noise Cancelling Earbuds Pro",
    "description": "Premium wireless earbuds with hybrid ANC, transparency mode, custom spatial audio, and wireless case.",
    "price": 8499,
    "originalPrice": 11999,
    "discount": 29,
    "category": "Electronics",
    "brand": "AudioTech",
    "image": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.7,
    "numReviews": 18
  },
  {
    "name": "Smart LED TV Streaming Stick 4K",
    "description": "4K HDR streaming media player with Alexa voice remote, Dolby Vision support, and instant TV control.",
    "price": 3799,
    "originalPrice": 4999,
    "discount": 24,
    "category": "Electronics",
    "brand": "SmartLife",
    "image": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.6,
    "numReviews": 40
  },
  {
    "name": "Vintage Leather Crossbody Shoulder Bag",
    "description": "Handcrafted genuine leather handbag with multiple zip pockets, adjustable strap, and classic brass fittings.",
    "price": 3299,
    "originalPrice": 4499,
    "discount": 26,
    "category": "Fashion",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    "stock": 22,
    "rating": 4.7,
    "numReviews": 15
  },
  {
    "name": "Casual Cotton Graphic Printed T-Shirt",
    "description": "100% combed cotton breathable graphic crew neck tee with durable vibrant chest print.",
    "price": 1199,
    "originalPrice": 1699,
    "discount": 29,
    "category": "Fashion",
    "brand": "StreetWear",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    "stock": 65,
    "rating": 4.5,
    "numReviews": 34
  },
  {
    "name": "Water-Resistant Winter Puffer Jacket",
    "description": "Insulated quilted puffer jacket with detachable hood, thermal fleece lining, and windproof outer shell.",
    "price": 5499,
    "originalPrice": 7499,
    "discount": 26,
    "category": "Fashion",
    "brand": "AlpineGear",
    "image": "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800&auto=format&fit=crop&q=80",
    "stock": 18,
    "rating": 4.8,
    "numReviews": 21
  },
  {
    "name": "Classic Aviator Polarized Sunglasses",
    "description": "UV400 protection polarized lenses with lightweight alloy metal frame and silicone nose pads.",
    "price": 2199,
    "originalPrice": 2999,
    "discount": 26,
    "category": "Fashion",
    "brand": "OpticStyle",
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.6,
    "numReviews": 29
  },
  {
    "name": "Women Floral Print Summer Maxi Dress",
    "description": "Flowy chiffon summer dress with subtle slit, ruffle waist tie, and elegant botanical print.",
    "price": 2899,
    "originalPrice": 3899,
    "discount": 25,
    "category": "Fashion",
    "brand": "BellaModa",
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.7,
    "numReviews": 17
  },
  {
    "name": "Slim Fit Formal Dress Shirt",
    "description": "Wrinkle-resistant cotton blend spread collar dress shirt designed for sharp business attire.",
    "price": 1999,
    "originalPrice": 2699,
    "discount": 25,
    "category": "Fashion",
    "brand": "ExecutiveFit",
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.6,
    "numReviews": 24
  },
  {
    "name": "Leather Loafer Slip-On Shoes",
    "description": "Hand-stitched leather casual loafers with cushioned footbed and durable rubber traction outsole.",
    "price": 4299,
    "originalPrice": 5799,
    "discount": 25,
    "category": "Fashion",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.8,
    "numReviews": 20
  },
  {
    "name": "Knitted Cashmere Winter Beanie Cap",
    "description": "Soft wool blend knitted beanie with thermal cuff for superior warmth during cold weather.",
    "price": 899,
    "originalPrice": 1299,
    "discount": 30,
    "category": "Fashion",
    "brand": "AlpineGear",
    "image": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.4,
    "numReviews": 18
  },
  {
    "name": "Casual Canvas Low-Top Sneakers",
    "description": "Lightweight everyday low-top canvas sneakers with vulcanized rubber sole and padded collar.",
    "price": 2799,
    "originalPrice": 3699,
    "discount": 24,
    "category": "Fashion",
    "brand": "StreetWear",
    "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.6,
    "numReviews": 31
  },
  {
    "name": "Premium Bifold Genuine Leather Wallet",
    "description": "Full-grain leather wallet featuring RFID blocking protection, 8 card slots, and dual currency compartments.",
    "price": 1499,
    "originalPrice": 1999,
    "discount": 25,
    "category": "Fashion",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.7,
    "numReviews": 38
  },
  {
    "name": "Digital Touch Air Fryer 5.5L",
    "description": "Rapid air circulation technology with 8 preset cooking programs, nonstick dishwasher safe basket.",
    "price": 6999,
    "originalPrice": 9499,
    "discount": 26,
    "category": "Home & Kitchen",
    "brand": "ChefMaster",
    "image": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    "stock": 24,
    "rating": 4.8,
    "numReviews": 28
  },
  {
    "name": "Automatic Drip Espresso & Coffee Maker",
    "description": "15-bar Italian pump espresso machine with integrated milk frother wand and glass carafe.",
    "price": 8499,
    "originalPrice": 11499,
    "discount": 26,
    "category": "Home & Kitchen",
    "brand": "ChefMaster",
    "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    "stock": 16,
    "rating": 4.7,
    "numReviews": 22
  },
  {
    "name": "Non-Stick Granite Cookware Set 10Pcs",
    "description": "Scratch-resistant granite nonstick pots and pans set with heat-resistant tempered glass lids.",
    "price": 5999,
    "originalPrice": 7999,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "HomeEssentials",
    "image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.6,
    "numReviews": 19
  },
  {
    "name": "High-Speed Countertop Smoothie Blender",
    "description": "1200W commercial power blender with stainless steel 6-point extraction blades and 2L BPA-free pitcher.",
    "price": 3699,
    "originalPrice": 4999,
    "discount": 26,
    "category": "Home & Kitchen",
    "brand": "ChefMaster",
    "image": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.7,
    "numReviews": 26
  },
  {
    "name": "Smart Robot Vacuum Cleaner Wi-Fi",
    "description": "Automated robot vacuum with strong 2500Pa suction, self-charging dock, and smartphone app control.",
    "price": 16999,
    "originalPrice": 22999,
    "discount": 26,
    "category": "Home & Kitchen",
    "brand": "SmartLife",
    "image": "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&auto=format&fit=crop&q=80",
    "stock": 12,
    "rating": 4.8,
    "numReviews": 33
  },
  {
    "name": "Stainless Steel Electric Tea Kettle 1.7L",
    "description": "Fast boiling 1500W electric kettle with auto shut-off, boil-dry protection, and LED power light indicator.",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "category": "Home & Kitchen",
    "brand": "HomeEssentials",
    "image": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.5,
    "numReviews": 21
  },
  {
    "name": "Modern Ceramic Dinnerware Set 16Pcs",
    "description": "Elegantly glazed ceramic dinner plates, salad bowls, and mugs for 4-person table setting.",
    "price": 4499,
    "originalPrice": 5999,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "HomeEssentials",
    "image": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.7,
    "numReviews": 15
  },
  {
    "name": "Ultra-Quiet Cool Mist Humidifier",
    "description": "3L top-fill ultrasonic humidifier with essential oil diffuser tray and adjustable mist output nozzle.",
    "price": 2599,
    "originalPrice": 3499,
    "discount": 25,
    "category": "Home & Kitchen",
    "brand": "PureAir",
    "image": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.6,
    "numReviews": 18
  },
  {
    "name": "Bamboo Wood Cutting Board set",
    "description": "3-piece organic bamboo cutting board set with deep juice groove handles for butcher block prep.",
    "price": 1299,
    "originalPrice": 1799,
    "discount": 27,
    "category": "Home & Kitchen",
    "brand": "HomeEssentials",
    "image": "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.6,
    "numReviews": 23
  },
  {
    "name": "Ergonomic Memory Foam Bed Pillow",
    "description": "Contour memory foam neck support pillow with breathable washable bamboo cooling cover.",
    "price": 1799,
    "originalPrice": 2499,
    "discount": 28,
    "category": "Home & Kitchen",
    "brand": "RestEasy",
    "image": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.7,
    "numReviews": 29
  },
  {
    "name": "Organic Vitamin C Radiant Face Serum",
    "description": "Anti-aging facial serum infused with 20% Vitamin C, Hyaluronic Acid, and Vitamin E for glowing skin.",
    "price": 1499,
    "originalPrice": 1999,
    "discount": 25,
    "category": "Beauty",
    "brand": "GlowBotanica",
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.8,
    "numReviews": 35
  },
  {
    "name": "Hydrating Hyaluronic Acid Night Cream",
    "description": "Deep moisture restorative night cream that locks in hydration and reduces fine lines overnight.",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "category": "Beauty",
    "brand": "GlowBotanica",
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.7,
    "numReviews": 27
  },
  {
    "name": "Professional Salon Ionic Hair Dryer",
    "description": "1875W professional ionic blow dryer with diffuser nozzle, 3 heat settings, and cool shot button.",
    "price": 2999,
    "originalPrice": 3999,
    "discount": 25,
    "category": "Beauty",
    "brand": "ProStyle",
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.6,
    "numReviews": 19
  },
  {
    "name": "Luxury Matte Lipstick Velvet Trio",
    "description": "Set of 3 long-wearing waterproof matte lipsticks in classic red, nude pink, and berry shades.",
    "price": 1299,
    "originalPrice": 1799,
    "discount": 27,
    "category": "Beauty",
    "brand": "LuxeGlow",
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.5,
    "numReviews": 31
  },
  {
    "name": "Botanical Herbal Hair Oil",
    "description": "Cold-pressed Argan and Jojoba hair nourishing oil formula for strong root growth and scalp nourishment.",
    "price": 899,
    "originalPrice": 1199,
    "discount": 25,
    "category": "Beauty",
    "brand": "GlowBotanica",
    "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.6,
    "numReviews": 22
  },
  {
    "name": "Deep Cleansing Sonic Facial Brush",
    "description": "Waterproof silicone facial cleanser with 5 adjustable vibration speeds for deep pore exfoliation.",
    "price": 2199,
    "originalPrice": 2899,
    "discount": 24,
    "category": "Beauty",
    "brand": "GlowBotanica",
    "image": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.7,
    "numReviews": 24
  },
  {
    "name": "French Rose Eau De Parfum 100ml",
    "description": "Enchanting floral fragrance featuring notes of French rose, white musk, and blooming jasmine.",
    "price": 3499,
    "originalPrice": 4699,
    "discount": 25,
    "category": "Beauty",
    "brand": "LuxeGlow",
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.9,
    "numReviews": 38
  },
  {
    "name": "Nourishing Shea Butter Body Lotion",
    "description": "24-hour ultra moisturizing body lotion enriched with raw African shea butter and sweet almond oil.",
    "price": 799,
    "originalPrice": 1099,
    "discount": 27,
    "category": "Beauty",
    "brand": "GlowBotanica",
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80",
    "stock": 70,
    "rating": 4.5,
    "numReviews": 42
  },
  {
    "name": "Eyeshadow Palette 18 Vibrant Shades",
    "description": "Highly pigmented nude, shimmer, and matte powder eyeshadow palette with built-in full mirror.",
    "price": 1699,
    "originalPrice": 2299,
    "discount": 26,
    "category": "Beauty",
    "brand": "LuxeGlow",
    "image": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.6,
    "numReviews": 28
  },
  {
    "name": "Ceramic Flat Iron Hair Straightener",
    "description": "Tourmaline ceramic floating plates hair straightener with digital temperature control up to 450°F.",
    "price": 2499,
    "originalPrice": 3299,
    "discount": 24,
    "category": "Beauty",
    "brand": "ProStyle",
    "image": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    "stock": 28,
    "rating": 4.7,
    "numReviews": 20
  },
  {
    "name": "Anti-Burst Yoga & Exercise Fitness Ball",
    "description": "Heavy-duty 65cm anti-burst stability workout ball with quick foot inflation pump for core training.",
    "price": 1199,
    "originalPrice": 1599,
    "discount": 25,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.6,
    "numReviews": 25
  },
  {
    "name": "Adjustable Cast Iron Dumbbell Set 20kg",
    "description": "Solid cast iron weight plates with spinlock collars and ergonomic knurled chrome handles.",
    "price": 4999,
    "originalPrice": 6799,
    "discount": 26,
    "category": "Sports",
    "brand": "IronGrip",
    "image": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    "stock": 18,
    "rating": 4.8,
    "numReviews": 33
  },
  {
    "name": "Insulated Stainless Steel Sports Water Bottle",
    "description": "Double-wall vacuum insulated 1000ml water flask that keeps drinks cold for 24h or hot for 12h.",
    "price": 999,
    "originalPrice": 1399,
    "discount": 28,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    "stock": 80,
    "rating": 4.7,
    "numReviews": 45
  },
  {
    "name": "Professional FIFA Match Soccer Ball",
    "description": "Thermally bonded size 5 official match football with textured outer casing for enhanced flight precision.",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "category": "Sports",
    "brand": "StrikeSport",
    "image": "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=800&auto=format&fit=crop&q=80",
    "stock": 35,
    "rating": 4.7,
    "numReviews": 29
  },
  {
    "name": "Lightweight Carbon Badminton Racket Set",
    "description": "Dual high modulus carbon fiber badminton rackets with carrying bag and 3 tournament shuttlecocks.",
    "price": 2799,
    "originalPrice": 3699,
    "discount": 24,
    "category": "Sports",
    "brand": "StrikeSport",
    "image": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.6,
    "numReviews": 18
  },
  {
    "name": "Adjustable Speed Jump Rope",
    "description": "Tangle-free steel wire skipping rope with ball bearing mechanism and non-slip foam handles.",
    "price": 599,
    "originalPrice": 899,
    "discount": 33,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80",
    "stock": 90,
    "rating": 4.5,
    "numReviews": 38
  },
  {
    "name": "Resistance Loop Exercise Bands Set",
    "description": "5 color-coded latex resistance bands for strength training, physical therapy, and home fitness workouts.",
    "price": 799,
    "originalPrice": 1199,
    "discount": 33,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80",
    "stock": 75,
    "rating": 4.6,
    "numReviews": 41
  },
  {
    "name": "Breathable Gym Workout Gloves",
    "description": "Padded palm weightlifting gloves with integrated wrist wrap support and ventilated mesh back.",
    "price": 899,
    "originalPrice": 1299,
    "discount": 30,
    "category": "Sports",
    "brand": "IronGrip",
    "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    "stock": 55,
    "rating": 4.5,
    "numReviews": 27
  },
  {
    "name": "Outdoor Camping & Hiking Backpack 45L",
    "description": "Tear-resistant nylon tactical backpack with rain cover, hydration bladder compartment, and chest strap.",
    "price": 3299,
    "originalPrice": 4499,
    "discount": 26,
    "category": "Sports",
    "brand": "AlpineGear",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "stock": 22,
    "rating": 4.8,
    "numReviews": 32
  },
  {
    "name": "Digital Stopwatch & Interval Timer",
    "description": "Water-resistant digital timer with lap split memory, alarm clock, and large backlight screen.",
    "price": 1299,
    "originalPrice": 1799,
    "discount": 27,
    "category": "Sports",
    "brand": "FitPulse",
    "image": "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.4,
    "numReviews": 16
  },
  {
    "name": "Minimalist Stainless Steel Men Watch",
    "description": "Sleek ultra-thin analog watch with Japanese quartz movement, scratch-resistant sapphire glass, and mesh strap.",
    "price": 5999,
    "originalPrice": 7999,
    "discount": 25,
    "category": "Accessories",
    "brand": "Chronos",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.8,
    "numReviews": 24
  },
  {
    "name": "Women Rose Gold Mesh Strap Watch",
    "description": "Elegant rose gold dial wrist watch with crystal hour markers and water-resistant casing.",
    "price": 4899,
    "originalPrice": 6499,
    "discount": 24,
    "category": "Accessories",
    "brand": "Chronos",
    "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
    "stock": 20,
    "rating": 4.7,
    "numReviews": 21
  },
  {
    "name": "RFID Blocking Slim Card Holder",
    "description": "Pop-up quick access aluminum card ejector wallet holding up to 6 credit cards.",
    "price": 999,
    "originalPrice": 1499,
    "discount": 33,
    "category": "Accessories",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
    "stock": 65,
    "rating": 4.6,
    "numReviews": 37
  },
  {
    "name": "Pendant Necklace 14K Gold Plated",
    "description": "Delicate layered gold pendant necklace with hypoallergenic lobster claw clasp.",
    "price": 2199,
    "originalPrice": 2999,
    "discount": 26,
    "category": "Accessories",
    "brand": "BellaModa",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    "stock": 30,
    "rating": 4.7,
    "numReviews": 19
  },
  {
    "name": "Handcrafted Genuine Leather Belt",
    "description": "Classic 100% full-grain leather dress belt with solid zinc alloy buckle.",
    "price": 1299,
    "originalPrice": 1799,
    "discount": 27,
    "category": "Accessories",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&auto=format&fit=crop&q=80",
    "stock": 50,
    "rating": 4.6,
    "numReviews": 28
  },
  {
    "name": "Stylish Canvas Travel Duffle Bag",
    "description": "Heavy duty vintage canvas weekend duffle bag with separate shoe compartment and shoulder strap.",
    "price": 3499,
    "originalPrice": 4699,
    "discount": 25,
    "category": "Accessories",
    "brand": "AlpineGear",
    "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    "stock": 25,
    "rating": 4.8,
    "numReviews": 23
  },
  {
    "name": "Retro Round Polarized Sunglasses",
    "description": "Steampunk style metal frame round sunglasses with HD UV400 protective lenses.",
    "price": 1899,
    "originalPrice": 2499,
    "discount": 24,
    "category": "Accessories",
    "brand": "OpticStyle",
    "image": "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80",
    "stock": 40,
    "rating": 4.5,
    "numReviews": 30
  },
  {
    "name": "Silver Hoop Earrings Set of 3",
    "description": "Sterile 925 sterling silver plated chunky huggie hoop earrings set.",
    "price": 1199,
    "originalPrice": 1699,
    "discount": 29,
    "category": "Accessories",
    "brand": "BellaModa",
    "image": "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80",
    "stock": 45,
    "rating": 4.6,
    "numReviews": 22
  },
  {
    "name": "Tactical Key Organizer Clip",
    "description": "Compact aircraft aluminum key holder system preventing key jingle and pocket scratches.",
    "price": 699,
    "originalPrice": 999,
    "discount": 30,
    "category": "Accessories",
    "brand": "UrbanCraft",
    "image": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80",
    "stock": 75,
    "rating": 4.4,
    "numReviews": 18
  },
  {
    "name": "Casual Cotton Baseball Cap",
    "description": "Unisex 6-panel adjustable cotton dad hat with embroidered ventilation eyelets.",
    "price": 799,
    "originalPrice": 1099,
    "discount": 27,
    "category": "Accessories",
    "brand": "StreetWear",
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80",
    "stock": 60,
    "rating": 4.5,
    "numReviews": 25
  }
];

const importData = async (exitOnComplete = true) => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('[Seeder] Database cleared.');

    // 1. Create Admin User
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123',
      phone: '+1 800-555-0199',
      address: {
        fullName: 'Admin Headquarters',
        phone: '+1 800-555-0199',
        street: '100 Commerce Way, Suite 400',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
      },
      role: 'ADMIN',
    });

    // 2. Create Regular User
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@shopez.com',
      password: 'user123',
      phone: '+1 555-014-8899',
      address: {
        fullName: 'John Doe',
        phone: '+1 555-014-8899',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        pincode: '62704',
      },
      role: 'USER',
    });

    // 3. Create Vendor User
    const vendorUser = await User.create({
      name: 'TechGear Vendor',
      email: 'vendor@shopez.com',
      password: 'vendor123',
      phone: '+1 555-019-9988',
      address: {
        fullName: 'TechGear Official Store',
        phone: '+1 555-019-9988',
        street: '45 Tech Boulevard',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94105',
      },
      role: 'USER',
    });

    console.log(`[Seeder] Created Users: Admin (${adminUser.email}), Regular (${regularUser.email}), Vendor (${vendorUser.email}).`);

    // 4. Insert Products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`[Seeder] Inserted ${createdProducts.length} sample products across all categories.`);

    // 5. Create Cart for Regular User
    await Cart.create({
      user: regularUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[4]._id,
          quantity: 2,
          price: createdProducts[4].price,
        },
      ],
      totalPrice: createdProducts[0].price + (createdProducts[4].price * 2),
    });
    console.log('[Seeder] Created initial Cart collection entries.');

    // 6. Create Wishlist for Regular User
    await Wishlist.create({
      user: regularUser._id,
      products: [
        createdProducts[1]._id,
        createdProducts[7]._id,
        createdProducts[14]._id,
      ],
    });
    console.log('[Seeder] Created initial Wishlist collection entries.');

    // 7. Create Sample Reviews
    await Review.insertMany([
      {
        user: regularUser._id,
        product: createdProducts[0]._id,
        rating: 5,
        comment: 'Absolutely amazing headphones! Sound clarity and battery life exceeded my expectations.',
      },
      {
        user: regularUser._id,
        product: createdProducts[13]._id,
        rating: 5,
        comment: 'Brews coffee just like my favorite coffee shop. Extremely easy to clean and operate!',
      },
      {
        user: vendorUser._id,
        product: createdProducts[4]._id,
        rating: 4,
        comment: 'Solid tactile feel on key switches and great battery life.',
      },
    ]);
    console.log('[Seeder] Sample Reviews collection entries inserted.');

    // 8. Create Sample Orders (Covering multiple lifecycle statuses)
    await Order.create({
      user: regularUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].image,
          price: createdProducts[0].price,
          quantity: 1,
        },
        {
          product: createdProducts[23]._id,
          name: createdProducts[23].name,
          image: createdProducts[23].image,
          price: createdProducts[23].price,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: regularUser.address.fullName,
        phone: regularUser.address.phone,
        address: regularUser.address.street,
        city: regularUser.address.city,
        state: regularUser.address.state,
        pincode: regularUser.address.pincode,
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: createdProducts[0].price + createdProducts[23].price,
      shippingPrice: 0,
      totalPrice: createdProducts[0].price + createdProducts[23].price,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
    });

    await Order.create({
      user: regularUser._id,
      orderItems: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].image,
          price: createdProducts[1].price,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: regularUser.address.fullName,
        phone: regularUser.address.phone,
        address: regularUser.address.street,
        city: regularUser.address.city,
        state: regularUser.address.state,
        pincode: regularUser.address.pincode,
      },
      paymentMethod: 'Demo Online Payment',
      itemsPrice: createdProducts[1].price,
      shippingPrice: 0,
      totalPrice: createdProducts[1].price,
      orderStatus: 'Shipped',
      paymentStatus: 'Paid',
    });

    await Order.create({
      user: regularUser._id,
      orderItems: [
        {
          product: createdProducts[10]._id,
          name: createdProducts[10].name,
          image: createdProducts[10].image,
          price: createdProducts[10].price,
          quantity: 2,
        },
      ],
      shippingAddress: {
        fullName: regularUser.address.fullName,
        phone: regularUser.address.phone,
        address: regularUser.address.street,
        city: regularUser.address.city,
        state: regularUser.address.state,
        pincode: regularUser.address.pincode,
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: createdProducts[10].price * 2,
      shippingPrice: 0,
      totalPrice: createdProducts[10].price * 2,
      orderStatus: 'Processing',
      paymentStatus: 'Pending',
    });

    console.log('[Seeder] Created Orders collection entries spanning multiple statuses.');

    console.log('----------------------------------------------------');
    console.log('✅ ShopEZ Database Seeded Successfully Across All Collections!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('🔑 ADMIN  -> Email: admin@shopez.com  | Password: admin123');
    console.log('🔑 USER   -> Email: user@shopez.com   | Password: user123');
    console.log('🔑 VENDOR -> Email: vendor@shopez.com | Password: vendor123');
    console.log('----------------------------------------------------');

    if (exitOnComplete) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`❌ Error Seeding Data: ${error.message}`);
    if (exitOnComplete) {
      process.exit(1);
    }
  }
};

const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[AutoSeed] MongoDB connection not ready. Skipping auto-seed check.');
      return;
    }
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[AutoSeed] Empty database detected. Auto-seeding initial collections...');
      await importData(false);
    } else {
      console.log(`[AutoSeed] Database already contains ${productCount} products. Skipping auto-seed.`);
    }
  } catch (err) {
    console.error(`[AutoSeed] Check failed: ${err.message}`);
  }
};

if (require.main === module) {
  importData();
}

module.exports = { importData, autoSeedIfEmpty };

