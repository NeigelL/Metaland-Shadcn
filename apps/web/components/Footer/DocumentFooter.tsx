

export function DocumentFooter({children = null, styles = ""}: {children?: React.ReactNode, styles?: string}) {

return (
    <div className="w-full p-4">
        {children}
        {
            !children && <>
            <div className={["text-logo sm:text-center lg:text-end text-xs text-slate-400", styles].join(" ")}>
                <div>
                    Metaland Properties Inc.
                </div>
                <div>
                    +032 342 8422 | +63 919 098 2727 | metalandpropertiesinc@gmail.com
                </div>
                <div>
                    Unit C, 36th Floor, Cebu Exchange Tower, Salinas Dr, Lahug, Cebu City 6000
                </div>
            </div>
        </>
        }
    </div>
    )
}