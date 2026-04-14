import { Container } from "react-bootstrap";

const stats = [
  { num: '5,000', suffix: '+',   label: 'Bác sĩ chuyên khoa'       },
  { num: '200',   suffix: '+',   label: 'Bệnh viện & phòng khám'   },
  { num: '3M',    suffix: '+',   label: 'Lượt đặt lịch thành công' },
  { num: '63',    suffix: '/63', label: 'Tỉnh thành phủ sóng'      },
];

export default function StatsBand() {
  return (
    <section className="stats-band">
      <Container>
        <div className="row g-0 stats-row">
          {stats.map(({ num, suffix, label }) => (
            <div key={label} className="col-6 col-md-3 stat-item">
              <div className="stat-num">{num}<span>{suffix}</span></div>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}