'use client';

import { useState } from 'react';
import TravelForm from '@/components/travel/travelForm';
import Postcard from '@/components/travel/postCard';

const Home = () => {
  const [itinerary, setItinerary] = useState('');
  const [error, setError] = useState('');

  const generateItinerary = async (destination: string, preferences: string, duration: string, dates: string, budget: string, constraints: string) => {
    setError('');
    setItinerary('');

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, preferences, duration, dates, budget, constraints }),
      });

      const data = await response.json();

      if (response.ok) {
        setItinerary(data.itinerary);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-2">
      <TravelForm onGenerate={generateItinerary} />
      {error && <p className="text-red-500">{error}</p>}
      {itinerary && <Postcard itinerary={itinerary} />}
    </div>
  );
};

export default Home;
