import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-white group-[.toaster]:border-white/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/60",
          actionButton:
            "group-[.toast]:bg-white/20 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
