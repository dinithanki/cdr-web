import Settings from "../models/Settings.js";

// 🟢 GET settings (used in checkout page)
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // if not exists → create default
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings" });
  }
};

// 🟡 UPDATE settings (ADMIN ONLY)
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Error updating settings" });
  }
};
