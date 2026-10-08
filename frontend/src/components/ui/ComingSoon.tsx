export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="page">
      <h1 className="page__title">{title}</h1>
      <p className="page__sub">This page is coming in a later step.</p>
    </div>
  );
}