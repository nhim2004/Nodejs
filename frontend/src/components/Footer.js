import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= PHẦN TRÊN: HEADER FOOTER ================= */}
        <div className="py-10 text-center border-b border-gray  border-gray-700">
          <h2 className="text-3xl font-bold text-red-600 mb-2">LaptopShop</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Chuyên cung cấp <span className="text-red-400 font-medium">laptop, PC, linh kiện chính hãng</span>. 
            Giá tốt nhất – Bảo hành 36 tháng – Giao hàng miễn phí toàn toàn quốc.
          </p>

          {/* ICON MẠNG XÃ HỘI – DÙNG BUTTON + STYLE NHƯ LINK */}
          
        </div>

        {/* ================= PHẦN DƯỚI: 3 CỘT ================= */}
        <div className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* CỘT 1: DANH MỤC */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-red-500 border-b border-red-600 inline-block pb-1">
                Danh mục
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/category/laptop-van-phong" className="hover:text-white transition duration-200">Laptop văn phòng</a></li>
                <li><a href="/category/laptop-gaming" className="hover:text-white transition duration-200">Laptop Gaming</a></li>
                <li><a href="/category/may-tinh-ban" className="hover:text-white transition duration-200">Máy tính bàn</a></li>
                <li><a href="/category/pc-workstation" className="hover:text-white transition duration-200">PC Workstation</a></li>
                <li><a href="/category/linh-kien" className="hover:text-white transition duration-200">Linh kiện PC</a></li>
                <li><a href="/category/phu-kien" className="hover:text-white transition duration-200">Phụ kiện & Gaming Gear</a></li>
              </ul>
            </div>

            {/* CỘT 2: HỖ TRỢ */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-red-500 border-b border-red-600 inline-block pb-1">
                Hỗ trợ
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/support/huong-dan-mua-hang" className="hover:text-white transition duration-200">Hướng dẫn mua hàng</a></li>
                <li><a href="/support/bao-hanh" className="hover:text-white transition duration-200">Chính sách bảo hành</a></li>
                <li><a href="/support/doi-tra" className="hover:text-white transition duration-200">Chính sách đổi trả</a></li>
                <li><a href="/support/giao-hang" className="hover:text-white transition duration-200">Giao hàng & Thanh toán</a></li>
                <li><a href="/support/faq" className="hover:text-white transition duration-200">Câu hỏi thường gặp</a></li>
              </ul>
            </div>

            {/* CỘT 3: LIÊN HỆ */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-red-500 border-b border-red-600 inline-block pb-1">
                Liên hệ
              </h3>
              <div className="space-y-3 text-sm text-gray-400">
                <p className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-red-500 w-5"></i>
                  123 Đường Láng, Đống Đa, Hà Nội
                </p>
                <p className="flex items-center">
                  <i className="fas fa-phone-alt mr-2 text-red-500 w-5"></i>
                  <a href="tel:0961506888" className="hover:text-white transition duration-200">096.150.6888</a>
                </p>
                <p className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-red-500 w-5"></i>
                  <a href="mailto:support@laptopshop.com" className="hover:text-white transition duration-200">support@laptopshop.com</a>
                </p>
                <p className="flex items-center">
                  <i className="fas fa-clock mr-2 text-red-500 w-5"></i>
                  8:00 - 22:00 (Tất cả các ngày)
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= DÒNG CUỐI ================= */}
        <div className="border-t border-gray-700 py-5 text-center text-xs text-gray-500">
          <p>
            © 2025 <span className="text-red-500 font-bold">LaptopShop</span>. 
            Tất cả quyền được bảo lưu. 
            <span className="mx-2">|</span> 
            Phát triển bởi <span className="text-red-500 font-bold">Nguyễn Văn A</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;