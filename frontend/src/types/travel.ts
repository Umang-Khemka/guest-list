export type TravelMode = "flight" | "train" | "car" | "bus" | "other";

// One journey (arrival or departure)
export interface TravelLeg {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  mode: TravelMode;
  number?: string; // flight / train number
  location: string; // airport, station or hotel
  city?: string; // arrival: coming from, departure: going to
  carRequired: boolean; // pickup (arrival) or drop (departure)
}

// One record per family
export interface Travel {
  _id: string;
  family: string; // Family._id
  arrival?: TravelLeg;
  departure?: TravelLeg;
}