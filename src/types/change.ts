export interface Change {
  id: number;
  change_details: string;
  date: string;
  category: string;
  service: string;
  user_id: number;
  screenshots: Array<{ id: number, filepath: string }>;
}
