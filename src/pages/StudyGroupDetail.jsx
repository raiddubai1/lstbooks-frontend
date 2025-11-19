import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Plus, UserPlus, UserMinus, Lock, Copy, Check, MapPin, Video, Clock } from 'lucide-react';
import SessionModal from '../components/SessionModal';

const StudyGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/study-groups/${id}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching study group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (group.isPrivate) {
      const inviteCode = prompt('Enter invite code:');
      if (!inviteCode) return;

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/study-groups/${id}/join`, { inviteCode });
        fetchGroup();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to join group');
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/study-groups/${id}/join`);
        fetchGroup();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to join group');
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/study-groups/${id}/leave`);
      navigate('/study-groups');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to leave group');
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/study-groups/${id}/sessions`, sessionData);
      setIsSessionModalOpen(false);
      fetchGroup();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleRSVP = async (sessionId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/study-groups/${id}/sessions/${sessionId}/rsvp`);
      fetchGroup();
    } catch (error) {
      console.error('Error RSVP to session:', error);
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setInviteCodeCopied(true);
    setTimeout(() => setInviteCodeCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-gray-400">Study group not found</p>
      </div>
    );
  }

  const isMember = group.members?.some(m => m.user._id === currentUser._id);
  const currentMember = group.members?.find(m => m.user._id === currentUser._id);
  const isAdmin = currentMember?.role === 'admin';
  const upcomingSessions = group.sessions?.filter(s => new Date(s.scheduledAt) > new Date()).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)) || [];
  const pastSessions = group.sessions?.filter(s => new Date(s.scheduledAt) <= new Date()).sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/study-groups')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Study Groups
        </button>

        {/* Group Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h1>
                {group.isPrivate && (
                  <Lock className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {group.description}
              </p>
              <div className="flex items-center gap-4">
                {group.subject && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                    {group.subject.name}
                  </span>
                )}
                {group.year && (
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    {group.year.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {!isMember ? (
                <button
                  onClick={handleJoinGroup}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Join Group
                </button>
              ) : (
                <>
                  {group.creator._id !== currentUser._id && (
                    <button
                      onClick={handleLeaveGroup}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <UserMinus className="w-5 h-5" />
                      Leave Group
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Invite Code */}
          {isMember && group.isPrivate && group.inviteCode && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                    Invite Code
                  </p>
                  <p className="text-lg font-mono text-yellow-900 dark:text-yellow-200">
                    {group.inviteCode}
                  </p>
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="px-4 py-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  {inviteCodeCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {group.members?.length || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {upcomingSessions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pastSessions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Past Sessions</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Upcoming Sessions
                </h2>
                {isMember && (
                  <button
                    onClick={() => setIsSessionModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Session
                  </button>
                )}
              </div>

              {upcomingSessions.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No upcoming sessions scheduled.
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      isMember={isMember}
                      currentUserId={currentUser._id}
                      onRSVP={() => handleRSVP(session._id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Past Sessions
                </h2>
                <div className="space-y-4">
                  {pastSessions.slice(0, 5).map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                      isMember={isMember}
                      currentUserId={currentUser._id}
                      isPast={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Members */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Members ({group.members?.length || 0})
            </h2>
            <div className="space-y-3">
              {group.members?.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {member.user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.user.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.role === 'admin'
                      ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                      : member.role === 'moderator'
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Session Modal */}
      {isSessionModalOpen && (
        <SessionModal
          onSave={handleCreateSession}
          onClose={() => setIsSessionModalOpen(false)}
        />
      )}
    </div>
  );
};

const SessionCard = ({ session, isMember, currentUserId, onRSVP, isPast = false }) => {
  const isAttending = session.attendees?.some(a => a._id === currentUserId);

  return (
    <div className={`border-2 rounded-lg p-4 ${
      isPast
        ? 'border-gray-200 dark:border-gray-700 opacity-75'
        : 'border-blue-200 dark:border-blue-700'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {session.title}
          </h3>
          {session.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {session.description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(session.scheduledAt).toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {session.duration} minutes
        </div>
        {session.isOnline && session.meetingLink ? (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Join Online
            </a>
          </div>
        ) : session.location ? (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {session.location}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {session.attendees?.length || 0} attending
        </span>
        {isMember && !isPast && (
          <button
            onClick={onRSVP}
            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
              isAttending
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
            }`}
          >
            {isAttending ? 'Attending' : 'RSVP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyGroupDetail;

