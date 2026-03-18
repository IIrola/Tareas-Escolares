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
            "group toast group-[.toaster]:bg-foreground/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-foreground/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-foreground/60",
          actionButton:
            "group-[.toast]:bg-foreground/20 group-[.toast]:text-foreground",
          cancelButton:
            "group-[.toast]:bg-foreground/10 group-[.toast]:text-foreground/60",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
