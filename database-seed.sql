CREATE TABLE USERS (
  id serial PRIMARY KEY,
  name varchar(200) NOT NULL,
  created_at timestamp without time zone DEFAULT NOW(),
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PRODUCTS (
  id serial PRIMARY KEY,
  name varchar(500) NOT NULL,
  price integer NOT NULL,
  created_at timestamp without time zone DEFAULT NOW(),
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PRODUCTS_TRANSACTION (
  id serial PRIMARY KEY,
  id_user serial NOT NULL,
  -- https://stackoverflow.com/questions/41054507/postgresql-array-of-elements-that-each-are-a-foreign-key
  id_product INT[],
  price integer NOT NULL,
  status boolean,
  created_at timestamp without time zone DEFAULT NOW(),
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user) REFERENCES USERS(id)
);

-- INDEX
CREATE INDEX IDX_user_name ON USERS (name);
CREATE INDEX IDX_prod_name ON PRODUCTS (name);
CREATE INDEX IDX_prod_trans_price ON PRODUCTS_TRANSACTION (price);

-- INSERT FAKE DATA
-- USERS
INSERT INTO USERS(name) VALUES(N'Nguyễn');
INSERT INTO USERS(name) VALUES(N'Tiến');
INSERT INTO USERS(name) VALUES(N'Dũng');

-- PRODUCTS
INSERT INTO PRODUCTS(name, price) VALUES(N'Quần chíp hồng', 500000);
INSERT INTO PRODUCTS(name, price) VALUES(N'Áo bra đen', 500000);