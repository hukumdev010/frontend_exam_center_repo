export interface Certification {
    id: number;
    name: string;
    description: string;
    slug: string;
    level: string;
    duration: number;
    questions_count: number;
    is_active: boolean;
    category_id: number;
}

export interface PaginatedCertifications {
    certifications: Certification[];
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
}

export interface CategoryGroup {
    parent: Category;
    children: Category[];
}

export interface GroupedCategories {
    groups: CategoryGroup[];
}
