/**
 * Category filter row — designed in Stitch ("Curated Edits").
 */
function HomeCategoryChips({ categories, activeCategory, onCategorySelect, productCount }) {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="font-subheading text-subheading uppercase text-on-surface-variant">Curated Edits</span>
                <span className="font-body-sm text-body-sm text-primary" id="active-category-count">
                    {productCount} items
                </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4" id="category-chips">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        data-category={cat}
                        onClick={() => onCategorySelect(cat)}
                        className={`category-chip shrink-0 px-3 py-2.5 rounded-full font-label-md text-label-md transition-all duration-200 ${
                            activeCategory === cat
                                ? "bg-primary text-on-primary shadow-md"
                                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                        }`}
                    >
                        {cat === "all" ? "All Drops" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
        </section>
    )
}

export default HomeCategoryChips
