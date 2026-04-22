import RoutePage from "../../components/Common/RoutePage";
import "./AboutPage.scss";

const member = [
  {
    name: "Huỳnh Hoàng Khoa",
    id: "N23DCCN166",
    role: "FrontEnd Developer",
    img: "https://wewin.com.vn/wp-content/uploads/2022/12/toi-uu-about-us-tren-website-5.jpg",
    description: [
      "Khoa is our senior developer, bringing extensive experience in building scalable, high-performance applications across a variety of platforms. With a strong foundation in system design and modern development practices, he plays a key role in shaping the technical direction of our projects and ensuring long-term maintainability.",
      "Beyond his technical expertise, Khoa is also a dedicated mentor who actively supports and guides junior developers. He fosters a collaborative environment where knowledge is shared, code quality is prioritized, and continuous learning is encouraged. Whether he’s reviewing code, solving complex problems, or introducing best practices, Khoa consistently helps elevate both the team’s skills and the overall quality of our products.",
    ],
  },
  {
    name: "Nguyễn Đức Thuận",
    id: "N23DCCN196",
    role: "Leader",
    img: "https://wewin.com.vn/wp-content/uploads/2022/12/toi-uu-about-us-tren-website-5.jpg",
    description: [
      "Thuận is our senior developer with extensive experience in building scalable applications and mentoring junior team members.",
      "Thuận is our lead developer, the technical backbone behind everything we build. With a sharp eye for detail and a deep understanding of system architecture, he leads by example—turning complex ideas into clean, efficient, and scalable code. He’s not working alone, though. Supporting him is a dedicated team of engineers who handle the countless 0s and 1s that power Goodbudget behind the scenes. Together, they design, develop, and refine every feature, ensuring the app runs smoothly and reliably for users every day. From brainstorming new functionalities to debugging the smallest issues, Thuận and his team are constantly pushing the product forward, making Goodbudget not just functional, but intuitive and enjoyable to use.",
      "Behind him is a dedicated team of engineers who work tirelessly to build and refine the systems that power Goodbudget. Together, they write the countless lines of 0s and 1s that transform complex financial concepts into a simple, user-friendly platform. From optimizing performance to ensuring data security, the team plays a critical role in bringing Goodbudget to life and continuously improving it for users around the world.",
    ],
  },
  {
    name: "Phạm Minh Tuấn",
    id: "N23DCCN202",
    role: "FrontEnd Developer",
    img: "https://wewin.com.vn/wp-content/uploads/2022/12/toi-uu-about-us-tren-website-5.jpg",
    description: [
      "Tuấn specializes in crafting beautiful, intuitive user interfaces that elevate the overall user experience of our platform. With a keen eye for design and a deep understanding of user behavior, he ensures that every interaction feels smooth, natural, and engaging.",
      "He combines modern design principles with clean, efficient code to build interfaces that are not only visually appealing but also highly functional and responsive across different devices. Tuấn pays close attention to detail, from layout and color harmony to micro-interactions, making sure each element contributes to a cohesive and enjoyable experience. His work plays a crucial role in making our platform not just usable, but truly a joy to interact with.",
    ],
  },
];

const AboutPage = () => {
  return (
    <>
      <div className="history-about">
        <h2 className="history-title">Quá trình phát triển dự án</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-date">1/2026</h3>
              <p className="timeline-description">Khởi tạo dự án ban đầu</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-date">2/2026</h3>
              <p className="timeline-description">
                Phân tích thiết kế hệ thống
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-date">3/2026</h3>
              <p className="timeline-description">
                Viết bản kiểm thử cho dự án
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-date">4/2026</h3>
              <p className="timeline-description">
                Hoàn thành giao diện, chức năng của chương trình
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <h3 className="timeline-date">5/2026</h3>
              <p className="timeline-description">Hoàn thành dự án</p>
            </div>
          </div>
        </div>
      </div>
      <div className="body-about">
        <h1>Thành viên nhóm</h1>
        {member.map((item, index) => (
          <div key={index} className="member-card">
            <div className="member-header">
              <img src={item.img} alt={item.name} className="member-avatar" />
              <div className="member-info">
                <h2>{item.name}</h2>
                <p className="member-role">{item.id}</p>
                <p className="member-role"> {item.role}</p>
              </div>
            </div>
            <div className="member-description">
              {item.description.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AboutPage;
