interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void; 
}

export default function CategoryFilter({ categories, activeCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={activeCategory === category ? "active" : ""}
        >
          {category}
        </button>
      ))}
    </div>
  );
}