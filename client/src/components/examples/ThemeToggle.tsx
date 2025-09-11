import { ThemeProvider } from '../ui/ThemeProvider'
import { ThemeToggle } from '../ui/ThemeToggle'

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Theme Toggle Example</h3>
          <ThemeToggle />
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-muted-foreground">
            This content will change appearance based on the selected theme.
            Try switching between light, dark, and system themes.
          </p>
        </div>
      </div>
    </ThemeProvider>
  )
}