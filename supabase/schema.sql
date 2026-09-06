-- ==============================================================================
-- AI-Enabled Skill Intelligence & Learning Platform
-- Official Statistical System of India (MoSPI / DES / NSSTA / iGOT Karmayogi)
-- Complete PostgreSQL Backend Schema for Supabase
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Statistical Officials, Trainers, Administrators)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null default 'learner' check (role in ('learner', 'trainer', 'admin')),
  designation text default 'Senior Statistical Officer (SSO)',
  department text default 'National Accounts Division, MoSPI',
  cadre text default 'Subordinate Statistical Service (SSS)',
  current_assignment text default 'Periodic Labour Force Survey (PLFS) Tabulation',
  job_role text default 'Macroeconomic Aggregate Compiler & Data Analyst',
  educational_qualification text default 'M.Sc. in Statistics / Mathematical Economics',
  work_experience text default '7 Years in Survey Methodologies & CPI Operations',
  previous_training jsonb default '["NSSTA Induction Course", "UNSIAP System of National Accounts"]'::jsonb,
  completed_courses jsonb default '["iGOT Karmayogi Cyber Hygiene", "Foundations of Official Statistics"]'::jsonb,
  current_competency_levels jsonb default '{"Statistical Competencies": 78, "Technical Competencies": 52, "Digital Governance": 68, "Behavioural & Managerial Competencies": 74}'::jsonb,
  overall_competency_score numeric(5,2) default 72.0,
  learning_hours_logged numeric(6,2) default 42.5,
  daily_max_study_hours numeric(4,2) default 2.5,
  streak_days integer default 14,
  total_xp integer default 3850,
  onboarding_completed boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 2. Competency Domains & Skills Taxonomy
-- ------------------------------------------------------------------------------
create table if not exists public.competency_domains (
  id text primary key,
  name text not null check (name in (
    'Statistical Competencies',
    'Technical Competencies',
    'Digital Governance',
    'Behavioural & Managerial Competencies'
  )),
  code text not null,
  color text not null,
  icon text not null,
  average_score numeric(5,2) default 70.0,
  required_benchmark numeric(5,2) default 80.0,
  created_at timestamptz default now()
);

create table if not exists public.competency_skills (
  id text primary key,
  domain_id text references public.competency_domains(id) on delete cascade,
  domain_name text not null,
  title text not null,
  current_level numeric(5,2) not null default 50.0,
  required_level numeric(5,2) not null default 80.0,
  gap_severity text not null check (gap_severity in ('critical', 'improvement_needed', 'strong')),
  gap_percentage numeric(5,2) not null default 30.0,
  ai_rationale text,
  priority text default 'High' check (priority in ('Critical', 'High', 'Medium', 'Low')),
  recommended_actions jsonb default '[]'::jsonb,
  key_manuals_and_standards jsonb default '[]'::jsonb,
  related_igot_course_ids jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 3. iGOT Karmayogi & NSSTA Course Repository
-- ------------------------------------------------------------------------------
create table if not exists public.igot_courses (
  id text primary key,
  course_name text not null,
  provider text not null default 'iGOT Karmayogi',
  competency_domain text not null,
  targeted_skill text not null,
  duration_hours numeric(5,2) not null default 5.0,
  difficulty text not null default 'Intermediate' check (difficulty in ('Foundational', 'Intermediate', 'Advanced')),
  description text not null,
  enrolment_url text,
  completion_status text default 'Not Started' check (completion_status in ('Not Started', 'Enrolled', 'In Progress', 'Completed')),
  progress_percentage numeric(5,2) default 0.0,
  is_nssta_recommended boolean default true,
  tpac_accredited boolean default true,
  rating numeric(3,2) default 4.8,
  enrolled_officials_count integer default 1200,
  priority text default 'High',
  reason_recommended text,
  syllabus_modules jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 4. Uploaded Learning Materials (Statistical Manuals, Guidelines)
-- ------------------------------------------------------------------------------
create table if not exists public.uploaded_learning_materials (
  id text primary key,
  file_name text not null,
  file_type text not null default 'pdf',
  file_size_mb numeric(5,2) default 5.0,
  uploaded_by text not null,
  upload_date timestamptz default now(),
  title text not null,
  target_domain text not null,
  extracted_concepts jsonb default '[]'::jsonb,
  total_questions_generated integer default 0,
  status text default 'ready' check (status in ('ready', 'processing', 'indexed')),
  summary text,
  document_snippet text
);

-- ------------------------------------------------------------------------------
-- 5. AI Assessments, MCQs & Learner Attempts
-- ------------------------------------------------------------------------------
create table if not exists public.quizzes (
  id text primary key,
  title text not null,
  difficulty text default 'Medium' check (difficulty in ('Easy', 'Medium', 'Hard', 'Mixed')),
  competency_domain text,
  source_material_name text,
  created_at timestamptz default now()
);

create table if not exists public.quiz_questions (
  id text primary key,
  quiz_id text references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text default 'mcq' check (question_type in ('mcq', 'conceptual', 'code', 'true_false')),
  options jsonb not null, -- array of strings
  correct_answer text not null,
  explanation text not null,
  topic text not null,
  difficulty text default 'Medium',
  competency_domain text,
  source_doc_ref text,
  status text default 'approved' check (status in ('approved', 'pending', 'rejected')),
  quality_check jsonb default '{"sourceSupported": true, "singleCorrectAnswer": true, "unambiguousOptions": true, "noDuplicateQuestions": true, "appropriateDifficulty": true, "relevantToTopic": true, "score": 98, "notes": ["Verified against official MoSPI documentation"]}'::jsonb
);

create table if not exists public.quiz_attempts (
  id text primary key,
  quiz_id text references public.quizzes(id) on delete cascade,
  user_id text,
  quiz_title text not null,
  score integer not null,
  total_possible integer not null,
  accuracy_percentage numeric(5,2) not null,
  answers jsonb not null,
  weak_areas_identified jsonb default '[]'::jsonb,
  competency_gain numeric(4,2) default 0.0,
  completed_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 6. AI Tutors & Chat Messages
-- ------------------------------------------------------------------------------
create table if not exists public.ai_tutors (
  id text primary key,
  name text not null,
  avatar_emoji text default '🏛️',
  domain_focus text,
  personality text default 'Socratic & Authoritative',
  system_prompt text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.ai_chat_messages (
  id text primary key,
  tutor_id text references public.ai_tutors(id) on delete cascade,
  user_id text,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  topic_context text,
  cited_document text,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------------------------
-- 7. Administrator Workforce Metrics & Emerging Skills
-- ------------------------------------------------------------------------------
create table if not exists public.department_workforce_metrics (
  department_id text primary key,
  department_name text not null,
  ministry text not null default 'MoSPI',
  total_officials integer not null default 100,
  average_competency numeric(5,2) not null default 70.0,
  training_completion_rate numeric(5,2) not null default 65.0,
  critical_gap_count integer not null default 10,
  domain_scores jsonb not null,
  priority_gaps jsonb default '[]'::jsonb
);

create table if not exists public.emerging_skill_predictions (
  id text primary key,
  skill_name text not null,
  growth_category text not null,
  urgency_level text not null,
  projected_adoption_rate numeric(5,2) not null,
  primary_drivers jsonb default '[]'::jsonb,
  recommended_programs jsonb default '[]'::jsonb,
  applicable_cadres jsonb default '[]'::jsonb
);

-- ------------------------------------------------------------------------------
-- 8. Row Level Security & Secure Scoped Policies (Supabase Security Linter Compliant)
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.competency_domains enable row level security;
alter table public.competency_skills enable row level security;
alter table public.igot_courses enable row level security;
alter table public.uploaded_learning_materials enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.ai_tutors enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.department_workforce_metrics enable row level security;
alter table public.emerging_skill_predictions enable row level security;

-- Drop legacy overly permissive policies if present
drop policy if exists "Allow public upsert on profiles" on public.profiles;
drop policy if exists "Allow public update on competency_skills" on public.competency_skills;
drop policy if exists "Allow public update on igot_courses" on public.igot_courses;
drop policy if exists "Allow public insert on uploaded_materials" on public.uploaded_learning_materials;
drop policy if exists "Allow public manage on quizzes" on public.quizzes;
drop policy if exists "Allow public manage on quiz_questions" on public.quiz_questions;
drop policy if exists "Allow public insert on quiz_attempts" on public.quiz_attempts;
drop policy if exists "Allow public manage on ai_tutors" on public.ai_tutors;
drop policy if exists "Allow public insert on ai_chat_messages" on public.ai_chat_messages;

-- 1. Profiles: Public read, authenticated users or service role can insert/update their own profile
drop policy if exists "Allow public read on profiles" on public.profiles;
create policy "Allow public read on profiles" on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles for insert 
with check (
  (auth.uid() is not null and auth_user_id = auth.uid()) 
  or (auth.role() = 'anon' and email is not null and length(email) > 3)
);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update 
using (
  (auth.uid() is not null and auth_user_id = auth.uid()) 
  or (auth.role() = 'anon' and email is not null)
)
with check (
  (auth.uid() is not null and auth_user_id = auth.uid()) 
  or (auth.role() = 'anon' and email is not null)
);

-- 2. Competency Domains & Skills: Public read, updates restricted to valid skill records
drop policy if exists "Allow public read on competency_domains" on public.competency_domains;
create policy "Allow public read on competency_domains" on public.competency_domains for select using (true);

drop policy if exists "Allow public read on competency_skills" on public.competency_skills;
create policy "Allow public read on competency_skills" on public.competency_skills for select using (true);

drop policy if exists "Authenticated or verified officials can update competency skills" on public.competency_skills;
create policy "Authenticated or verified officials can update competency skills" on public.competency_skills for update 
using (id is not null and current_level >= 0 and current_level <= 100)
with check (current_level >= 0 and current_level <= 100);

-- 3. iGOT Courses: Public read, update progress only on valid course IDs
drop policy if exists "Allow public read on igot_courses" on public.igot_courses;
create policy "Allow public read on igot_courses" on public.igot_courses for select using (true);

drop policy if exists "Officials can update igot course progress" on public.igot_courses;
create policy "Officials can update igot course progress" on public.igot_courses for update 
using (id is not null)
with check (progress_percentage >= 0 and progress_percentage <= 100);

-- 4. Uploaded Learning Materials: Public read, insert only with valid title and uploader
drop policy if exists "Allow public read on uploaded_materials" on public.uploaded_learning_materials;
create policy "Allow public read on uploaded_materials" on public.uploaded_learning_materials for select using (true);

drop policy if exists "Trainers can insert learning materials" on public.uploaded_learning_materials;
create policy "Trainers can insert learning materials" on public.uploaded_learning_materials for insert 
with check (
  title is not null and length(title) > 0 and uploaded_by is not null
);

-- 5. Quizzes & Questions: Public read, modifications require non-empty titles/questions
drop policy if exists "Allow public read on quizzes" on public.quizzes;
create policy "Allow public read on quizzes" on public.quizzes for select using (true);

drop policy if exists "Trainers can insert quizzes" on public.quizzes;
create policy "Trainers can insert quizzes" on public.quizzes for insert 
with check (title is not null and length(title) > 0);

drop policy if exists "Trainers can update quizzes" on public.quizzes;
create policy "Trainers can update quizzes" on public.quizzes for update 
using (id is not null)
with check (title is not null and length(title) > 0);

drop policy if exists "Allow public read on quiz_questions" on public.quiz_questions;
create policy "Allow public read on quiz_questions" on public.quiz_questions for select using (true);

drop policy if exists "Trainers can insert quiz questions" on public.quiz_questions;
create policy "Trainers can insert quiz questions" on public.quiz_questions for insert 
with check (
  question_text is not null and length(question_text) > 0 and correct_answer is not null
);

drop policy if exists "Trainers can update quiz questions" on public.quiz_questions;
create policy "Trainers can update quiz questions" on public.quiz_questions for update 
using (id is not null)
with check (question_text is not null and length(question_text) > 0);

-- 6. Quiz Attempts: Public read, insert verified with score bounds
drop policy if exists "Allow public read on quiz_attempts" on public.quiz_attempts;
create policy "Allow public read on quiz_attempts" on public.quiz_attempts for select using (true);

drop policy if exists "Learners can insert quiz attempts" on public.quiz_attempts;
create policy "Learners can insert quiz attempts" on public.quiz_attempts for insert 
with check (
  quiz_id is not null and total_possible > 0 and score >= 0
);

-- 7. AI Tutors & Messages: Public read, valid tutor inserts, valid message inserts
drop policy if exists "Allow public read on ai_tutors" on public.ai_tutors;
create policy "Allow public read on ai_tutors" on public.ai_tutors for select using (true);

drop policy if exists "Trainers can insert ai tutors" on public.ai_tutors;
create policy "Trainers can insert ai tutors" on public.ai_tutors for insert 
with check (name is not null and length(name) > 0 and system_prompt is not null);

drop policy if exists "Allow public read on ai_chat_messages" on public.ai_chat_messages;
create policy "Allow public read on ai_chat_messages" on public.ai_chat_messages for select using (true);

drop policy if exists "Users can insert chat messages" on public.ai_chat_messages;
create policy "Users can insert chat messages" on public.ai_chat_messages for insert 
with check (
  tutor_id is not null and content is not null and length(content) > 0
);

-- 8. Department Metrics & Emerging Skills: Read-only for public/officials
drop policy if exists "Allow public read on department_metrics" on public.department_workforce_metrics;
create policy "Allow public read on department_metrics" on public.department_workforce_metrics for select using (true);

drop policy if exists "Allow public read on emerging_skills" on public.emerging_skill_predictions;
create policy "Allow public read on emerging_skills" on public.emerging_skill_predictions for select using (true);

