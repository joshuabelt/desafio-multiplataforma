import { useState } from "react";
import { mockProducts, categories, Product } from "../data/products";

export default function CatalogContainer() {
  const [activeCategory, setActiveCategory] = useState<string>("Todas");

  const filteredProducts = activeCategory === "Todas"
    ? mockProducts
    : mockProducts.filter(product => product.category === activeCategory);

  return (
    <div className="catalog-container">
      <h1>Catálogo de Productos</h1>
      
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
      />

      <ProductGrid products={filteredProducts} />
    </div>
  );
}