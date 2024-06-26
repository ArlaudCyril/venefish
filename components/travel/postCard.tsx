// components/Postcard.tsx
const Postcard = ({ itinerary }: { itinerary: string }) => {
  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-2">Your Travel Itinerary</h2>
      <p className="whitespace-pre-line">{itinerary}</p>
    </div>
  );
};

export default Postcard;
