import { Leaf } from "lucide-react"

const Footer = () => {
  return (
    <footer className='py-12 border-t border-(hsl(var(--border)))'>
        <div className='container mx-auto px-6'>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className = 'flex items-center gap-2'>
                    <Leaf className = 'w-5 h-5 text-[hsl(var(--primary))]'/>
                    <span className = 'font-display text-lg font-bold text-(hsl(var(--foreground)))'>
                        Iconic <span className="text-(hsl(var(--primary)))">Herbals</span>
                    </span>
                </div>
                <div className="flex gap-6 text-sm text-[(hsl(var(--muted-foreground)))]">
                    <a href="" className="hover:text-[hsl(var(--primary))] transition-colors">Primary</a>
                    <a href="" className="hover:text-[hsl(var(--primary))] transition-colors">Terms</a>
                    <a href="" className="hover:text-[hsl(var(--primary))] transition-colors">Contact</a>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground)]">
                  &copy; {new Date().getFullYear} Iconic Herbals. All right reserved  
                </p>
            </div>
        </div>
    </footer>
  )
}

export default Footer