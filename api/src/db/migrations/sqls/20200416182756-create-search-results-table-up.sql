/* Replace with your SQL commands */
CREATE TABLE previous_search_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  search_query VARCHAR(320) NOT NULL,
  created_at timestamp DEFAULT now()
);