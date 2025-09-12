import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Github, Upload, CheckCircle, XCircle } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function GitHubSyncPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [userInfo, setUserInfo] = useState<string | null>(null)
  const { toast } = useToast()

  const handleGitHubSync = async () => {
    setIsConnecting(true)
    setConnectionStatus('idle')
    
    try {
      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setConnectionStatus('success')
        setUserInfo(data.user)
        toast({
          title: "GitHub Connected!",
          description: `Successfully connected as ${data.user}. Your progress can now be synced to GitHub.`,
        })
      } else {
        throw new Error(data.error || 'Connection failed')
      }
    } catch (error) {
      console.error('GitHub sync error:', error)
      setConnectionStatus('error')
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to GitHub',
        variant: "destructive"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">GitHub Integration</h1>
          <p className="text-muted-foreground">
            Push your project progress to GitHub for version control and collaboration
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Repository Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {connectionStatus === 'idle' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Github className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Connect to GitHub to push your HVAC/Refrigeration project progress
                  </p>
                </div>
              )}
              
              {connectionStatus === 'success' && userInfo && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Successfully Connected!</p>
                    <p className="text-sm text-muted-foreground">GitHub user: @{userInfo}</p>
                  </div>
                </div>
              )}
              
              {connectionStatus === 'error' && (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-red-600 dark:text-red-400">
                    Failed to connect to GitHub
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGitHubSync}
                disabled={isConnecting}
                size="lg"
                className="min-h-[44px]"
                data-testid="button-github-sync"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : connectionStatus === 'success' ? (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Push Progress to GitHub
                  </>
                ) : (
                  <>
                    <Github className="w-4 h-4 mr-2" />
                    Connect to GitHub
                  </>
                )}
              </Button>
            </div>

            {connectionStatus === 'success' && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">What's included in your commit:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ Enhanced Products page with responsive layout</li>
                  <li>✅ Fixed ProductCard sizing and animations</li>
                  <li>✅ Improved Header/Navigation stability</li>
                  <li>✅ Enhanced Filters UX with smooth animations</li>
                  <li>✅ Product Detail pages with accordions and 44px touch targets</li>
                  <li>✅ GSAP animation framework implementation</li>
                  <li>✅ Mobile-first responsive design optimizations</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}