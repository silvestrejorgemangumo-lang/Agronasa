CREATE TABLE IF NOT EXISTS crops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  family VARCHAR(50) NOT NULL,
  water_need INTEGER NOT NULL CHECK (water_need BETWEEN 1 AND 5),
  drought_tolerance INTEGER NOT NULL CHECK (drought_tolerance BETWEEN 1 AND 5),
  fixes_nitrogen BOOLEAN NOT NULL DEFAULT FALSE,
  cycle_days INTEGER NOT NULL CHECK (cycle_days > 0),
  preferred_soils VARCHAR(160) NOT NULL
);
