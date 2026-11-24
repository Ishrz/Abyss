import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useProduct from "../hook/useProduct"
import HomeHero from "../components/HomeHero.jsx"
import HomeCategoryChips from "../components/HomeCategoryChips.jsx"
import HomeProductsGrid from "../components/HomeProductsGrid.jsx"
import HomeFooter from "../components/HomeFooter.jsx"

/**
 * Home page built from the Stitch design system ("ABYSS — Home", Indigo Nocturne theme).
 * Data is powered by the public Redux product catalog.
 *
 * Responsive layout per Stitch spec:
 * - Desktop (1024px+): margin 3rem (px-12), 4 product columns
 * - Tablet (768px–1023px): margin 2rem (px-8), 2 product columns
 * - Mobile (<768px): margin 1.25rem (px-5), 1 product column
 */
function Home() {
    const { handleGetAllProducts } = useProduct()
    const products = useSelector((state) => state.product.products)
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState("all")

    useEffect(() => {
        handleGetAllProducts().finally(() => setLoading(false))
    }, [])

    const cards = products.filter((p) => activeCategory === "all" || p.category === activeCategory)

    return (
        <div className="w-full min-h-screen">
            <div className="flex flex-col w-full gap-4 pb-4">
                <HomeHero />

                <div className="mx-auto max-w-7xl w-full px-5 md:px-8 lg:px-12">
                    <HomeCategoryChips
                        categories={["all", "outerwear", "knitwear", "pants", "footwear"]}
                        activeCategory={activeCategory}
                        onCategorySelect={setActiveCategory}
                        productCount={cards.length}
                    />

                    <HomeProductsGrid products={cards} loading={loading} />

                    <HomeFooter />
                </div>
            </div>
        </div>
    )
}

export default Home
