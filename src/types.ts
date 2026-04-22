export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
}

export type AppState = {
  points: number;
  tasks: Task[];
  rewards: Reward[];
};
