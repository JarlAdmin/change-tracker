export interface Change {
  id: number;
  change_details: string;
  category: string;
  service: string;
  date: string;
  user_id: number;
  deleted_at?: string;
  screenshots: Array<{
    id: number | null;
    filepath: string | null;
  }>;
}
