import Order from '../models/orderModel.js';

export const getOrderStats = async (req, res) => {
  try {
    // Thống kê theo trạng thái
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$isPaid', true] }, '$totalPrice', 0]
            }
          }
        }
      }
    ]);

    // Doanh thu theo tháng trong năm nay
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          paidAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$paidAt' },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Tổng quan
    const overview = await Order.aggregate([
      {
        $facet: {
          'totalRevenue': [
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
          ],
          'totalOrders': [
            { $group: { _id: null, count: { $sum: 1 } } }
          ],
          'averageOrderValue': [
            { $match: { isPaid: true } },
            { $group: { _id: null, avg: { $avg: '$totalPrice' } } }
          ],
          'recentOrders': [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                totalPrice: 1,
                status: 1,
                isPaid: 1,
                createdAt: 1
              }
            }
          ]
        }
      }
    ]);

    // Top sản phẩm bán chạy
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          name: { $first: '$orderItems.name' },
          totalQuantity: { $sum: '$orderItems.quantity' },
          totalRevenue: {
            $sum: {
              $multiply: ['$orderItems.price', '$orderItems.quantity']
            }
          }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      statusStats,
      monthlyRevenue,
      overview: overview[0],
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};