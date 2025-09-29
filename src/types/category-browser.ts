export type Category = {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
};

export type CategoryGroup = {
    parent: Category;
    children: Category[];
};

export type CategoriesResponse = {
    groups: CategoryGroup[];
};

export type Certification = {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    is_active: boolean;
    category_id: number;
    category_name?: string;
    category?: {
        id: number;
        name: string;
        description: string;
        slug: string;
        icon: string;
        color: string;
    };
};

export type SearchResponse = {
    certifications: Certification[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
};

export type Teacher = {
    id: number;
    user_id: string;
    user_name?: string;
    user_email: string;
    bio?: string;
    experience_years?: number;
    hourly_rate_one_on_one?: number;
    hourly_rate_group?: number;
    status: string;
    is_available: boolean;
    created_at: string;
    qualification_count: number;
};

export type TeacherSearchResponse = {
    teachers: Teacher[];
    total: number;
};

export type SearchTab = "certifications" | "teachers";