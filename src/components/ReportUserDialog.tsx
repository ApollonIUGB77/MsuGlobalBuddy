import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Flag, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { reportUser, blockUser, REPORT_REASONS, type ReportReason } from '../utils/safetyStorage';

interface ReportUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: string;
  reportedUserName: string;
  currentUserId: string;
}

export function ReportUserDialog({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  currentUserId,
}: ReportUserDialogProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [description, setDescription] = useState('');
  const [shouldBlock, setShouldBlock] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) {
      toast.error('Please select a reason');
      return;
    }

    // Report the user
    reportUser(reportedUserId, currentUserId, selectedReason, description);

    // Block the user if requested
    if (shouldBlock) {
      blockUser(currentUserId, reportedUserId, selectedReason);
    }

    toast.success(
      shouldBlock
        ? `${reportedUserName} has been reported and blocked. You won't see them again.`
        : `Thank you for reporting. We'll review this case.`
    );

    // Reset and close
    setSelectedReason('');
    setDescription('');
    setShouldBlock(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="flex items-center space-x-3 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl">Report User</h2>
                <p className="text-sm text-white/80">Help us keep MSU Buddy+ safe</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
            <p className="text-gray-600 mb-6">
              You're reporting <span className="font-semibold text-gray-900">{reportedUserName}</span>
            </p>

            {/* Reason Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3">
                Reason for reporting <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      selectedReason === reason
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedReason === reason
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedReason === reason && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-700">{reason}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide more information about this report..."
                className="w-full h-24 p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none"
              />
            </div>

            {/* Block Option */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={shouldBlock}
                  onChange={(e) => setShouldBlock(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5"
                />
                <div className="ml-3 flex-1">
                  <span className="block text-gray-900 font-medium">
                    Block this user
                  </span>
                  <span className="block text-sm text-gray-600 mt-1">
                    They won't be able to match with you or send you messages
                  </span>
                </div>
              </label>
            </div>

            {/* Safety Notice */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Your safety is our priority</p>
                  <p>
                    All reports are reviewed. If you're in immediate danger, please contact campus
                    security or local authorities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex space-x-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 rounded-xl"
            >
              <Flag className="w-4 h-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
