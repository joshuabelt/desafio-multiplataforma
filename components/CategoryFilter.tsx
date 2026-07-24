import styles from "../styles/CategoryFilter.module.css";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function CategoryFilter({ categories, activeCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className={styles.filterGroup}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          className={`${styles.filterButton} ${activeCategory === category ? styles.active : ""}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}