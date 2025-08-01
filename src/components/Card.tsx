export default function Card({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
    </div>
  );
}
