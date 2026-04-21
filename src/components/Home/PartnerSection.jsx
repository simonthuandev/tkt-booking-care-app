import { Container } from "react-bootstrap";
import { Link } from "react-router";

const PARTNERS = ['BV Chợ Rẫy', 'Vinmec', 'BV Bạch Mai', 'Medlatec', 'BV Nhi Đồng', 'Thu Cúc Clinic', 'BV 108'];

export default function PartnerSection() {
  return (
    <section className="partner-section">
      <Container>
        <div className="partner-label">Đối tác y tế tin cậy</div>
        <div className="partner-logos">
          {PARTNERS.map((p) => (
            <Link to={"/contact"} key={p} className="plg">
              {p}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
