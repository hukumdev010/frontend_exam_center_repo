export interface Answer {
    id: number;
    text: string;
    question_id: number;
    isCorrect: boolean;
}

export interface AIAssistant {
    response: string;
    model_name: string;
    cache_hits: number;
    cached: boolean;
    created_at?: string;
}

export interface Question {
    id: number;
    text: string;
    explanation?: string;
    reference?: string;
    points: number;
    answers: Answer[];
    ai_assistant?: AIAssistant;
    question_hash?: string;
}