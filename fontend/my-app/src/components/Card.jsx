export default function Card({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}