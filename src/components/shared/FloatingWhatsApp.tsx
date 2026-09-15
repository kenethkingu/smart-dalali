import { MessageCircle } from 'lucide-react'

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/255700000000" // Replace with actual support number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
      aria-label="Contact Support on WhatsApp"
    >
      {/* We use lucide-react's MessageCircle as a generic chat icon, or we could use a custom SVG. 
          MessageCircle looks close enough to a chat bubble, but let's just use it as the WhatsApp icon placeholder. */}
      <MessageCircle className="w-7 h-7 fill-current" />
    </a>
  )
}
