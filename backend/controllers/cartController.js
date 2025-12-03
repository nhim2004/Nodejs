import Cart from '../models/cartModel.js';

// Get current user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [], total: 0 });
    const total = cart.items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);
    res.json({ items: cart.items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Replace entire cart (used after merge)
export const setCart = async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items });
    } else {
      cart.items = items;
      cart.updatedAt = Date.now();
    }
    await cart.save();
    const total = cart.items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);
    res.json({ items: cart.items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add or update a single item
export const upsertItem = async (req, res) => {
  try {
    const { product, name, image, price, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const idx = cart.items.findIndex(i => i.product.toString() === product);
    if (idx > -1) {
      cart.items[idx].quantity = quantity;
      cart.items[idx].price = price;
    } else {
      cart.items.push({ product, name, image, price, quantity });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    const total = cart.items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);
    res.json({ items: cart.items, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
