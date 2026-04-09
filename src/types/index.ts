export interface Question {
    id: number;
    text: string;
    type: 'personality' | 'skill';
    category: string;
    options: QuestionOption[];
}

export interface QuestionOption {
    text: string;
    value: string;
    category: string;
    weight: number;
}

export interface CareerDetails {
    title: string;
    description: string;
    skills: string[];
    avgSalary: string;
    growth: string;
    difficulty: string;
    learningPath: string[];
}

export interface AssessmentResult {
    _id?: string;
    studentName: string;
    studentEmail: string;
    answers: Record<number, string>;
    recommendation: string;
    careerDetails: CareerDetails;
    completedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'student';
}

export interface DashboardStats {
    stats: {
        totalAssessments: number;
        totalStudents: number;
        totalQuestions: number;
        avgCompletionRate: string;
    };
    distribution: Record<string, number>;
    recentResults: AssessmentResult[];
    questions: Question[];
}
