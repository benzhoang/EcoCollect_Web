import React, { useState } from 'react'
import { 
  FaArrowLeft, 
  FaShieldAlt, 
  FaInfoCircle, 
  FaFileAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaCircle,
  FaDownload,
  FaCalendarAlt,
  FaWeight,
  FaChevronDown
} from 'react-icons/fa'

const AccountDetailPage = () => {
  const [suspensionType, setSuspensionType] = useState('temporary')
  const [duration, setDuration] = useState('30')
  const [reason, setReason] = useState('')
  const [justification, setJustification] = useState('')

  // Sample data
  const user = {
    name: 'John Doe',
    username: '@johndoe123',
    id: '#884920',
    joinedDate: 'Oct 2022',
    recycled: '1240kg',
    status: 'Active Account',
    email: 'j***@example.com',
    tokens: '450',
    pendingRequests: 2
  }

  const history = [
    {
      type: 'warning',
      title: 'Warning Issued',
      date: '2 days ago',
      description: 'Suspiciously high volume of plastic recycling reported within 2 hours.',
      admin: 'MINH NGUYỄN',
      adminInitials: 'MN'
    },
    {
      type: 'verified',
      title: 'Account Verified',
      date: 'Oct 14, 2022',
      description: 'Identity documents approved manually.',
      subDescription: 'Standard Verification Process'
    },
    {
      type: 'created',
      title: 'Account Created',
      date: 'Oct 12, 2022',
      description: 'No additional notes recorded.'
    }
  ]

  const getHistoryIcon = (type) => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="text-orange-500" />
      case 'verified':
        return <FaCheckCircle className="text-green-500" />
      case 'created':
        return <FaCircle className="text-blue-500" />
      default:
        return <FaCircle className="text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6">
      {/* Back Button */}
      <button className="flex items-center self-start gap-2 text-gray-700 transition-colors hover:text-gray-900" onClick={ () => {
        window.history.pushState({}, '', `/admin/account/citizens`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}>
        <FaArrowLeft />
        <span>Quay lại</span>
      </button>

      {/* Main Content - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* User Profile Summary Card */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-4">
              {/* Avatar Badge */}
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-green-600 rounded-lg">
                  JD
                </div>
                <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="mb-1 text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="mb-3 text-sm font-medium text-green-600">TRUSTED CONTRIBUTOR</p>
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span>{user.id}</span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-xs" />
                    Joined {user.joinedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaWeight className="text-xs" />
                    {user.recycled} Recycled
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <p className="mb-1 text-xs text-gray-500">CURRENT STATUS</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700 rounded-full bg-green-50">
                  <FaCheckCircle className="text-xs" />
                  {user.status}
                </div>
              </div>
            </div>
          </div>

          {/* Restrict Account Access Section */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FaShieldAlt className="text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Restrict Account Access</h3>
            </div>
            <p className="mb-6 text-sm text-gray-600">Apply restrictions based on policy violations.</p>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Primary Reason */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                  PRIMARY REASON
                </label>
                <div className="relative">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a reason...</option>
                    <option value="violation">Policy Violation</option>
                    <option value="fraud">Fraudulent Activity</option>
                    <option value="spam">Spam Content</option>
                  </select>
                  <FaChevronDown className="absolute text-sm text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2" />
                </div>
              </div>

              {/* Suspension Type */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                  SUSPENSION TYPE
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSuspensionType('temporary')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      suspensionType === 'temporary'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Temporary
                  </button>
                  <button
                    onClick={() => setSuspensionType('permanent')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      suspensionType === 'permanent'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Permanent
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                  DURATION (DAYS)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Administrative Justification */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-gray-700 uppercase">
                  ADMINISTRATIVE JUSTIFICATION
                </label>
                <textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Enter detailed reasoning for this administrative action... This will be visible to other admins."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700">
                Confirm Suspension
              </button>
              <button className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </div>

          {/* Impact Analysis Section */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaInfoCircle className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Impact Analysis</h3>
            </div>
            <p className="text-sm text-gray-700">
              Suspending this account will immediately freeze{' '}
              <span className="font-semibold text-orange-600">{user.tokens} ECO-tokens</span>
              {' '}and cancel {user.pendingRequests} pending collection requests. The user will be notified via registered email: {user.email}
            </p>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="lg:col-span-1">
          {/* Administrative History Section */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Administrative History</h3>
              </div>
              <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                DOWNLOAD REPORT
              </button>
            </div>

            {/* History Timeline */}
            <div className="space-y-6">
              {history.map((item, index) => (
                <div key={index} className="relative pl-8">
                  {/* Timeline Line */}
                  {index < history.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Icon */}
                  <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-6">
                    {getHistoryIcon(item.type)}
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">{item.title}</h4>
                    <p className="mb-2 text-xs text-gray-500">{item.date}</p>
                    <p className="mb-2 text-sm text-gray-700">{item.description}</p>
                    {item.subDescription && (
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <FaCheckCircle className="text-xs" />
                        <span>{item.subDescription}</span>
                      </div>
                    )}
                    {item.admin && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                          {item.adminInitials}
                        </div>
                        <span className="text-xs text-gray-600">ADMIN: {item.admin}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* End of History */}
              <div className="pt-4 text-xs text-center text-gray-400">
                END OF HISTORY LOG
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountDetailPage
