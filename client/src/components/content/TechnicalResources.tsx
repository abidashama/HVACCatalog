import { useState } from 'react'
import { Download, FileText, PlayCircle, BookOpen, Wrench, Shield, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TechnicalDocument {
  id: string
  title: string
  description: string
  type: 'catalog' | 'manual' | 'guide' | 'datasheet' | 'video' | 'certification'
  category: string
  fileSize?: string
  pages?: number
  duration?: string
  downloadCount: number
  featured?: boolean
  new?: boolean
  url?: string
}

const technicalDocuments: TechnicalDocument[] = [
  // Catalogs
  {
    id: 'cat-1',
    title: 'Lefoo Pressure Switches Complete Catalog',
    description: 'Comprehensive catalog of all Lefoo pressure switch models with specifications, wiring diagrams, and application guidelines.',
    type: 'catalog',
    category: 'Pressure Switches',
    fileSize: '12.8 MB',
    pages: 64,
    downloadCount: 1247,
    featured: true
  },
  {
    id: 'cat-2',
    title: 'Heat Exchanger Selection Guide',
    description: 'Technical guide for selecting the right heat exchanger for your application with sizing calculations and performance data.',
    type: 'catalog',
    category: 'Heat Exchangers',
    fileSize: '8.2 MB',
    pages: 32,
    downloadCount: 892,
    featured: true
  },
  {
    id: 'cat-3',
    title: 'Commercial Refrigeration Components Catalog',
    description: 'Complete product catalog for commercial refrigeration components including compressors, condensers, and controls.',
    type: 'catalog',
    category: 'Refrigeration',
    fileSize: '15.4 MB',
    pages: 84,
    downloadCount: 673
  },

  // Installation Manuals
  {
    id: 'man-1',
    title: 'LF55 Series Installation Manual',
    description: 'Step-by-step installation instructions for LF55 pressure switches with safety guidelines and troubleshooting.',
    type: 'manual',
    category: 'Pressure Switches',
    fileSize: '3.2 MB',
    pages: 16,
    downloadCount: 1156,
    new: true
  },
  {
    id: 'man-2',
    title: 'Plate Heat Exchanger Installation Guide',
    description: 'Professional installation guide for plate heat exchangers including piping connections and maintenance procedures.',
    type: 'manual',
    category: 'Heat Exchangers',
    fileSize: '4.7 MB',
    pages: 24,
    downloadCount: 698
  },

  // Technical Guides
  {
    id: 'guide-1',
    title: 'HVAC System Design Best Practices',
    description: 'Engineering guide covering best practices for HVAC system design, component selection, and optimization.',
    type: 'guide',
    category: 'General',
    fileSize: '6.8 MB',
    pages: 48,
    downloadCount: 2134,
    featured: true
  },
  {
    id: 'guide-2',
    title: 'Refrigeration Troubleshooting Guide',
    description: 'Comprehensive troubleshooting guide for common refrigeration system issues with diagnostic flowcharts.',
    type: 'guide',
    category: 'Refrigeration',
    fileSize: '5.1 MB',
    pages: 36,
    downloadCount: 1892
  },

  // Data Sheets
  {
    id: 'ds-1',
    title: 'LF5532 Technical Data Sheet',
    description: 'Detailed technical specifications, performance curves, and application data for the LF5532 pressure switch.',
    type: 'datasheet',
    category: 'Pressure Switches',
    fileSize: '890 KB',
    pages: 4,
    downloadCount: 567
  },
  {
    id: 'ds-2',
    title: 'PHE-20 Heat Exchanger Specifications',
    description: 'Complete technical specifications and performance data for the PHE-20 plate heat exchanger.',
    type: 'datasheet',
    category: 'Heat Exchangers',
    fileSize: '1.2 MB',
    pages: 6,
    downloadCount: 423
  },

  // Video Content
  {
    id: 'vid-1',
    title: 'Pressure Switch Installation Video Series',
    description: 'Professional video series showing proper installation techniques for different pressure switch models.',
    type: 'video',
    category: 'Pressure Switches',
    duration: '15 minutes',
    downloadCount: 1834,
    featured: true
  },
  {
    id: 'vid-2',
    title: 'Heat Exchanger Maintenance Procedures',
    description: 'Video guide covering proper maintenance procedures for plate heat exchangers to maximize performance.',
    type: 'video',
    category: 'Heat Exchangers',
    duration: '12 minutes',
    downloadCount: 967
  },

  // Certifications
  {
    id: 'cert-1',
    title: 'EPA Certification Documentation',
    description: 'Official EPA certification documents for all refrigerant handling and equipment sales activities.',
    type: 'certification',
    category: 'Certifications',
    fileSize: '2.1 MB',
    pages: 8,
    downloadCount: 456
  },
  {
    id: 'cert-2',
    title: 'ISO 9001:2015 Quality Certificate',
    description: 'Current ISO 9001:2015 quality management system certification and compliance documentation.',
    type: 'certification',
    category: 'Certifications',
    fileSize: '1.8 MB',
    pages: 6,
    downloadCount: 234
  }
]

const documentTypes = {
  catalog: { icon: BookOpen, label: 'Catalogs', color: 'bg-blue-500' },
  manual: { icon: Wrench, label: 'Installation Manuals', color: 'bg-green-500' },
  guide: { icon: FileText, label: 'Technical Guides', color: 'bg-purple-500' },
  datasheet: { icon: FileText, label: 'Data Sheets', color: 'bg-orange-500' },
  video: { icon: PlayCircle, label: 'Video Resources', color: 'bg-red-500' },
  certification: { icon: Shield, label: 'Certifications', color: 'bg-indigo-500' }
}

export default function TechnicalResources() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeType, setActiveType] = useState('all')

  const filteredDocuments = technicalDocuments.filter(doc => {
    if (activeCategory !== 'all' && doc.category !== activeCategory) return false
    if (activeType !== 'all' && doc.type !== activeType) return false
    return true
  })

  const categories = ['all', ...Array.from(new Set(technicalDocuments.map(doc => doc.category)))]
  const types = ['all', ...Object.keys(documentTypes)]

  const handleDownload = (document: TechnicalDocument) => {
    console.log(`Downloading: ${document.title}`)
    // In real implementation, this would track downloads and serve the file
  }

  const featuredDocuments = technicalDocuments.filter(doc => doc.featured)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Technical Resources
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Access comprehensive technical documentation, installation guides, and professional resources 
          to support your HVAC and refrigeration projects.
        </p>
      </div>

      {/* Featured Resources */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Featured Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDocuments.map((document) => {
            const typeConfig = documentTypes[document.type]
            const IconComponent = typeConfig.icon
            
            return (
              <Card key={document.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${typeConfig.color} text-white rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {document.description}
                  </p>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{typeConfig.label}</span>
                    <span>
                      {document.fileSize && `${document.fileSize}`}
                      {document.pages && ` • ${document.pages} pages`}
                      {document.duration && ` • ${document.duration}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{document.downloadCount} downloads</span>
                    <Badge variant="outline" className="text-xs">
                      {document.category}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleDownload(document)}
                    data-testid={`download-${document.id}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* All Resources */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">All Resources</h2>
        
        {/* Filters */}
        <Tabs defaultValue="category" className="mb-6">
          <TabsList>
            <TabsTrigger value="category" data-testid="filter-by-category">By Category</TabsTrigger>
            <TabsTrigger value="type" data-testid="filter-by-type">By Type</TabsTrigger>
          </TabsList>
          
          <TabsContent value="category" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  data-testid={`filter-category-${category}`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="type" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={activeType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveType(type)}
                  data-testid={`filter-type-${type}`}
                >
                  {type === 'all' ? 'All Types' : documentTypes[type as keyof typeof documentTypes]?.label || type}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const typeConfig = documentTypes[document.type]
            const IconComponent = typeConfig.icon
            
            return (
              <Card key={document.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-8 h-8 ${typeConfig.color} text-white rounded flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    {document.new && (
                      <Badge className="bg-green-500 text-white text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-2">{document.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {document.description}
                  </p>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {document.fileSize && `${document.fileSize}`}
                      {document.pages && ` • ${document.pages} pages`}
                      {document.duration && ` • ${document.duration}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {document.downloadCount} downloads
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {document.category}
                    </Badge>
                  </div>
                  
                  <Button 
                    size="sm"
                    className="w-full" 
                    onClick={() => handleDownload(document)}
                    data-testid={`download-${document.id}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more resources.</p>
          </div>
        )}
      </section>

      {/* Help Section */}
      <section className="bg-muted/50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold text-foreground mb-4">Need Additional Technical Support?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our technical team is available to provide personalized support for your specific application requirements. 
          Contact us for custom documentation or engineering assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button data-testid="button-contact-technical">
            Contact Technical Support
          </Button>
          <Button variant="outline" data-testid="button-request-docs">
            Request Custom Documentation
          </Button>
        </div>
      </section>
    </div>
  )
}