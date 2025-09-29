import { API_ENDPOINTS } from "@/lib/api-config";
import { PaginatedCertifications, Category, GroupedCategories } from "./types";

export class CategoryService {
    private static async makeRequest(url: string, options: RequestInit = {}) {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    static async getAllCategories(): Promise<GroupedCategories> {
        return this.makeRequest(API_ENDPOINTS.categories);
    }

    static async getCategoriesWithCertifications() {
        return this.makeRequest(API_ENDPOINTS.categoriesWithCertifications);
    }

    static async getCategoryCertifications(
        categorySlug: string, 
        page = 1, 
        perPage = 12
    ): Promise<PaginatedCertifications> {
        const url = `${API_ENDPOINTS.categoryCertifications(categorySlug)}?page=${page}&per_page=${perPage}`;
        return this.makeRequest(url);
    }

    static async findCategoryBySlug(categorySlug: string): Promise<Category | null> {
        const data = await this.getAllCategories();
        
        for (const group of data.groups) {
            // Check parent category
            if (group.parent.slug === categorySlug) {
                return group.parent;
            }
            // Check children categories
            const childMatch = group.children.find((child: Category) => child.slug === categorySlug);
            if (childMatch) {
                return childMatch;
            }
        }
        
        return null;
    }
}

// Legacy function for backward compatibility
export const fetchCertificationsByCategorySlug = async (slug: string, page: number) => {
    return CategoryService.getCategoryCertifications(slug, page);
}; 