export interface Answer {
    id: number;
    text: string;
    question_id: number;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    text: string;
    explanation?: string;
    reference?: string;
    points: number;
    answers: Answer[];
}