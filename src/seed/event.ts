export type InitialEvent = {
  name: string;
  slug: string;
  category: string;
  description: string;
  rules?: string[];
  teamSize?: { min: number; max: number };
  registrationOpen?: boolean;
  status?: "draft" | "published" | "archived";
  displayOrder?: number;
};

export const initialEvents: InitialEvent[] = [
  // Add finalized symposium events here
];
