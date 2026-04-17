import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, GraduationCap, Globe, Phone, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface RegisterScreenProps {
  onRegister: (data: any) => void;
  onBackToLogin: () => void;
}

export function RegisterScreen({ onRegister, onBackToLogin }: RegisterScreenProps) {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Interests & Languages
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
    country: '',
    major: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Step 2 data
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese',
    'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Hindi'
  ];

  const interests = [
    'Sports', 'Music', 'Art', 'Gaming', 'Reading', 'Travel',
    'Cooking', 'Photography', 'Technology', 'Fashion', 'Movies', 'Fitness'
  ];

  const studyYears = [
    'Freshman',
    'Sophomore', 
    'Junior',
    'Senior',
    'Graduate Student',
    'PhD Student'
  ];

  const goals = [
    'Make new friends',
    'Practice languages',
    'Study together',
    'Explore campus',
    'Attend events',
    'Career networking',
    'Cultural exchange',
    'Find roommate'
  ];

  const handleNext = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    onRegister({
      ...formData,
      languages: selectedLanguages,
      interests: selectedInterests,
      year: selectedYear,
      goals: selectedGoals,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  if (step === 2) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="h-full w-full flex flex-col bg-white overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 pt-12 pb-8 px-8 rounded-b-[3rem] sticky top-0 z-10">
          <button
            onClick={() => setStep(1)}
            className="text-white hover:bg-white/20 rounded-full p-2 mb-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-white text-3xl mb-2">Tell Us About You</h1>
            <p className="text-red-100">Help us find your perfect buddy</p>
          </motion.div>
        </div>

        {/* Interests & Languages Form */}
        <div className="flex-1 px-8 pt-8 pb-8">
          <div className="space-y-6">
            {/* Languages */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-gray-900 mb-3 block">
                Languages You Speak *
              </Label>
              <p className="text-gray-600 mb-4">Select all that apply</p>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedLanguages.includes(language)
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-4"
            >
              <Label className="text-gray-900 mb-3 block">
                Your Interests *
              </Label>
              <p className="text-gray-600 mb-4">Select what you're interested in</p>
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedInterests.includes(interest)
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Study Year */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <Label className="text-gray-900 mb-3 block">
                Your Study Year *
              </Label>
              <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value)}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {studyYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Label className="text-gray-900 mb-3 block">
                Your Goals *
              </Label>
              <p className="text-gray-600 mb-4">Select what you're looking to achieve</p>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-3 rounded-xl border-2 transition-all ${
                      selectedGoals.includes(goal)
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="pt-6"
            >
              <Button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl"
              >
                Complete Registration
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="h-full w-full flex flex-col bg-white overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 pt-12 pb-8 px-8 rounded-b-[3rem] sticky top-0 z-10">
        <button
          onClick={onBackToLogin}
          className="text-white hover:bg-white/20 rounded-full p-2 mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-white text-3xl mb-2">Create Account</h1>
          <p className="text-red-100">Join MSU Global Buddy+ today</p>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 px-8 pt-8 pb-8">
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5">
          {/* Personal Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700 mb-2 block">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700 mb-2 block">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@msu.edu"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Academic Information */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-5 pt-4"
          >
            <h3 className="text-gray-900">Academic Information</h3>

            <div>
              <Label htmlFor="university" className="text-gray-700 mb-2 block">
                University
              </Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="university"
                  placeholder="Montclair State University"
                  value={formData.university}
                  onChange={(e) => updateField('university', e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentId" className="text-gray-700 mb-2 block">
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  placeholder="123456789"
                  value={formData.studentId}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  className="h-12 rounded-xl border-gray-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-gray-700 mb-2 block">
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => updateField('country', value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="in">India</SelectItem>
                    <SelectItem value="cn">China</SelectItem>
                    <SelectItem value="jp">Japan</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="major" className="text-gray-700 mb-2 block">
                Major / Field of Study
              </Label>
              <Input
                id="major"
                placeholder="Computer Science"
                value={formData.major}
                onChange={(e) => updateField('major', e.target.value)}
                className="h-12 rounded-xl border-gray-200"
                required
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-5 pt-4"
          >
            <h3 className="text-gray-900">Create Password</h3>

            <div>
              <Label htmlFor="password" className="text-gray-700 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-4"
          >
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                required
              />
              <span className="text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-red-600 hover:text-red-700">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-red-600 hover:text-red-700">
                  Privacy Policy
                </button>
              </span>
            </label>
          </motion.div>

          {/* Next Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl flex items-center justify-center"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center pb-8"
        >
          <p className="text-gray-600">
            Already have an account?{' '}
            <button onClick={onBackToLogin} className="text-red-600 hover:text-red-700">
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}