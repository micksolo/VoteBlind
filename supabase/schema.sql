-- VoteBlind Database Schema
-- Designed for Australian Federal Elections with extensibility for state elections

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jurisdictions (Federal, State, Local)
CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('federal', 'state', 'local')),
  country TEXT NOT NULL DEFAULT 'Australia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Elections
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  name TEXT NOT NULL,
  election_date DATE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_elections_active ON elections(is_active) WHERE is_active = true;

-- Electorates (Divisions/Seats)
CREATE TABLE electorates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lower', 'upper')),
  aec_id TEXT, -- AEC's internal ID for linking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_electorates_election ON electorates(election_id);
CREATE INDEX idx_electorates_state ON electorates(state);

-- Postcode to Electorate mapping (pre-processed from AEC GIS data)
CREATE TABLE postcode_electorates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  postcode TEXT NOT NULL,
  electorate_id UUID NOT NULL REFERENCES electorates(id),
  confidence DECIMAL(3,2) NOT NULL DEFAULT 1.0, -- 0.00 to 1.00
  suburbs TEXT[], -- List of suburbs in this postcode that map to this electorate
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_postcode_lookup ON postcode_electorates(postcode);

-- Political Parties
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#666666',
  logo_url TEXT,
  coalition_group_id UUID REFERENCES parties(id), -- For Liberal/National coalition relationship
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  electorate_id UUID NOT NULL REFERENCES electorates(id),
  party_id UUID REFERENCES parties(id), -- NULL for independents
  name TEXT NOT NULL,
  incumbent BOOLEAN DEFAULT false,
  ballot_position INTEGER,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_candidates_electorate ON candidates(electorate_id);
CREATE INDEX idx_candidates_party ON candidates(party_id);

-- Policy Areas (Economy, Environment, Healthcare, etc.)
CREATE TABLE policy_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID NOT NULL REFERENCES elections(id),
  policy_area_id UUID NOT NULL REFERENCES policy_areas(id),
  text TEXT NOT NULL,
  description TEXT, -- Additional context for the question
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questions_election ON questions(election_id);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;

-- Party Positions on Questions
CREATE TABLE party_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  party_id UUID NOT NULL REFERENCES parties(id),
  question_id UUID NOT NULL REFERENCES questions(id),
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 5), -- 1=Strongly Disagree, 5=Strongly Agree
  confidence TEXT NOT NULL CHECK (confidence IN ('explicit', 'inferred', 'estimated', 'unknown')),
  source_url TEXT,
  source_description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(party_id, question_id)
);

CREATE INDEX idx_party_policies_party ON party_policies(party_id);
CREATE INDEX idx_party_policies_question ON party_policies(question_id);

-- Row Level Security Policies
-- All tables are public read, admin-only write

ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE electorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE postcode_electorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_policies ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON jurisdictions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON elections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON electorates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON postcode_electorates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON parties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON candidates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON policy_areas FOR SELECT USING (true);
CREATE POLICY "Public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON party_policies FOR SELECT USING (true);

-- Useful Views

-- Active election questions with policy area info
CREATE VIEW active_questions AS
SELECT
  q.id,
  q.election_id,
  q.text,
  q.description,
  q.display_order,
  pa.id AS policy_area_id,
  pa.name AS policy_area_name,
  pa.icon AS policy_area_icon
FROM questions q
JOIN policy_areas pa ON q.policy_area_id = pa.id
JOIN elections e ON q.election_id = e.id
WHERE q.is_active = true AND e.is_active = true
ORDER BY q.display_order;

-- Party positions with question context
CREATE VIEW party_positions AS
SELECT
  pp.party_id,
  p.name AS party_name,
  p.short_name AS party_short_name,
  p.color AS party_color,
  pp.question_id,
  q.text AS question_text,
  pp.position,
  pp.confidence,
  pp.source_url,
  pp.source_description
FROM party_policies pp
JOIN parties p ON pp.party_id = p.id
JOIN questions q ON pp.question_id = q.id
WHERE q.is_active = true;

-- Electorate lookup with candidates
CREATE VIEW electorate_candidates AS
SELECT
  e.id AS electorate_id,
  e.name AS electorate_name,
  e.state,
  c.id AS candidate_id,
  c.name AS candidate_name,
  c.incumbent,
  c.ballot_position,
  p.id AS party_id,
  p.name AS party_name,
  p.short_name AS party_short_name,
  p.color AS party_color
FROM electorates e
JOIN candidates c ON c.electorate_id = e.id
LEFT JOIN parties p ON c.party_id = p.id
ORDER BY e.name, c.ballot_position NULLS LAST;
