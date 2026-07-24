"use client";

import { useState } from "react";
import { products as mockProducts, categories } from "../data/products";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import styles from "../styles/CatalogContainer.module.css";

export default function CatalogContainer() {
  const [activeCategory, setActiveCategory] = useState<string>("Todas");

  const filteredProducts =
    activeCategory === "Todas"
      ? mockProducts
      : mockProducts.filter((product) => product.category === activeCategory);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Catálogo de Productos</h1>
        <p className={styles.subtitle}>Explora nuestra colección y agrega tus favoritos al carrito.</p>
      </div>

      <CategoryFilter
        categories={["Todas", ...categories]}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      <ProductGrid products={filteredProducts} />
    </div>
  );
}