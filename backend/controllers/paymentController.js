// Payment Controller - Shipping calculation only

export const calculateShipping = async (req, res) => {
  try {
    const { address, items } = req.body;

    // Tính phí vận chuyển dựa trên địa chỉ và danh sách sản phẩm
    let shippingFee = 30000; // Phí cơ bản

    // Tính tổng khối lượng
    const totalWeight = items.reduce((acc, item) => {
      return acc + (item.weight || 0) * item.quantity;
    }, 0);

    // Phí theo khối lượng
    if (totalWeight > 1) {
      shippingFee += (totalWeight - 1) * 10000;
    }

    // Phụ phí theo khu vực
    const region = address.city.toLowerCase();
    if (['hà nội', 'ho chi minh', 'hồ chí minh'].includes(region)) {
      shippingFee += 0;
    } else if (['đà nẵng', 'hải phòng', 'cần thơ'].includes(region)) {
      shippingFee += 10000;
    } else {
      shippingFee += 20000;
    }

    res.json({ shippingFee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};