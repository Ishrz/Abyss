import { useState } from "react"
import { useNavigate } from "react-router"

const CURRENCY = { INR: "₹", USD: "$", EUR: "€", GBP: "£" }

/**
 * Product card for the featured drops grid — designed in Stitch ("ABYSS — Home").
 * Stitch tokens:
 * - Container: rounded-lg bg-surface-container p-2 shadow-lg
 * - Image area: rounded-[1.25rem] overflow-hidden aspect-[4/5] bg-surface-container-lowest
 * - Typography: font-label-sm / font-headline-sm / font-label-md
 * - CTA button: rounded-full bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary
 */
function HomeProductCard({ product }) {
    const navigate = useNavigate()
    const [imgError, setImgError] = useState(false)
    const image = product?.images?.[0]?.url
    const symbol = CURRENCY[product?.price?.currency] || product?.price?.currency || ""
    const amount = Number(product?.price?.amount ?? 0)

    const handleCardClick = () => {
        navigate(`/product/${product._id}`)
    }

    const handleAddClick = (e) => {
        e.stopPropagation()
        // Quick-add: could trigger cart logic here
        navigate(`/product/${product._id}`)
    }

    return (
        <article
            className="product-card flex flex-col rounded-lg bg-surface-container p-2 shadow-lg transition-transform duration-200 cursor-pointer hover:shadow-xl hover:scale-[1.02]"
            data-category={product?.category || "all"}
            onClick={handleCardClick}
        >
            {/* Image */}
            <div className="relative rounded-[1.25rem] overflow-hidden aspect-[4/5] bg-surface-container-lowest">
                {!imgError && image ? (
                    <img
                        src={image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant">
                        <span className="font-label-sm text-label-sm uppercase">No image</span>
                    </div>
                )}

                {/* Wishlist button */}
                <button
                    type="button"
                    aria-label={`Save ${product.title}`}
                    className="wishlist-btn absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface/75 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
            </div>

            {/* Card body */}
            <div className="flex flex-col gap-2 pt-3 px-2 flex-1 justify-between">
                <div>
                    <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                        {product.category}
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface truncate mt-0.5">
                        {product.title}
                    </h3>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="font-label-md text-label-md text-on-surface">
                        {symbol}{amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                    <button
                        type="button"
                        onClick={handleAddClick}
                        className="add-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm hover:bg-primary hover:text-on-primary transition-all duration-200 active:scale-95"
                    >
                        <span>+ Add</span>
                    </button>
                </div>
            </div>
        </article>
    )
}

export default HomeProductCard
