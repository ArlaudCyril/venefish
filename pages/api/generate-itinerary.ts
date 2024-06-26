import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  itinerary?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    const { destination, preferences, duration, dates, budget, constraints } = req.body;

    if (!destination) {
      res.status(400).json({ error: 'Destination is required' });
      return;
    }

    const prompt = `
      You are an expert travel planner who specializes in creating customized travel itineraries in the style of postcards. 
      Your task is to generate a detailed and personalized travel itinerary for a trip to a specified destination. 
      Each itinerary should include a mix of popular tourist attractions, local hidden gems, cultural experiences, 
      and dining recommendations, all described in a warm, engaging, simple, modern, and family-friendly postcard-like style. 
      The itinerary should have a clear structure, mentioning the duration at each place and offering tips or interesting facts where applicable. 
      Additionally, include budget considerations and any other specific constraints provided by the user.

      Destination: ${destination}
      Travel Preferences: ${preferences || 'N/A'}
      Duration of Stay: ${duration || 'N/A'}
      Travel Dates: ${dates || 'N/A'}
      Budget: ${budget || 'N/A'}
      Constraints: ${constraints || 'N/A'}
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: 'You are a travel assistant.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        res.status(response.status).json({ error: errorData.error.message });
        return;
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const itinerary = data.choices[0].message.content.trim();
        res.status(200).json({ itinerary });
      } else {
        res.status(500).json({ error: 'No choices returned from OpenAI' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
