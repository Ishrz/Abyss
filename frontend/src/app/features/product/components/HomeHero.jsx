/**
 * Hero section of the ABYSS home page — designed in Stitch
 * ("ABYSS — Home", Indigo Nocturne theme, material-symbols icons).
 */
function HomeHero() {
    return (
        <section className="relative overflow-hidden rounded-lg bg-gradient-to-br from-secondary-container via-surface-container-high to-surface-container-lowest p-4 shadow-xl">
            {/* Decorative blobs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-tertiary-container/15 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-4">
                {/* Tag + Drop label */}
                <div className="flex items-center justify-between">
                    <span className="font-subheading text-subheading uppercase text-primary">Autumn / Winter ’25</span>
                    <span className="px-2 py-1 rounded-full bg-surface-container/70 text-on-surface-variant font-label-sm text-label-sm uppercase">Drop 04</span>
                </div>

                {/* Headline */}
                <h1 className="font-display-hero-mobile text-display-hero-mobile text-on-surface">
                    Discover Premium Finds
                </h1>

                {/* Subtext */}
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                    Architectural silhouettes and tactile nocturnal fabrics crafted for effortless modern cool.
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 pt-2">
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-lg hover:bg-primary-fixed transition-all duration-200 active:scale-95">
                        <span>Explore Collection</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                </div>

                {/* Editorial image */}
                <div className="relative mt-4 rounded-[1.5rem] overflow-hidden h-40 bg-surface-container-lowest shadow-md">
                    <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-6x6K0gynV7bdXTI1kyeU_Ezv2jbXMy6mpwcp7P4h1drkb9XxNVVX9hMnwv7C73TP4FQqKyyCudygOjgBI6DyYJKB_-jLhOMOv5XkfLdzkM8prOlAQzNKJfDtYczNW9w-LvWtir2TTBg-2m3ykpnWR3d5Ah_GlQlEyOYEXfYNy4eNpRTcqp2_eFCN_fIN-9ozkkNwIhOfNqWVcE6tM-6sAfZrNVqzcdKEPpoL40vNddcnNq364rZax5C_dsEqNNg"
                        alt="ABYSS Autumn Winter Editorial"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="font-label-sm text-label-sm uppercase text-on-surface">Nocturne Atelier</span>
                        <span className="font-body-sm text-body-sm text-primary">14 Pieces</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomeHero
