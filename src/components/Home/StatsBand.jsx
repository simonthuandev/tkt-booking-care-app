import { Container } from "react-bootstrap";

const FALLBACK_STATS = [
  { num: "5,000", suffix: "+", label: "Bác sĩ chuyên khoa" },
  { num: "200", suffix: "+", label: "Bệnh viện & phòng khám" },
  { num: "3M", suffix: "+", label: "Lượt đặt lịch thành công" },
  { num: "63", suffix: "/63", label: "Tỉnh thành phủ sóng" },
];

const formatCompactNumber = (value) => {
  if (value === undefined || value === null) return null;
  if (value >= 1_000_000) {
    const compact = value / 1_000_000;
    return `${Number.isInteger(compact) ? compact : compact.toFixed(1)}M`;
  }
  return value.toLocaleString("vi-VN");
};

const buildStats = (stats) => {
  if (!stats) return FALLBACK_STATS;

  return [
    {
      num: formatCompactNumber(stats.doctors?.total) || FALLBACK_STATS[0].num,
      suffix: "+",
      label: "Bác sĩ chuyên khoa",
    },
    {
      num: formatCompactNumber(stats.hospitals?.total) || FALLBACK_STATS[1].num,
      suffix: "+",
      label: "Bệnh viện & phòng khám",
    },
    {
      num: formatCompactNumber(stats.appointments?.total) || FALLBACK_STATS[2].num,
      suffix: "+",
      label: "Lượt đặt lịch thành công",
    },
    {
      num: formatCompactNumber(stats.cities?.total) || FALLBACK_STATS[3].num,
      suffix: "/34",
      label: "Tỉnh thành phủ sóng",
    },
  ];
};

export default function StatsBand({ stats }) {
  const displayStats = buildStats(stats);

  return (
    <section className="stats-band">
      <Container>
        <div className="row g-0 stats-row">
          {displayStats.map(({ num, suffix, label }) => (
            <div key={label} className="col-6 col-md-3 stat-item">
              <div className="stat-num">
                {num}
                <span>{suffix}</span>
              </div>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
