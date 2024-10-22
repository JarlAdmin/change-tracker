export interface Change {
  id: number;
  change_details: string;
  date: string;
  category: string;
  service: string;
  username: string;
  screenshots: Array<{ id: number, filepath: string }>;
}
