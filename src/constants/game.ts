/**
 * Snake Game Configuration
 * Contains all settings for the snake game feature
 */

export const SNAKE_CONFIG = {
  PERCENTAGE_WIDTH: 50,
  START_SNAKE_SIZE: 4,
  APPLE_COLOR: "red",
  SNAKE_COLOR: "green",
  GRID_SIZE: 20,
  INITIAL_SPEED: 67,
  MIN_SPEED: 25,
  SPEED_DECREASE: 0.5,
  HIGH_SCORE_KEY: "snakeHighScore",
} as const;
