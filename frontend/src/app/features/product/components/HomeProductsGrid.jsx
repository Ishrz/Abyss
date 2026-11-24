import HomeProductCard from "./HomeProductCard.jsx"

/**
 * Featured drops grid — designed in Stitch ("Featured Drops").
 * Responsive column counts per Stitch spec:
 * - Mobile (<768px): 1 column
 * - Tablet (768px–1023px): 2 columns
 * - Desktop (1024px+): 4 columns
 * Responsive gaps per Stitch:
 * - Mobile: gap-3 (0.75rem = gutter-mobile)
 * - Tablet+: gap-6 (1.5rem = gutter)
 */
function HomeProductsGrid({ products, loading }) {
    if (loading) {
        return (
            <section className="flex flex-col gap-3 md:gap-6" id="product-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <article
                        key={i}
                        className="flex flex-col rounded-lg bg-surface-container p-2 shadow-lg animate-pulse aspect-[4/5]"
                    />
                ))}
            </section>
        )
    }

    return (
        <section className="flex flex-col gap-3 md:gap-6" id="product-grid">
            <div className="flex items-baseline justify-between">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Featured Drops</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6" id="product-grid">
                {products.map((product) => (
                    <HomeProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default HomeProductsGrid
