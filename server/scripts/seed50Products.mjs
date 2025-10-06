import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../config/mongodb.js";
import productModel from "../models/productModel.js";

// A pool of reliable Unsplash images for diverse product categories
const IMAGE_POOLS = {
  Bags: [
    "https://images.unsplash.com/photo-1514477917009-389c76a86b68?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599948066528-7f8957e8e9fd?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&auto=format&fit=crop",
  ],
  Electronics: [
    "https://images.unsplash.com/photo-1518441312496-7f7af0fc5b0d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
  ],
  Wearables: [
    "https://images.unsplash.com/photo-1518081461904-9accc8f9a48b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509043759401-136742328bb3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop",
  ],
  Furniture: [
    "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&auto=format&fit=crop",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1520974735194-9ce192a0bf2d?w=800&auto=format&fit=crop",
  ],
};

const BRANDS = ["Orebi", "Axiom", "Nova", "Zenon", "Luma", "Vast" ];
const CATEGORIES = Object.keys(IMAGE_POOLS);

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeProduct(index) {
  const category = randomFrom(CATEGORIES);
  const brand = randomFrom(BRANDS);
  const image = randomFrom(IMAGE_POOLS[category]);
  const basePrice = 19 + Math.floor(Math.random() * 481); // 19 - 499
  const discount = [0, 5, 10, 15, 20][Math.floor(Math.random() * 5)];
  const stock = 5 + Math.floor(Math.random() * 60);
  const types = ["new_arrivals", "best_sellers", "offers", ""];

  return {
    _type: randomFrom(types),
    name: `${brand} ${category} ${index + 1}`,
    images: [image],
    price: basePrice,
    discountedPercentage: discount,
    stock,
    soldQuantity: 0,
    category,
    brand,
    badge: Math.random() < 0.2,
    isAvailable: true,
    offer: discount >= 15,
    description: `High-quality ${category.toLowerCase()} by ${brand}.` ,
    tags: [brand.toLowerCase(), category.toLowerCase()],
  };
}

async function run() {
  try {
    await dbConnect();

    // Optional: remove previous auto-generated batch for idempotency
    await productModel.deleteMany({ brand: { $in: BRANDS } });

    const products = Array.from({ length: 50 }, (_, i) => makeProduct(i));
    await productModel.insertMany(products);
    console.log("Inserted 50 products with real image URLs");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seeding 50 products failed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

run();


