import { motion } from 'motion/react';
import { MapPin, Mail, Phone, GraduationCap, Globe, Settings, LogOut, Edit, Star, Home, User as UserIcon, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef } from 'react';
import { toast } from 'sonner@2.0.3';

interface ProfilePageProps {
  userData: any;
  userMatchedBuddies?: number;
  userEventsAttended?: number;
  onLogout: () => void;
  onBackToHome?: () => void;
}

export function ProfilePage({ userData, userMatchedBuddies = 0, userEventsAttended = 0, onLogout, onBackToHome }: ProfilePageProps) {
  const interests = userData?.interests || [];
  const languages = userData?.languages || [];
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    localStorage.getItem(`profile_photo_${userData?.id}`) || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate rating based on activity
  const calculateRating = () => {
    if (userMatchedBuddies === 0 && userEventsAttended === 0) return '--';
    // Simple calculation: more buddies and events = higher rating
    const score = (userMatchedBuddies * 0.3 + userEventsAttended * 0.2) / 10;
    return Math.min(5.0, Math.max(0, score)).toFixed(1);
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
        localStorage.setItem(`profile_photo_${userData?.id}`, result);
        toast.success('✓ Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-red-600 to-red-700" />
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile Picture */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                <span className="text-red-600 text-4xl">
                  {userData?.firstName?.[0] || 'D'}
                </span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full border-4 border-white flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-6">
        <div className="text-center mb-6">
          <h1 className="text-gray-900 text-2xl mb-1">
            {userData?.firstName || 'Dorian'} {userData?.lastName || 'Kouadio'}
          </h1>
          <p className="text-gray-600 mb-3">
            {userData?.university || 'Montclair State University'}
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{userData?.country || 'United States'}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="rounded-xl px-6 border-gray-200">
              Share
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-gray-900 text-2xl mb-1">{userMatchedBuddies}</div>
            <div className="text-gray-600">Buddies</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-gray-900 text-2xl mb-1">{userEventsAttended}</div>
            <div className="text-gray-600">Events</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-gray-900 text-2xl mb-1">{calculateRating()}</div>
            <div className="text-gray-600 flex items-center justify-center">
              {userMatchedBuddies === 0 && userEventsAttended === 0 ? null : (
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              )}
              Rating
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h3 className="text-gray-900 mb-3 flex items-center">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <UserIcon className="w-4 h-4 text-red-600" />
            </div>
            About Me
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {userData?.bio ||
              "Hi! I'm a passionate student at MSU, eager to connect with fellow students from around the world. I love exploring new cultures and making meaningful friendships."}
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h3 className="text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{userData?.email || 'dorian.kouadio@msu.edu'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{userData?.phone || '+1 (555) 123-4567'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <span>{userData?.major || 'Computer Science'}</span>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h3 className="text-gray-900 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest: string) => (
              <Badge key={interest} className="bg-red-50 text-red-600 hover:bg-red-100 border-0">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <h3 className="text-gray-900 mb-3 flex items-center">
            <Globe className="w-5 h-5 text-gray-400 mr-2" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((language: string) => (
              <Badge
                key={language}
                variant="outline"
                className="border-gray-200 text-gray-700"
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 mb-6"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>

        {/* Back to Home Button */}
        {onBackToHome && (
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="w-full h-14 rounded-2xl border-gray-200 text-gray-600 hover:bg-gray-100 mb-8"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
}