import {Container} from 'react-bootstrap';
import SectionHeader from "../Common/SectionHeader";
import { BsGrid3X3GapFill } from "react-icons/bs";
import DynamicIcon from '../Icons/DynamicIcon';
import { Link } from "react-router-dom";
import { toSlug } from '../../utils/helpers';

const SPECIALTIES = [
  { icon: 'faHeart', name: 'Tim mạch',    count: '142 bác sĩ', bg: '#E8F4FD', color: '#2196F3' },
  { icon: 'faEye',         name: 'Mắt',         count: '98 bác sĩ',  bg: '#FFF3E0', color: '#FF9800' },
  { icon: 'faLungs',       name: 'Nội tổng quát',count:'210 bác sĩ', bg: '#E8F5E9', color: '#4CAF50' },
  { icon: 'faBaby',        name: 'Nhi khoa',    count: '185 bác sĩ', bg: '#F3E5F5', color: '#9C27B0' },
  { icon: 'faBandage',     name: 'Da liễu',     count: '120 bác sĩ', bg: '#FCE4EC', color: '#E91E63' },
  { icon: 'faCapsules',     name: 'Nha khoa',    count: '95 bác sĩ',  bg: '#E3F2FD', color: '#1565C0' },
  { icon: 'faBrain',            name: 'Thần kinh',   count: '88 bác sĩ',  bg: '#E8EAF6', color: '#3F51B5' },
  { icon: 'faBorderAll',        name: 'Xem tất cả',  count: '40+ chuyên khoa', bg: '#F5F5F5', color: '#607D8B', more: true },
];

export default function SpecialtiesSection() {

  return (
    <section className="section-pad" id="specialties">
      <Container>
        <SectionHeader
          tag="Chuyên khoa" tagIcon={<BsGrid3X3GapFill />}
          title="Đặt khám theo" titleEm="chuyên khoa"
          sub="Chọn đúng chuyên khoa – gặp đúng bác sĩ – nhận đúng kết quả"
        />
        <div className="row g-3 g-md-4 specialty-grid">
          {SPECIALTIES.map(({ icon, name, count, bg, color, more }) => (
            <div key={name} className="col-6 col-md-4 col-lg-3">
              <Link
                to={more ? "/specialties" : `/specialties/${toSlug(name)}`}
                className={`sp-card${more ? ' sp-card-more' : ''}`}
              >
                <div
                  className="sp-icon"
                  style={{ '--ic': bg, '--icc': color }}
                >
                  <DynamicIcon name={`${icon}`} />
                </div>
                <div className="sp-name">{name}</div>
                <div className="sp-count">{count}</div>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}