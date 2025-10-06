// paymentController.js (Stripe removed)
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Create order (Cash on Delivery or other non-Stripe methods)
export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod = "cod" } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Order items are required" });
    }

    if (!address) {
      return res.json({
        success: false,
        message: "Delivery address is required",
      });
    }

    // Validate address required fields
    const requiredAddressFields = [
      "firstName",
      "lastName",
      "email",
      "street",
      "city",
      "state",
      "zipcode",
      "country",
      "phone",
    ];

    const missingFields = requiredAddressFields.filter((field) => {
      const value =
        address[field] || address[field === "zipcode" ? "zipCode" : field];
      return !value || value.trim() === "";
    });

    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: `Missing required address fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate items have productId
    const itemsWithoutProductId = items.filter(
      (item) => !item._id && !item.productId
    );
    if (itemsWithoutProductId.length > 0) {
      return res.json({
        success: false,
        message: "All items must have a valid product ID",
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create order
    const order = new orderModel({
      userId,
      items: items.map((item) => ({
        productId: item._id || item.productId,
        name: item.name || item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image,
      })),
      amount: totalAmount,
      address: {
        firstName: address.firstName || address.name?.split(" ")[0] || "",
        lastName:
          address.lastName || address.name?.split(" ").slice(1).join(" ") || "",
        email: address.email || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipcode: address.zipcode || address.zipCode || "",
        country: address.country || "",
        phone: address.phone || "",
      },
      paymentMethod,
      paymentStatus: "pending", // default for COD or manual payments
      status: "pending",
    });

    await order.save();

    // Add order to user's orders array
    await userModel.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
    });

    res.json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
      order: order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.json({ success: false, message: error.message });
  }
};
