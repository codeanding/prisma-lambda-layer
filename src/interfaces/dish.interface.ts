export interface CreateDishDTO {
  name: string;
  description: string;
  countryId: number;
  ingredientIds: number[];
}

export interface UpdateDishDTO {
  name?: string;
  description?: string;
}
