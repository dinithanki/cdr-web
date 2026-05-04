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

// 🟡 GET active coupons (public)
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const activeCoupons = await Coupon.find({
      isActive: true,
      $or: [{ expiryDate: { $gte: now } }, { expiryDate: null }],
    }).select(
      "code discountType discountValue minOrderAmount expiryDate usageLimit usageCount description",
    );

    res.json(activeCoupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons" });
  }
};

// � UPDATE coupon (admin)
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon" });
  }
};

// �🟡 VALIDATE coupon (checkout use)
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

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
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

    // Increment usage count
    coupon.usageCount += 1;
    await coupon.save();

    res.json({
      discount,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Error validating coupon" });
  }
};
