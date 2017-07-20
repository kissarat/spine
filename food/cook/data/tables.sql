CREATE TABLE food (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  type          TEXT,
  measure       TEXT,
  energy        DOUBLE  NOT NULL       DEFAULT 0,
  proteins      DOUBLE  NOT NULL       DEFAULT 0,
  lipids        DOUBLE  NOT NULL       DEFAULT 0,
  сarbohydrates DOUBLE  NOT NULL       DEFAULT 0
);

CREATE TABLE dish (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
);

CREATE TABLE component (
  parent INT REFERENCES dish (id) NOT NULL,
  child  INT REFERENCES dish (id) NOT NULL
);

CREATE TABLE item (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  dish   INT REFERENCES dish (id) NOT NULL,
  food   INT REFERENCES food (id) NOT NULL,
  amount INT                      NOT NULL
);

CREATE TABLE utensil (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
);

CREATE TABLE action (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
);

CREATE TABLE inventory (
  action  INT REFERENCES action (id)  NOT NULL,
  utensil INT REFERENCES utensil (id) NOT NULL
);

CREATE TABLE recipe (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  dish      INT REFERENCES dish (id)   NOT NULL,
  number    INT                        NOT NULL,
  action    INT REFERENCES action (id) NOT NULL,
  item      INT REFERENCES item (id),
  component INT REFERENCES component (id)
);
