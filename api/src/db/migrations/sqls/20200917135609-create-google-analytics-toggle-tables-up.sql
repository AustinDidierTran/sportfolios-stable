CREATE TABLE ga_toggles_events
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category VARCHAR(255) UNIQUE NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ga_toggles_pageviews
(
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pathname VARCHAR(255) UNIQUE NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO ga_toggles_events
    (category, enabled)
VALUES
    ('Login', default);

INSERT INTO ga_toggles_pageviews
    (pathname, enabled)
VALUES
    ('/', default),
    ('/login', default),
    ('/userSettings', default);