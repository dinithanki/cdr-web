import Contact from "../models/Contact.js";

// 🟢 USER - Create contact ticket (LOGIN REQUIRED)
export const createContact = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const contact = await Contact.create({
      userId: req.user._id,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 👤 USER - Get my tickets
export const getMyContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔴 ADMIN - Get all tickets
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 ADMIN - Update status
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("userId", "firstName lastName email");

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated",
      contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ ADMIN - Delete contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
