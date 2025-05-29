import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Database, Clock, TrendingUp, AlertCircle, CheckCircle, Download, FileText, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('2025-03-26');
  const [endDate, setEndDate] = useState('2025-04-24');
  
  // Data
  const stateData = [
    {
      state: 'Telangana',
      totalProjects: 63,
      reraTotal: 9549,
      projectsProcessed: 59,
      ltDataFetched: 55,
      casemineDataFetched: 19,
      attachmentsDownloaded: 58,
      reraDataAvailability: 93.7,
      completeDataCoverage: 7.9,
      missingReraData: 4
    },
    {
      state: 'Karnataka',
      totalProjects: 38,
      reraTotal: 8582,
      projectsProcessed: 37,
      ltDataFetched: 1,
      casemineDataFetched: 8,
      attachmentsDownloaded: 1,
      reraDataAvailability: 84.2,
      completeDataCoverage: 0,
      missingReraData: 6
    }
  ];

  // Timeline data per state
  const allTimelineData = {
    telangana: [
      { date: '2025-03-26', projects: 2 },
      { date: '2025-03-30', projects: 2 },
      { date: '2025-04-05', projects: 4 },
      { date: '2025-04-10', projects: 3 },
      { date: '2025-04-15', projects: 2 },
      { date: '2025-04-20', projects: 3 },
      { date: '2025-04-24', projects: 2 }
    ],
    karnataka: [
      { date: '2025-03-26', projects: 0 },
      { date: '2025-03-30', projects: 1 },
      { date: '2025-04-05', projects: 1 },
      { date: '2025-04-10', projects: 1 },
      { date: '2025-04-15', projects: 1 },
      { date: '2025-04-20', projects: 1 },
      { date: '2025-04-24', projects: 1 }
    ],
    all: [
      { date: '2025-03-26', projects: 2 },
      { date: '2025-03-30', projects: 3 },
      { date: '2025-04-05', projects: 5 },
      { date: '2025-04-10', projects: 4 },
      { date: '2025-04-15', projects: 3 },
      { date: '2025-04-20', projects: 4 },
      { date: '2025-04-24', projects: 3 }
    ]
  };

  // Performance data per state
  const performanceDataByState = {
    telangana: [
      { process: 'LT', time: 18500, avgTime: 336.36 },
      { process: 'Casemine', time: 1900, avgTime: 100.0 },
      { process: 'RERA', time: 2750, avgTime: 46.61 },
      { process: 'Attachments', time: 580, avgTime: 10.0 }
    ],
    karnataka: [
      { process: 'LT', time: 929, avgTime: 929.0 },
      { process: 'Casemine', time: 804, avgTime: 100.5 },
      { process: 'RERA', time: 1481, avgTime: 40.03 },
      { process: 'Attachments', time: 10, avgTime: 10.0 }
    ],
    all: [
      { process: 'LT', time: 19429, avgTime: 353.25 },
      { process: 'Casemine', time: 2704, avgTime: 100.15 },
      { process: 'RERA', time: 4231, avgTime: 46.49 },
      { process: 'Attachments', time: 590, avgTime: 10.0 }
    ]
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Filter timeline data based on date range
  const getFilteredTimelineData = (data) => {
    if (dateRange === 'all') return data;
    
    let start, end;
    const today = new Date('2025-04-24'); // Using the end date from the data range
    
    if (dateRange === 'custom') {
      start = new Date(startDate);
      end = new Date(endDate);
    } else if (dateRange === 'last7') {
      start = new Date(today);
      start.setDate(start.getDate() - 7);
      end = today;
    } else if (dateRange === 'last30') {
      start = new Date(today);
      start.setDate(start.getDate() - 30);
      end = today;
    } else {
      return data;
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  // Filtered data based on selection
  const filteredStateData = useMemo(() => {
    if (selectedState === 'all') return stateData;
    return stateData.filter(s => s.state.toLowerCase() === selectedState);
  }, [selectedState]);

  const coverageData = useMemo(() => {
    if (selectedState === 'all') {
      return [
        { name: 'LT Data', telangana: 87.3, karnataka: 2.6 },
        { name: 'Casemine', telangana: 30.2, karnataka: 21.1 },
        { name: 'Attachments', telangana: 92.1, karnataka: 2.6 },
        { name: 'RERA Data', telangana: 93.7, karnataka: 84.2 }
      ];
    } else if (selectedState === 'telangana') {
      return [
        { name: 'LT Data', value: 87.3 },
        { name: 'Casemine', value: 30.2 },
        { name: 'Attachments', value: 92.1 },
        { name: 'RERA Data', value: 93.7 }
      ];
    } else {
      return [
        { name: 'LT Data', value: 2.6 },
        { name: 'Casemine', value: 21.1 },
        { name: 'Attachments', value: 2.6 },
        { name: 'RERA Data', value: 84.2 }
      ];
    }
  }, [selectedState]);

  // Calculate totals based on filtered data
  const totals = useMemo(() => {
    // Get filtered timeline data to calculate totals from date-filtered projects
    const filteredTimeline = getFilteredTimelineData(allTimelineData[selectedState] || allTimelineData.all);
    const totalProjectsFromTimeline = filteredTimeline.reduce((acc, item) => acc + item.projects, 0);
    
    // If date filtering is active, calculate proportional values based on timeline data
    if (dateRange !== 'all' && totalProjectsFromTimeline > 0) {
      const allTimeline = allTimelineData[selectedState] || allTimelineData.all;
      const totalProjectsAll = allTimeline.reduce((acc, item) => acc + item.projects, 0);
      const ratio = totalProjectsFromTimeline / totalProjectsAll;
      
      const filtered = filteredStateData;
      return {
        projects: Math.round(filtered.reduce((acc, s) => acc + s.totalProjects, 0) * ratio),
        processed: Math.round(filtered.reduce((acc, s) => acc + s.projectsProcessed, 0) * ratio),
        ltData: Math.round(filtered.reduce((acc, s) => acc + s.ltDataFetched, 0) * ratio),
        casemineData: Math.round(filtered.reduce((acc, s) => acc + s.casemineDataFetched, 0) * ratio),
        attachments: Math.round(filtered.reduce((acc, s) => acc + s.attachmentsDownloaded, 0) * ratio),
        avgProcessingTime: selectedState === 'telangana' ? 248.47 : selectedState === 'karnataka' ? 287.68 : 261.03,
        totalProcessingTime: Math.round((selectedState === 'telangana' ? 14660 : selectedState === 'karnataka' ? 10644 : 26364) * ratio)
      };
    } else {
      // No date filtering or no data in range - use full values
      const filtered = filteredStateData;
      return {
        projects: filtered.reduce((acc, s) => acc + s.totalProjects, 0),
        processed: filtered.reduce((acc, s) => acc + s.projectsProcessed, 0),
        ltData: filtered.reduce((acc, s) => acc + s.ltDataFetched, 0),
        casemineData: filtered.reduce((acc, s) => acc + s.casemineDataFetched, 0),
        attachments: filtered.reduce((acc, s) => acc + s.attachmentsDownloaded, 0),
        avgProcessingTime: selectedState === 'telangana' ? 248.47 : selectedState === 'karnataka' ? 287.68 : 261.03,
        totalProcessingTime: selectedState === 'telangana' ? 14660 : selectedState === 'karnataka' ? 10644 : 26364
      };
    }
  }, [filteredStateData, selectedState, dateRange, startDate, endDate]);

  // Get timeline data based on selection and date filter
  const timelineData = getFilteredTimelineData(allTimelineData[selectedState] || allTimelineData.all);
  
  // Get performance data based on selection
  const performanceData = performanceDataByState[selectedState] || performanceDataByState.all;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Extraction Process Monitor</h1>
          <p className="text-gray-600">Real-time monitoring of data extraction across states</p>
          
          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-4">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All States</option>
                <option value="telangana">Telangana</option>
                <option value="karnataka">Karnataka</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="custom">Custom Range</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totals.projects}</h3>
            <p className="text-sm text-gray-600 mt-1">Projects Found</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Processed</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totals.processed}</h3>
            <p className="text-sm text-gray-600 mt-1">Projects Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">Performance</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totals.avgProcessingTime.toFixed(2)}s</h3>
            <p className="text-sm text-gray-600 mt-1">Avg Processing Time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Daily Avg</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedState === 'telangana' ? '2.0' : selectedState === 'karnataka' ? '1.3' : '3.5'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Projects/Day</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* State Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedState === 'all' ? 'State-wise Project Distribution' : `${filteredStateData[0]?.state} Project Details`}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalProjects" fill="#3b82f6" name="Total Projects" />
                <Bar dataKey="projectsProcessed" fill="#10b981" name="Processed" />
                <Bar dataKey="ltDataFetched" fill="#f59e0b" name="LT Data" />
                <Bar dataKey="casemineDataFetched" fill="#ef4444" name="Casemine" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Coverage Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Source Coverage (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
              {selectedState === 'all' ? (
                <BarChart data={coverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="telangana" fill="#3b82f6" name="Telangana" />
                  <Bar dataKey="karnataka" fill="#10b981" name="Karnataka" />
                </BarChart>
              ) : (
                <BarChart data={coverageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" name="Coverage %" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Process Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="time"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Data Quality */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Metrics</h2>
            <div className="space-y-4">
              {filteredStateData.map((state) => (
                <div key={state.state} className="space-y-2">
                  <h3 className="font-medium text-gray-700">{state.state}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">RERA Availability</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${state.reraDataAvailability}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{state.reraDataAvailability}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Complete Coverage</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${state.completeDataCoverage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{state.completeDataCoverage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Missing RERA</span>
                      <span className="text-sm font-medium text-red-600">{state.missingReraData} projects</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Processing Trend
              {dateRange !== 'all' && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (Filtered: {dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange})
                </span>
              )}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Source Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Source Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">LT Data</span>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{totals.ltData}</p>
              <p className="text-sm text-gray-600">Projects fetched</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Casemine</span>
                <Database className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-green-600">{totals.casemineData}</p>
              <p className="text-sm text-gray-600">Projects fetched</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Attachments</span>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{totals.attachments}</p>
              <p className="text-sm text-gray-600">Downloaded</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Total Time</span>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{(totals.totalProcessingTime / 3600).toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Processing time</p>
            </div>
          </div>
        </div>

        {/* Issues Alert */}
        {selectedState !== 'all' && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
              Data Quality Issues - {filteredStateData[0]?.state}
            </h2>
            <div className="space-y-2">
              {filteredStateData[0]?.completeDataCoverage < 10 && (
                <div className="flex items-center text-red-600">
                  <span className="text-sm">⚠️ Low complete data coverage: Only {filteredStateData[0]?.completeDataCoverage}% of projects have all data sources</span>
                </div>
              )}
              {filteredStateData[0]?.missingReraData > 0 && (
                <div className="flex items-center text-amber-600">
                  <span className="text-sm">⚠️ {filteredStateData[0]?.missingReraData} projects missing RERA data</span>
                </div>
              )}
              {selectedState === 'karnataka' && (
                <div className="flex items-center text-amber-600">
                  <span className="text-sm">⚠️ Very low LT data coverage: Only 1 project has LT data</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Data collection period: March 26 - April 24, 2025 (29 days)</p>
          <p className="mt-1">
            Currently viewing: {selectedState === 'all' ? 'All States' : selectedState.charAt(0).toUpperCase() + selectedState.slice(1)}
            {dateRange !== 'all' && (
              <span className="ml-2">
                | Date filter: {dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;