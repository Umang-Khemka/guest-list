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

// GET responses populate familyId into an object.
// getTravels returns the first four fields; getTravelById returns the rest too.
export interface TravelFamily {
  _id: string;
  name: string;
  primaryContact: string;
  phone: string;
  city: string;
  address?: string;
  relationToGroom?: string;
  category?: string;
  group?: string;
  invitedCount?: number;
  confirmedCount?: number;
  status?: string;
  guestType?: string;
  priority?: string;
  notes?: string;
}


// Original shape, used by TravelCard, TravelFormModal and TravelPage
export interface Travel {
  _id: string;
  family: string; // Family._id
  arrival?: TravelLeg;
  departure?: TravelLeg;
}

// Populated: returned by GET /all-travels and GET /:id
export interface TravelPopulated {
  _id: string;
  familyId: TravelFamily;
  arrival?: ApiLeg;
  departure?: ApiLeg;
  createdAt: string;
  updatedAt: string;
}

// NOT populated: returned by create, update and GET /family/:familyId
export interface TravelRaw {
  _id: string;
  familyId: string;
  arrival?: ApiLeg;
  departure?: ApiLeg;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelInput {
  familyId: string;
  arrival?: ApiLeg;
  departure?: ApiLeg;
}

export type UpdateTravelInput = Partial<CreateTravelInput>;

export interface TravelResponse {
  success: boolean;
  data: TravelPopulated;
}

export interface TravelRawResponse {
  success: boolean;
  data: TravelRaw;
}

export interface TravelsResponse {
  success: boolean;
  count: number;
  data: TravelPopulated[];
}

export interface TravelState {
  travels: TravelPopulated[];
  travel: TravelPopulated | null;
  count: number;
  loading: boolean;
  error: string | null;

  createTravel: (input: CreateTravelInput) => Promise<TravelRaw>;
  getTravels: () => Promise<void>;
  getTravelById: (id: string) => Promise<void>;
  // returns null when the family has no travel details yet (a 404 is normal here)
  getTravelByFamilyId: (familyId: string) => Promise<TravelRaw | null>;
  updateTravel: (id: string, input: UpdateTravelInput) => Promise<TravelRaw>;
  deleteTravel: (id: string) => Promise<void>;
}

// What the backend stores and returns (matches travel.validator.ts)
export interface ApiLeg {
  date: string; // ISO string when returned, e.g. 2026-11-20T00:00:00.000Z
  time?: string;
  mode: TravelMode;
  number?: string;
  location?: string;
  from?: string; // arrival: coming from
  to?: string; // departure: going to
  pickupRequired?: boolean;
  dropRequired?: boolean;
}