import { useState } from 'react';
import Modal from 'react-modal';

// Helper function to format time to 12-hour AM/PM format with full date
const formatTime = (dateString) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    hour12: true 
  };
  return new Date(dateString).toLocaleString('en-US', options);
};

// Helper function to calculate meeting duration
const calculateDuration = (start, end) => {
  const startTime = new Date(start);
  const endTime = new Date(end);
  const durationMs = endTime - startTime;

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.ceil((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours} hour(s) ${minutes} minute(s)`;
};

const reportTypes = [
    { value: 'normal', label: 'General Report' },
    { value: 'speaker_ranking', label: 'Speaker Report' },
    { value: 'sentiment', label: 'Sentiment Report' },
    { value: 'interval', label: 'Interval Based Report' }
  ];
  
  const reportFormats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'DOCX' }
  ];
  
  // Modal Styles
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      maxWidth: '400px',
      width: '100%',
      borderRadius: '10px',
      backgroundColor: '#111827', // gray-900
      border: '1px solid #374151', // gray-700
      color: '#f9fafb', // gray-50
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Darker transparent background
      zIndex: 1000, // Ensure it stays on top
    },
  };
  const MeetCard = ({ meet }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Move modal state here
    const [reportType, setReportType] = useState('');
    const [reportFormat, setReportFormat] = useState('');
    const [meetingTitle, setMeetingTitle] = useState(meet.meetingTitle); // Use meet title from props
    const [loading, setLoading] = useState(false);
    const [interval, setInterval]=useState(undefined)
    const [error, setError] = useState(null);
    const [emails, setEmails] = useState(['']); // Start with one empty email field

    const addEmail = () => {
        setEmails([...emails, '']); // Add a new empty email input
    };
    
    const removeEmail = (index) => {
        const newEmails = emails.filter((_, i) => i !== index); // Remove the selected email
        setEmails(newEmails);
    };
    
    const handleEmailChange = (e, index) => {
        const newEmails = [...emails];
        newEmails[index] = e.target.value; // Update the email at the given index
        setEmails(newEmails);
    };
    
  
    const openModal = () => {
      setIsModalOpen(true);
      setMeetingTitle(meet.meetingTitle); // Ensure the correct title is set when modal opens
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setMeetingTitle(meet.meetingTitle); // Reset title when modal closes
    };
  
    const handleGenerateReport = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
        console.log(emails)
      const payload = {
        meeting_title: meetingTitle,
        report_type: reportType,
        report_format: reportFormat,
        meeting_id: meet._id,
        report_interval: interval,
        emails
      };

      if(interval) payload[interval]=interval
  
      try {
        const response = await fetch('/api/get-report', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate report');
        }
  
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement('a');
        link.href = url;
        const fileExtension = reportFormat === 'pdf' ? 'pdf' : 'docx';
        link.download = `${meetingTitle.replace(/\s+/g, '_')}_report.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        meet.meetingTitle=meetingTitle
        closeModal();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
        <div className="border border-gray-800 bg-gray-900 shadow-lg rounded-xl p-6 m-4 hover:shadow-2xl hover:shadow-violet-500/20 transition-shadow duration-300">
            <div className="flex flex-row w-full">
                <div className="flex flex-col items-start w-full">
                    <div className='flex flex-col md:flex-row justify-between'>
                        <div >
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent mb-2">{meet.meetingTitle}</h2>
                            <p className="p-1 text-sm text-gray-400">Hosted by <span className="font-semibold text-white">{meet.convenor}</span></p>
                        </div>
                        <div className="mb-2 flex flex-wrap md:w-1/2 md:self-end">
                            <p className="text-sm p-1"><strong className="mb-1 text-violet-400">From:</strong> <span className="text-gray-300">{formatTime(meet.meetingStartTimeStamp)}</span></p><p className="text-sm p-1"> <strong className="text-purple-400">To:</strong> <span className="text-gray-300">{formatTime(meet.meetingEndTimeStamp)}</span></p>
                        </div>
                    </div>

                    <div className="w-full border-b border-gray-700 mb-2"></div>

                    <p className="w-full">
                        <p className="flex flex-wrap justify-between w-full">
                            <p className="text-sm p-1"><strong className="mb-1 text-violet-400">Email:</strong> <span className="text-gray-300">{meet.oceanAiEmail}</span></p><p className="text-sm p-1"> <strong className="text-purple-400">Duration:</strong> <span className="text-gray-300">{calculateDuration(meet.meetingStartTimeStamp, meet.meetingEndTimeStamp)}</span></p>
                        </p>
                    </p>

                    <div className="w-full border-b border-gray-700 mb-2"></div>

                    <p className="w-full">
                        <p className="mb-2 flex flex-wrap justify-between w-full">
                            <p className="text-sm p-1"><strong className="text-gray-400">Speakers:</strong> <span className="text-gray-300">{meet.speakers.length > 0 ? meet.speakers.join(', ') : 'No speakers'}</span></p>
                            <p className="text-sm p-1"><strong className="text-gray-400">Attendees:</strong> <span className="text-gray-300">{meet.attendees.length > 0 ? meet.attendees.join(', ') : 'No attendees'}</span></p>
                        </p>
                    </p>
                <button
                    onClick={openModal}
                    className="mt-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 self-end rounded hover:from-violet-600 hover:to-purple-700 transition-all duration-300"
                >
                    Generate Report
                </button>
                </div>
            </div>
            {/* Modal for Report Generation */}
            <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Generate Report Modal"
>
    <h2 className="text-xl font-bold mb-4 text-white">Generate Report for {meetingTitle}</h2>

    <form onSubmit={handleGenerateReport}>
        {/* Meeting Title */}
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Meeting Title:</label>
            <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded w-full py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
        </div>

        {/* Report Type Dropdown */}
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Type of Report:</label>
            <select
                value={reportType}
                onChange={(e) => {
                    setReportType(e.target.value);
                    setInterval(undefined); // Reset the interval when report type changes
                }}
                className="bg-gray-800 border border-gray-600 rounded w-full py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
            >
                <option value="">Select Report Type</option>
                {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </select>

            {/* Conditional rendering for interval input */}
            {reportType === "interval" && (
                <input
                    type="number"
                    min="1"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded w-full py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent mt-2"
                    placeholder="Enter interval"
                />
            )}
        </div>

        {/* Report Format Dropdown */}
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Choose a Format:</label>
            <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded w-full py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
            >
                <option value="">Select Report Format</option>
                {reportFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                        {format.label}
                    </option>
                ))}
            </select>
        </div>

        {/* Email Input Field */}
        <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Send to these Email Addresses:</label>
            <div className="flex flex-col">
                {emails.map((email, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e, index)}
                            className="bg-gray-800 border border-gray-600 rounded w-full py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent mr-2"
                            placeholder="Enter email"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeEmail(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addEmail}
                    className="mt-2 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-colors"
                >
                    + Add Another Email
                </button>
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
            {error && <p className="text-red-400 mb-4">{error}</p>}

            <button
                type="button"
                className="mr-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                onClick={closeModal}
                disabled={loading}
            >
                Cancel
            </button>
            <button
                type="submit"
                className={`px-4 py-2 bg-violet-600 text-white rounded transition-all duration-300 ${loading ? 'opacity-50' : 'hover:bg-violet-700'}`}
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Report'}
            </button>
        </div>
    </form>
</Modal>

        </div>
    );
};

export default MeetCard;
