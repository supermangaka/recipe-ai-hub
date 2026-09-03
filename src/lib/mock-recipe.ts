import { Recipe } from '@/types/recipe';

type MockRecipeContent = Omit<Recipe, 'ingredients'>;

const mockContent: Record<string, MockRecipeContent> = {
  en: {
    title: 'Skillet Chickpea & Spinach Stew',
    cuisine: 'mediterranean',
    difficulty: 'easy',
    cookTimeMinutes: 25,
    servings: 2,
    instructions: [
      'Heat olive oil in a skillet over medium heat, add garlic and cook until fragrant.',
      'Add tomato and simmer for 5 minutes until softened.',
      'Stir in chickpeas and cook for 8 minutes.',
      'Fold in spinach until wilted, season with salt and pepper.',
      'Serve warm with crusty bread.',
    ],
  },
  ru: {
    title: 'Рагу из нута со шпинатом на сковороде',
    cuisine: 'mediterranean',
    difficulty: 'easy',
    cookTimeMinutes: 25,
    servings: 2,
    instructions: [
      'Разогрей оливковое масло на сковороде на среднем огне, обжарь чеснок до аромата.',
      'Добавь помидоры и туши 5 минут до размягчения.',
      'Всыпь нут и готовь 8 минут.',
      'Вмешай шпинат до увядания, посоли и поперчи.',
      'Подавай тёплым с хрустящим хлебом.',
    ],
  },
  pt: {
    title: 'Ensopado de Grão-de-bico e Espinafre na Frigideira',
    cuisine: 'mediterranean',
    difficulty: 'easy',
    cookTimeMinutes: 25,
    servings: 2,
    instructions: [
      'Aqueça azeite na frigideira em fogo médio, refogue o alho até soltar aroma.',
      'Adicione tomate e cozinhe por 5 minutos até amolecer.',
      'Junte o grão-de-bico e cozinhe por 8 minutos.',
      'Misture o espinafre até murchar, tempere com sal e pimenta.',
      'Sirva quente com pão crocante.',
    ],
  },
};

export function getMockRecipe(ingredients: string[] | null, locale: string): Recipe {
  const content = mockContent[locale] ?? mockContent.en;
  const list = ingredients && ingredients.length > 0 ? ingredients : ['chickpeas', 'spinach', 'garlic', 'tomato'];
  return {
    ...content,
    ingredients: list,
  };
}