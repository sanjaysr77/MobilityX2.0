import axios from 'axios';

export interface PlacePrediction {
  description: string;
  place_id: string;
}

export async function googlePlacesAutocomplete(input: string): Promise<PlacePrediction[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set');
  }

  const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
  const response = await axios.get(url, {
    params: {
      input,
      key,
    },
  });

  const preds = (response.data?.predictions || []) as Array<{ description: string; place_id: string }>; 
  return preds.map((p) => ({ description: p.description, place_id: p.place_id }));
}


