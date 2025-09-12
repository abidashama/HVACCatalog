import { useState } from 'react'
import { FileText, Download, BookOpen, Video, Search, Calendar, ExternalLink, Tag, Filter } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { NavigationBreadcrumb } from '@/components/ui/NavigationBreadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const documentationCategories = [
  { id: 'installation', name: 'Installation Guides', count: 24 },
  { id: 'specifications', name: 'Technical Specifications', count: 18 },
  { id: 'maintenance', name: 'Maintenance Manuals', count: 15 },
  { id: 'troubleshooting', name: 'Troubleshooting', count: 12 },
  { id: 'warranty', name: 'Warranty Information', count: 8 },
  { id: 'compliance', name: 'Compliance & Safety', count: 10 }
]

const featuredDocuments = [
  {
    id: 'lf55-install',
    title: 'LF55 Series Pressure Switch Installation Guide',
    description: 'Complete installation procedures, wiring diagrams, and commissioning checklist for LF55 series pressure switches.',
    type: 'Installation Guide',
    category: 'installation',
    fileSize: '2.4 MB',
    pages: 16,
    lastUpdated: '2024-01-15',
    downloadCount: 1248,
    featured: true
  },
  {
    id: 'phe-maintenance',
    title: 'Plate Heat Exchanger Maintenance Manual',
    description: 'Preventive maintenance schedules, cleaning procedures, and performance monitoring for PHE series heat exchangers.',
    type: 'Maintenance Manual',
    category: 'maintenance',
    fileSize: '3.1 MB',
    pages: 24,
    lastUpdated: '2024-01-10',
    downloadCount: 892,
    featured: true
  },
  {
    id: 'refrigeration-troubleshooting',
    title: 'Refrigeration System Troubleshooting Guide',
    description: 'Diagnostic procedures, common issues, and solutions for commercial refrigeration systems and components.',
    type: 'Troubleshooting Guide',
    category: 'troubleshooting',
    fileSize: '4.2 MB',
    pages: 32,
    lastUpdated: '2024-01-08',
    downloadCount: 1567,
    featured: true
  },
  {
    id: 'safety-compliance',
    title: 'HVAC Safety and Compliance Standards',
    description: 'Current safety regulations, compliance requirements, and best practices for HVAC installations.',
    type: 'Compliance Guide',
    category: 'compliance',
    fileSize: '1.8 MB',
    pages: 20,
    lastUpdated: '2024-01-12',
    downloadCount: 743,
    featured: true
  }
]

const industryNews = [
  {
    id: 'refrigerant-regulations-2024',
    title: 'New Refrigerant Regulations for 2024: What HVAC Professionals Need to Know',
    excerpt: 'Updates to EPA regulations on refrigerant handling, recovery, and equipment certification requirements effective January 2024.',
    author: 'Technical Editorial Team',
    publishDate: '2024-01-20',
    readTime: '8 min read',
    category: 'Regulations',
    tags: ['EPA', 'Refrigerants', 'Compliance']
  },
  {
    id: 'energy-efficiency-trends',
    title: 'Energy Efficiency Trends in Commercial HVAC Systems',
    excerpt: 'Latest developments in high-efficiency equipment, smart controls, and energy management systems for commercial applications.',
    author: 'Engineering Department',
    publishDate: '2024-01-18',
    readTime: '12 min read',
    category: 'Technology',
    tags: ['Energy Efficiency', 'Smart Controls', 'Commercial HVAC']
  },
  {
    id: 'heat-pump-advancement',
    title: 'Advances in Industrial Heat Pump Technology',
    excerpt: 'New developments in industrial heat pump design, applications, and performance improvements for industrial process heating.',
    author: 'Product Development Team',
    publishDate: '2024-01-15',
    readTime: '10 min read',
    category: 'Innovation',
    tags: ['Heat Pumps', 'Industrial', 'Technology']
  },
  {
    id: 'preventive-maintenance',
    title: 'The ROI of Preventive Maintenance in HVAC Systems',
    excerpt: 'Cost-benefit analysis and best practices for implementing effective preventive maintenance programs.',
    author: 'Service Department',
    publishDate: '2024-01-12',
    readTime: '6 min read',
    category: 'Maintenance',
    tags: ['Maintenance', 'ROI', 'Best Practices']
  }
]

const trainingVideos = [
  {
    id: 'pressure-switch-installation',
    title: 'Pressure Switch Installation and Calibration',
    description: 'Step-by-step video guide for proper installation and calibration of pressure switches in HVAC systems.',
    duration: '15:32',
    instructor: 'Michael Chen, PE',
    level: 'Intermediate',
    views: 8432
  },
  {
    id: 'heat-exchanger-maintenance',
    title: 'Heat Exchanger Cleaning and Maintenance',
    description: 'Professional techniques for cleaning, inspecting, and maintaining plate heat exchangers.',
    duration: '22:45',
    instructor: 'Sarah Rodriguez, PE',
    level: 'Advanced',
    views: 6124
  },
  {
    id: 'system-commissioning',
    title: 'HVAC System Commissioning Best Practices',
    description: 'Complete commissioning procedures for new HVAC installations and major system upgrades.',
    duration: '28:17',
    instructor: 'David Thompson',
    level: 'Advanced',
    views: 4896
  },
  {
    id: 'troubleshooting-basics',
    title: 'HVAC Troubleshooting Fundamentals',
    description: 'Basic diagnostic techniques and systematic approach to identifying common HVAC problems.',
    duration: '18:50',
    instructor: 'Jennifer Liu',
    level: 'Beginner',
    views: 12458
  }
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('documentation')

  const handleSearch = () => {
    console.log('Search resources:', searchQuery)
  }

  const handleDownload = (documentId: string, title: string) => {
    console.log('Download document:', documentId, title)
  }

  const handleVideoPlay = (videoId: string, title: string) => {
    console.log('Play video:', videoId, title)
  }

  const handleNewsRead = (articleId: string, title: string) => {
    console.log('Read article:', articleId, title)
  }

  const filteredDocuments = featuredDocuments.filter(doc => 
    selectedCategory === 'all' || doc.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <NavigationBreadcrumb />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-muted py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Technical Resources
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Comprehensive technical documentation, training materials, and industry insights 
            to support HVAC and refrigeration professionals.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search documentation, guides, articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-16 h-12 text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-resource-search"
              />
              <Button 
                size="icon" 
                className="absolute right-1 top-1 h-10"
                onClick={handleSearch}
                data-testid="button-resource-search"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2 mx-auto">
            <TabsTrigger value="documentation" data-testid="tab-documentation">Documentation</TabsTrigger>
            <TabsTrigger value="training" data-testid="tab-training">Training</TabsTrigger>
            <TabsTrigger value="news" data-testid="tab-news">Industry News</TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">Tools</TabsTrigger>
          </TabsList>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories Sidebar */}
              <div className="lg:w-80 flex-shrink-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <button 
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                        onClick={() => setSelectedCategory('all')}
                        data-testid="category-all"
                      >
                        <div className="flex justify-between items-center">
                          <span>All Documentation</span>
                          <Badge variant="outline">{featuredDocuments.length}</Badge>
                        </div>
                      </button>
                      {documentationCategories.map((category) => (
                        <button 
                          key={category.id}
                          className={`w-full text-left p-3 rounded-md transition-colors ${
                            selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                          data-testid={`category-${category.id}`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <Badge variant="outline">{category.count}</Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documents Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="hover-elevate">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground leading-tight">{doc.title}</h3>
                              {doc.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                            </div>
                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{doc.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-muted-foreground">
                              <div>
                                <span className="font-medium">Type:</span> {doc.type}
                              </div>
                              <div>
                                <span className="font-medium">Size:</span> {doc.fileSize}
                              </div>
                              <div>
                                <span className="font-medium">Pages:</span> {doc.pages}
                              </div>
                              <div>
                                <span className="font-medium">Downloads:</span> {doc.downloadCount.toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                              </span>
                              <Button 
                                size="sm" 
                                onClick={() => handleDownload(doc.id, doc.title)}
                                data-testid={`button-download-${doc.id}`}
                              >
                                <Download className="mr-2 w-4 h-4" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Training Videos</h2>
              <p className="text-lg text-muted-foreground">
                Professional training content from certified HVAC experts
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainingVideos.map((video) => (
                <Card key={video.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{video.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{video.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Duration:</span> {video.duration}
                          </div>
                          <div>
                            <span className="font-medium">Level:</span> {video.level}
                          </div>
                          <div>
                            <span className="font-medium">Instructor:</span> {video.instructor}
                          </div>
                          <div>
                            <span className="font-medium">Views:</span> {video.views.toLocaleString()}
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleVideoPlay(video.id, video.title)}
                          data-testid={`button-play-${video.id}`}
                        >
                          <Video className="mr-2 w-4 h-4" />
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Industry News Tab */}
          <TabsContent value="news" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Industry News & Insights</h2>
              <p className="text-lg text-muted-foreground">
                Latest developments, regulations, and trends in HVAC and refrigeration
              </p>
            </div>

            <div className="space-y-6">
              {industryNews.map((article) => (
                <Card key={article.id} className="hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl font-semibold text-foreground leading-tight">{article.title}</h3>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{article.excerpt}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(article.publishDate).toLocaleDateString()}
                          </div>
                          <span className="text-sm text-muted-foreground">{article.readTime}</span>
                          <span className="text-sm text-muted-foreground">By {article.author}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                <Tag className="mr-1 w-3 h-3" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => handleNewsRead(article.id, article.title)}
                            data-testid={`button-read-${article.id}`}
                          >
                            Read Article
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Professional Tools & Calculators</h2>
              <p className="text-lg text-muted-foreground">
                Engineering tools and calculators for HVAC system design and analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Load Calculator</h3>
                  <p className="text-muted-foreground mb-4">Calculate heating and cooling loads for commercial buildings</p>
                  <Button variant="outline" data-testid="button-load-calculator">
                    Launch Calculator
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Pipe Sizing Tool</h3>
                  <p className="text-muted-foreground mb-4">Determine optimal pipe sizes for refrigeration systems</p>
                  <Button variant="outline" data-testid="button-pipe-sizing">
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Pressure Drop Calculator</h3>
                  <p className="text-muted-foreground mb-4">Calculate pressure drops in piping systems</p>
                  <Button variant="outline" data-testid="button-pressure-calculator">
                    Launch Calculator
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}