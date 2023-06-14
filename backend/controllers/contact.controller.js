const Contact = require("../models/ContactModal");

const postMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    if (!firstName || !lastName)
      return res.status(400).json({ message: "Name can't be empty" });
    if (!email)
      return res.status(400).json({ message: "Email can't be empty" });
    if (!message)
      return res.status(400).json({ message: "Message can't be empty" });
    await Contact.create({ firstName, lastName, email, message });
    res.status(201).json({ message: "Message envoyé avec success" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { postMessage, getMessages };
