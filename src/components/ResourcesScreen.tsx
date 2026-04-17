import { motion } from 'motion/react';
import { ChevronLeft, FileText, Video, BookOpen, HelpCircle, ExternalLink } from 'lucide-react';

interface ResourcesScreenProps {
  onBack: () => void;
}

export function ResourcesScreen({ onBack }: ResourcesScreenProps) {
  const resources = [
    {
      id: '1',
      title: 'Student Handbook',
      description: 'Essential information for international students',
      icon: BookOpen,
      category: 'Guide',
      color: 'blue',
      url: 'https://www.montclair.edu/dean-of-students/',
    },
    {
      id: '2',
      title: 'Campus Map',
      description: 'Navigate MSU campus with ease',
      icon: FileText,
      category: 'Resource',
      color: 'green',
      url: 'https://www.montclair.edu/campus-map/',
    },
    {
      id: '3',
      title: 'Campus Transportation',
      description: 'Shuttle schedules and parking information',
      icon: Video,
      category: 'Resource',
      color: 'purple',
      url: 'https://www.montclair.edu/facilities/our-services/shuttle-services/',
    },
    {
      id: '4',
      title: 'Academic Calendar',
      description: 'Important dates and deadlines',
      icon: HelpCircle,
      category: 'Support',
      color: 'red',
      url: 'https://www.montclair.edu/academics/academic-calendar/',
    },
    {
      id: '5',
      title: 'Library Resources',
      description: 'Access Sprague Library resources and services',
      icon: BookOpen,
      category: 'Academic',
      color: 'blue',
      url: 'https://library.montclair.edu/',
    },
    {
      id: '6',
      title: 'Career Services',
      description: 'Career counseling and job opportunities',
      icon: FileText,
      category: 'Career',
      color: 'green',
      url: 'https://www.montclair.edu/career-services/',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  };

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-8 pt-6 pb-4">
        <button
          onClick={onBack}
          className="flex items-center text-red-600 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-red-600">Resources</h1>
        <p className="text-gray-600 mt-2">Essential links and guides for MSU students</p>
      </div>

      {/* Resources List */}
      <div className="flex-1 px-8 pb-8 space-y-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          const colorClass = colorMap[resource.color as keyof typeof colorMap];
          
          return (
            <motion.button
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleResourceClick(resource.url)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-red-200 transition-all text-left"
            >
              <div className="flex items-start space-x-4">
                <div className={`${colorClass} rounded-xl p-3 flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900">{resource.title}</h3>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">{resource.description}</p>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {resource.category}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}