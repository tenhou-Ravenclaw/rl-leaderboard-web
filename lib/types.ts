export type EvalResult = {
  timestamp: string
  user: string
  model: string
  env: string
  episodes: number
  mean_reward: number
  max_reward: number
  min_reward: number
  std_reward: number
  completion_rate: number
  mean_episode_length: number
  mean_distance: number
  mean_runtime_sec: number
}

export type LeaderboardEntry = EvalResult & { rank: number }
