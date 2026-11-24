/**
 * Footer — designed in Stitch ("© 2025 ABYSS Atelier").
 */
function HomeFooter() {
    return (
        <footer className="mt-2 rounded-lg bg-surface-container-low p-4 flex flex-col gap-4 shadow-md">
            <span className="font-label-sm text-label-sm uppercase text-primary">Private Access</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Join the Midnight Dispatch</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
                Early access to limited drops and atelier previews.
            </p>
            <div className="flex items-center justify-between pt-3">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                    © 2025 ABYSS Atelier
                </span>
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                    Paris · Tokyo
                </span>
            </div>
        </footer>
    )
}

export default HomeFooter
