// Content sections for each topic
export interface TopicContent {
  introduction?: string;
  key_points?: string[];
  practical_examples?: string[];
  what_to_teach?: string[];
}

// Detailed content structure from Python seed files
export interface DetailedTopicContent {
  title?: string;
  duration?: string;
  difficulty?: string;
  overview?: string;
  detailed_content?: {
    introduction?: string;
    key_concepts?: Record<string, string>;
    real_world_examples?: Record<string, string>;
    common_patterns_and_architectures?: Record<string, string>;
    design_process_and_methodology?: string;
    tools_and_technologies_overview?: string;
    [key: string]: string | Record<string, string> | undefined;
  };
  practical_exercises?: Array<{
    title: string;
    description: string;
    key_considerations: string[];
  }>;
  common_mistakes_to_avoid?: Array<{
    mistake: string;
    explanation: string;
    better_approach: string;
  }>;
  next_steps?: string;
}

// Individual topic within a module
export interface SyllabusTopic {
  id: number;
  title: string;
  description?: string;
  introduction?: string;
  estimatedDuration?: string;
  videoUrl?: string;
  videoStatus?: 'planned' | 'scripted' | 'recorded' | 'published';
  content?: TopicContent;
  detailed_content?: DetailedTopicContent;
}

// Module containing topics
export interface SyllabusModule {
  id: number;
  moduleNumber: number;
  title: string;
  description?: string;
  duration?: string;
  topics: SyllabusTopic[];
  learningObjectives: string[];
}

// Structured syllabus data from new API
export interface StructuredSyllabusData {
  certification_id: number;
  certification_name: string;
  certification_slug: string;
  modules: SyllabusModule[];
}

// Legacy course overview structure
export interface CourseOverview {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  prerequisites: string[];
}

// Legacy topic structure (used in JSON-based syllabus)
export interface LegacyTopic {
  title: string;
  content?: TopicContent;
  detailed_content?: DetailedTopicContent;
}

// Legacy syllabus data structure (JSON-based)
export interface LegacySyllabusData {
  courseOverview: CourseOverview;
  modules: {
    moduleNumber: number;
    title: string;
    duration: string;
    topics: (string | LegacyTopic)[];
    learningObjectives: string[];
  }[];
  practicalExercises?: string[];
  assessmentCriteria?: string[];
  recommendedReadings?: string[];
  toolsAndTechnologies?: string[];
}

// Union type for both structured and legacy data
export type SyllabusData = StructuredSyllabusData | LegacySyllabusData;

export interface SyllabusResponse {
  certification_id: number;
  certification_name: string;
  certification_slug: string;
  certification_description?: string;
  certification_level?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  has_access: boolean;
  is_qualified_teacher: boolean;
  syllabus: SyllabusData | null;
  syllabus_source?: 'structured' | 'json' | 'none';
  access_message?: string;
  message?: string;
}

// Helper type guards
export function isStructuredSyllabus(syllabus: SyllabusData): syllabus is StructuredSyllabusData {
  return 'certification_id' in syllabus;
}

export function isLegacySyllabus(syllabus: SyllabusData): syllabus is LegacySyllabusData {
  return 'courseOverview' in syllabus;
}