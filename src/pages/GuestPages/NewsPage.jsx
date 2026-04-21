import { useState } from "react";
import RoutePage from "../../components/Common/RoutePage";
import "./NewsPage.scss";
import { Link, Links } from "react-router";

const news = [
  {
    id: 1,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "7 bác sĩ Cột sống giỏi và nhiều kinh nghiệm tại Hà Nội",
    description:
      "Dưới đây là danh sách Bác sĩ khám chữa Cột sống giỏi, nhiều kinh nghiệm để người bệnh lựa chọn phù hợp. Chi tiết từng bác sĩ BookingCare chia sẻ thông tin về trình độ chuyên môn, địa chỉ, lịch khám, cách đặt khám trước để hạn chế thời gian chờ đợi...",
    category: "Cột sống",
  },
  {
    id: 2,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "Bơm xi măng sinh học cột sống giá bao nhiêu? Chi phí tại 5 địa chỉ uy tín TP.HCM",
    description:
      "Chi phí bơm xi măng sinh học cột sống có thể dao động từ hàng chục cho đến hàng trăm triệu đồng. Người bệnh cần tìm hiểu kỹ trước khi thực hiện để quyết định thực hiện...",
    category: "Cột sống",
  },
  {
    id: 3,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "Top 6 địa chỉ bơm xi măng cột sống uy tín hàng đầu tại Hà Nội",
    description:
      "Bơm xi măng cột sống cần được thực hiện tại các bệnh viện uy tín, có bác sĩ giỏi. Dưới đây sẽ là gợi ý về 6 địa chỉ bơm xi măng cột sống uy tín hàng đầu tại Hà Nội mà có thể bạn chưa biết...",
    category: "Cột sống",
  },
  {
    id: 4,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "Bơm xi măng cột sống ở đâu uy tín TP.HCM?",
    description:
      "Bơm xi măng cột sống ở đâu uy tín TP.HCM? Chung BookingCare hướng dẫn quá trình và những điều cần biết trước khi tiến hành quyết định...",
    category: "Cột sống",
  },
  {
    id: 5,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "Phòng ngừa và điều trị viêm mũi dị ứng cho bà bầu",
    description:
      "Bệnh viêm mũi dị ứng rất phổ biến ở bà bầu, có thể ảnh hưởng đến sức khỏe mẹ và thai nhi. Bài viết này sẽ giúp bạn hiểu rõ hơn về bệnh và cách phòng ngừa...",
    category: "Tai mũi họng",
  },
  {
    id: 6,
    img: "https://cdn.bookingcare.vn/fo/w640/2024/08/24/083641-bac-si-dieu-tri-viem-xoang-gioi-ha-noi.png",
    text: "Bệnh viêm mũi xuất tiết ở trẻ em và những điều cần biết",
    description:
      "Viêm mũi xuất tiết là bệnh lý thường gặp ở trẻ em, gây khó chịu và ảnh hưởng đến sinh hoạt hàng ngày. Cùng tìm hiểu về nguyên nhân, triệu chứng và cách điều trị bệnh này...",
    category: "Tai mũi họng",
  },
];

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");

  const categories = [
    "Tất cả",
    ...new Set(news.map((article) => article.category)),
  ];

  const filteredNews = news.filter((article) => {
    const categoryMatch =
      selectedCategory === "Tất cả" || article.category === selectedCategory;
    const textMatch = article.text
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return categoryMatch && textMatch;
  });

  return (
    <div className="news">
      {/* Filter Section */}
      <div className="news-filter-section">
        <h1 className="hospitals-title text-center">Trang tin tức</h1>
        <p className="hospitals-subtitle text-center mb-5">
          Các bài báo y học hiện đại, cập nhật nội dung y học hiện nay.
        </p>
        <div className="search-and-filter">
          <div className="search-group">
            <input
              id="search-name"
              type="text"
              className="search-input"
              placeholder="Từ khoá tìm kiếm"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <select
            id="category-select"
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr />

      {/* News List */}
      <div className="news-list">
        {filteredNews.length > 0 ? (
          filteredNews.map((article) => (
            <Link to={`/news/${article.id}`}>
              <div key={article.id} className="news-item">
                <div className="news-item-image">
                  <img src={article.img} alt={article.text} />
                </div>
                <div className="news-item-content">
                  <div className="news-item-header">
                    <span className="news-category">{article.category}</span>
                  </div>
                  <h3 className="news-item-title">{article.text}</h3>
                  <p className="news-item-description">{article.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results">Không tìm thấy bài viết nào</p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
