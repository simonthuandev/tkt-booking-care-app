export default function SectionHeader({ tag, tagIcon: TagIcon, title, titleEm, sub }) {
  return (
    <div className="sec-header">
      <div className="sec-tag">
        {TagIcon}
        <span>{tag}</span>
      </div>
      <h2 className="sec-title">
        {title} <em>{titleEm}</em>
      </h2>
      {sub && <p className="sec-sub">{sub}</p>}
    </div>
  );
}