-- ==============================================================================
-- CogniStudy / AI Study Planner & Smart Learning Tracker
-- Production PostgreSQL Database Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  education_level text, -- High School, Undergraduate, Postgraduate, Competitive Exam
  course_degree text,    -- e.g. B.Tech Computer Science, Pre-Med
  current_semester text, -- e.g. Semester 4, Year 2
  target_gpa_grade text, -- e.g. 9.5 CGPA, A+
  daily_max_study_hours numeric(4,2) default 6.0,
  preferred_study_time text default 'evening', -- morning, afternoon, evening, night
  pomodoro_focus_mins integer default 50,
  pomodoro_break_mins integer default 10,
  long_break_mins integer default 20,
  stability_threshold_mins integer default 15,
  streak_days integer default 0,
  total_xp integer default 0,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User Availability & Routine
create table if not exists public.user_availability (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  day_type text not null check (day_type in ('weekday', 'weekend', 'holiday')),
  wake_time time not null default '07:00:00',
  sleep_time time not null default '23:00:00',
  institution_hours text, -- e.g. "09:00-16:00"
  travel_hours text,      -- e.g. "08:15-09:00, 16:00-16:45"
  meal_hours text,        -- e.g. "08:00-08:30, 13:00-14:00, 20:00-20:45"
  coaching_hours text,    -- optional
  personal_activity_hours text,
  available_study_slots jsonb not null default '[]'::jsonb, -- Array of {start: "18:00", end: "22:00"}
  created_at timestamptz default now(),
  unique(user_id, day_type)
);

-- 3. Subjects Table
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  code text,
  color text default '#6366f1', -- Hex color for UI badges
  icon text default 'BookOpen',
  target_marks integer default 90,
  credit_weight numeric(3,1) default 3.0,
  exam_date date,
  created_at timestamptz default now()
);

-- 4. Units Table
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  unit_number integer not null,
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- 5. Chapters Table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  chapter_number integer not null,
  title text not null,
  estimated_base_hours numeric(4,2) default 2.0,
  created_at timestamptz default now()
);

-- 6. Topics Table
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  difficulty text default 'Medium' check (difficulty in ('Easy', 'Medium', 'Hard')),
  importance text default 'High' check (importance in ('Low', 'Medium', 'High', 'Critical')),
  knowledge_level text default 'Medium' check (knowledge_level in ('Low', 'Medium', 'High')),
  estimated_mins integer default 60,
  actual_mins_spent integer default 0,
  mastery_percentage integer default 0 check (mastery_percentage >= 0 and mastery_percentage <= 100),
  is_completed boolean default false,
  completed_at timestamptz,
  last_studied_at timestamptz,
  created_at timestamptz default now()
);

-- 7. Subtopics Table
create table if not exists public.subtopics (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- 8. Topic Prerequisites (Dependency Graph)
create table if not exists public.topic_prerequisites (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  prerequisite_topic_id uuid not null references public.topics(id) on delete cascade,
  unique(topic_id, prerequisite_topic_id)
);

-- 9. Study Materials Table (Files, Notes, Docs, Links)
create table if not exists public.study_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  file_name text not null,
  file_type text not null, -- pdf, docx, pptx, txt, note, link
  file_url text,
  file_size_kb integer,
  ai_summary text,
  extracted_key_points jsonb default '[]'::jsonb,
  formulas jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 10. Schedules Table (Active Study Plans)
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  plan_type text default 'daily' check (plan_type in ('daily', 'weekly', 'monthly', 'exam_prep', 'revision')),
  start_date date not null,
  end_date date not null,
  is_active boolean default true,
  generated_at timestamptz default now()
);

-- 11. Schedule Tasks (Granular Timetable Blocks)
create table if not exists public.schedule_tasks (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  task_type text default 'study' check (task_type in ('study', 'revision', 'practice', 'quiz', 'break')),
  start_time timestamptz not null,
  end_time timestamptz not null,
  planned_duration_mins integer not null,
  actual_duration_mins integer,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'skipped', 'rescheduled')),
  is_locked boolean default false, -- Locked sessions will NOT be auto-moved by the AI scheduler
  priority_tag text default 'High' check (priority_tag in ('Critical', 'High', 'Medium', 'Low')),
  reschedule_reason text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- 12. Study Sessions Table (Live Session Analytics)
create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.schedule_tasks(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  planned_mins integer not null,
  actual_mins integer not null,
  saved_or_delayed_mins integer default 0, -- positive = early, negative = delayed
  distraction_count integer default 0,
  focus_score integer default 100 check (focus_score between 0 and 100),
  understanding_rating text check (understanding_rating in ('didnt_understand', 'partially_understood', 'understood', 'fully_understood')),
  notes text,
  created_at timestamptz default now()
);

-- 13. Spaced Revisions Table (SM-2 Algorithm Queue)
create table if not exists public.spaced_revisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  repetition_number integer default 1,
  ease_factor numeric(3,2) default 2.50,
  interval_days integer default 1,
  next_review_date date not null,
  status text default 'due' check (status in ('due', 'completed', 'overdue')),
  last_rating integer check (last_rating between 1 and 4),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. Quizzes & Diagnostic Tests
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  difficulty text default 'Medium',
  total_questions integer default 5,
  created_at timestamptz default now()
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text default 'mcq' check (question_type in ('mcq', 'conceptual', 'code', 'true_false')),
  options jsonb, -- array of strings for MCQ
  correct_answer text not null,
  explanation text,
  difficulty text default 'Medium'
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score integer not null,
  total_possible integer not null,
  accuracy_percentage integer not null,
  answers_payload jsonb not null, -- User responses
  weak_areas_identified jsonb default '[]'::jsonb,
  completed_at timestamptz default now()
);

-- 15. AI Tutors & Assistants (Personas)
create table if not exists public.ai_tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  avatar_emoji text default '🤖',
  subject_id uuid references public.subjects(id) on delete set null,
  personality text default 'Socratic & Encouraging', -- Strict, Socratic, Concise, Step-by-Step
  system_prompt text not null,
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.ai_tutors(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  topic_context uuid references public.topics(id) on delete set null,
  created_at timestamptz default now()
);

-- 16. Learning Resources ("Where Should I Learn This?")
create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  resource_type text not null check (resource_type in ('video', 'documentation', 'article', 'practice', 'course', 'ai_explanation')),
  url text,
  difficulty_level text default 'Beginner',
  estimated_mins integer default 20,
  recommended_reason text not null,
  quality_score numeric(2,1) default 4.8,
  created_at timestamptz default now()
);

-- 17. Academic Deadlines & Exams
create table if not exists public.academic_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete cascade,
  title text not null,
  event_type text not null check (event_type in ('final_exam', 'midterm', 'quiz', 'assignment', 'practical', 'project')),
  event_date timestamptz not null,
  weightage_percentage integer default 30,
  syllabus_coverage_needed integer default 100,
  created_at timestamptz default now()
);

-- 18. Notifications & Alerts
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type text default 'schedule_update' check (notification_type in ('schedule_update', 'session_reminder', 'streak_alert', 'exam_warning', 'achievement')),
  action_link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- 19. Gamification Badges & Achievements
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null,
  title text not null,
  description text not null,
  icon text not null,
  unlocked_at timestamptz default now()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
create index if not exists idx_schedule_tasks_user_time on public.schedule_tasks(user_id, start_time);
create index if not exists idx_topics_chapter on public.topics(chapter_id);
create index if not exists idx_spaced_revisions_date on public.spaced_revisions(user_id, next_review_date);
create index if not exists idx_chat_messages_tutor on public.ai_chat_messages(tutor_id, created_at);
create index if not exists idx_notifications_unread on public.notifications(user_id, is_read);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.user_availability enable row level security;
alter table public.subjects enable row level security;
alter table public.units enable row level security;
alter table public.chapters enable row level security;
alter table public.topics enable row level security;
alter table public.subtopics enable row level security;
alter table public.topic_prerequisites enable row level security;
alter table public.study_materials enable row level security;
alter table public.schedules enable row level security;
alter table public.schedule_tasks enable row level security;
alter table public.study_sessions enable row level security;
alter table public.spaced_revisions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.ai_tutors enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.learning_resources enable row level security;
alter table public.academic_events enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;

-- Profiles: Users can select and update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- User Availability
create policy "Users can view own availability" on public.user_availability for select using (auth.uid() = user_id);
create policy "Users can manage own availability" on public.user_availability for all using (auth.uid() = user_id);

-- Subjects
create policy "Users can view own subjects" on public.subjects for select using (auth.uid() = user_id);
create policy "Users can manage own subjects" on public.subjects for all using (auth.uid() = user_id);

-- Units, Chapters, Topics (Joined with Subjects)
create policy "Users can view units of their subjects" on public.units for select using (
  exists (select 1 from public.subjects s where s.id = units.subject_id and s.user_id = auth.uid())
);
create policy "Users can manage units of their subjects" on public.units for all using (
  exists (select 1 from public.subjects s where s.id = units.subject_id and s.user_id = auth.uid())
);

create policy "Users can view chapters" on public.chapters for select using (
  exists (select 1 from public.units u join public.subjects s on s.id = u.subject_id where u.id = chapters.unit_id and s.user_id = auth.uid())
);
create policy "Users can manage chapters" on public.chapters for all using (
  exists (select 1 from public.units u join public.subjects s on s.id = u.subject_id where u.id = chapters.unit_id and s.user_id = auth.uid())
);

create policy "Users can view topics" on public.topics for select using (
  exists (select 1 from public.chapters c join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where c.id = topics.chapter_id and s.user_id = auth.uid())
);
create policy "Users can manage topics" on public.topics for all using (
  exists (select 1 from public.chapters c join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where c.id = topics.chapter_id and s.user_id = auth.uid())
);

create policy "Users can view subtopics" on public.subtopics for select using (
  exists (select 1 from public.topics t join public.chapters c on c.id = t.chapter_id join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where t.id = subtopics.topic_id and s.user_id = auth.uid())
);
create policy "Users can manage subtopics" on public.subtopics for all using (
  exists (select 1 from public.topics t join public.chapters c on c.id = t.chapter_id join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where t.id = subtopics.topic_id and s.user_id = auth.uid())
);

-- Topic Prerequisites
create policy "Users can manage topic prerequisites" on public.topic_prerequisites for all using (
  exists (select 1 from public.topics t join public.chapters c on c.id = t.chapter_id join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where t.id = topic_prerequisites.topic_id and s.user_id = auth.uid())
);

-- Study Materials
create policy "Users can manage own study materials" on public.study_materials for all using (auth.uid() = user_id);

-- Schedules & Schedule Tasks
create policy "Users can manage own schedules" on public.schedules for all using (auth.uid() = user_id);
create policy "Users can manage own schedule tasks" on public.schedule_tasks for all using (auth.uid() = user_id);

-- Study Sessions
create policy "Users can manage own study sessions" on public.study_sessions for all using (auth.uid() = user_id);

-- Spaced Revisions
create policy "Users can manage own spaced revisions" on public.spaced_revisions for all using (auth.uid() = user_id);

-- Quizzes & Questions
create policy "Users can manage own quizzes" on public.quizzes for all using (auth.uid() = user_id);
create policy "Users can view quiz questions" on public.quiz_questions for all using (
  exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and q.user_id = auth.uid())
);
create policy "Users can manage own quiz attempts" on public.quiz_attempts for all using (auth.uid() = user_id);

-- AI Tutors & Messages
create policy "Users can manage own AI tutors" on public.ai_tutors for all using (auth.uid() = user_id);
create policy "Users can manage own chat messages" on public.ai_chat_messages for all using (auth.uid() = user_id);

-- Learning Resources
create policy "Users can view learning resources" on public.learning_resources for select using (true);
create policy "Users can manage own learning resources" on public.learning_resources for all using (
  exists (select 1 from public.topics t join public.chapters c on c.id = t.chapter_id join public.units u on u.id = c.unit_id join public.subjects s on s.id = u.subject_id where t.id = learning_resources.topic_id and s.user_id = auth.uid())
);

-- Academic Events, Notifications, Achievements
create policy "Users can manage own academic events" on public.academic_events for all using (auth.uid() = user_id);
create policy "Users can manage own notifications" on public.notifications for all using (auth.uid() = user_id);
create policy "Users can view own achievements" on public.achievements for all using (auth.uid() = user_id);
