import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "./config/mongodb.js";
import productModel from "./models/productModel.js";

async function seed() {
  try {
    await dbConnect();

    const sampleProducts = [
      {
        _type: "new_arrivals",
        name: "Classic Backpack",
        images: [
          "https://images.unsplash.com/photo-1514477917009-389c76a86b68?w=800&auto=format&fit=crop",
        ],
        price: 59.99,
        discountedPercentage: 10,
        stock: 50,
        soldQuantity: 0,
        category: "Bags",
        brand: "Orebi",
        badge: true,
        isAvailable: true,
        offer: false,
        description: "Durable and stylish backpack suitable for everyday use.",
        tags: ["bag", "backpack", "travel"],
      },
      {
        _type: "best_sellers",
        name: "Wireless Headphones",
        images: [
          "https://images.unsplash.com/photo-1518441312496-7f7af0fc5b0d?w=800&auto=format&fit=crop",
        ],
        price: 129.99,
        discountedPercentage: 15,
        stock: 100,
        soldQuantity: 25,
        category: "Electronics",
        brand: "Orebi",
        badge: false,
        isAvailable: true,
        offer: true,
        description: "Noise-cancelling wireless headphones with premium sound.",
        tags: ["audio", "wireless", "headphones"],
      },
      {
        _type: "offers",
        name: "Smart Watch",
        images: [
          "https://images.unsplash.com/photo-1518081461904-9accc8f9a48b?w=800&auto=format&fit=crop",
        ],
        price: 199.99,
        discountedPercentage: 20,
        stock: 75,
        soldQuantity: 10,
        category: "Wearables",
        brand: "Orebi",
        badge: false,
        isAvailable: true,
        offer: true,
        description: "Feature-rich smartwatch with health and fitness tracking.",
        tags: ["watch", "smart", "wearable"],
      },
    ];

    // Remove previous samples (by brand/name) to avoid duplicates
    await productModel.deleteMany({ brand: "Orebi", name: { $in: [
      "Classic Backpack",
      "Wireless Headphones",
      "Smart Watch",
    ]}});

    await productModel.insertMany(sampleProducts);
    console.log("Reseeded sample products with Unsplash images (3)");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
