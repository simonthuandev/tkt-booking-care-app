const RoutePage = ({ title, description }) => {
  return (
    <section className="container py-5">
      <h1 className="mb-3">{title}</h1>
      <p className="text-muted mb-0">
        {description || "This page is part of the Booking Care route architecture."}
      </p>
    </section>
  );
};

export default RoutePage;