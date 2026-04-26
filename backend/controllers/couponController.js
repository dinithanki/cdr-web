import Coupon from "../models/coupon.js";

// 🟢 CREATE coupon (admin)
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Error creating coupon" });
  }
};

// 🟢 GET all coupons (admin)
export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

// 🟡 VALIDATE coupon (checkout use)
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon" });
    }

    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: "Minimum order not met",
      });
    }

    let discount = 0;

    if (coupon.discountType === "PERCENT") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      discount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Error validating coupon" });
  }
};
