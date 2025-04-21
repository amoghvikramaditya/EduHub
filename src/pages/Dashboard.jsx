import { useState, useEffect } from "react";
import { Calendar } from "../components/ui/calendar";
import { Button } from "../components/ui/button";
import {
  Search,
  Home,
  BookOpen,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import SubjectCard from "../components/SubjectCard";
import axios from "../lib/axios";
import AddCoursesModal from "../components/AddCoursesModal";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [date, setDate] = useState(new Date());
  const [minutes, setMinutes] = useState(25);
  const [time, setTime] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("pomodoro"); // 'pomodoro' or 'break'
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/api/subjects");
      if (response.data.success) {
        setSubjects(response.data.subjects);
      } else {
        throw new Error(response.data.error || "Failed to fetch subjects");
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourseSuccess = (newSubject) => {
    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(minutes * 60);
  };

  const toggleBreak = () => {
    setIsRunning(false);
    if (timerMode === "pomodoro") {
      setTimerMode("break");
      setMinutes(5);
      setTime(5 * 60);
    } else {
      setTimerMode("pomodoro");
      setMinutes(25);
      setTime(25 * 60);
    }
  };

  const adjustTime = (amount) => {
    if (!isRunning) {
      const newMinutes = Math.max(1, Math.min(60, minutes + amount));
      setMinutes(newMinutes);
      setTime(newMinutes * 60);
    }
  };

  const formatTime = (timeInSeconds) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress for the timer circle
  const progress = time / (minutes * 60);
  const circumference = 2 * Math.PI * 90; // circle radius is 90px
  const strokeDashoffset = circumference * (1 - progress);

  // Calculate color transition from black to white based on progress
  const getProgressColor = () => {
    const intensity = Math.floor((1 - progress) * 255);
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar - Fixed */}
      <div className="w-60 border-r flex-shrink-0 p-6 flex flex-col gap-6">
        <Link to="/" className="text-2xl font-bold">
          EduHub
        </Link>
        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>
          <Link
            to="/forum"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <MessageSquare size={20} />
            <span>Forum</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
          >
            <Search size={20} />
            <span>Search</span>
          </Link>
        </nav>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="p-8 border-b bg-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Welcome Card */}
          <div className="bg-purple-400 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome to EduHub
            </h2>
            <p className="text-white/90 mb-4">
              Need help on using the app? Take a look at this tutorial to get
              started
            </p>
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100"
            >
              Get Started
            </Button>
          </div>

          {/* Courses Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button
                variant="ghost"
                className="text-purple-600 hover:bg-purple-50"
                onClick={() => setIsAddCourseModalOpen(true)}
              >
                Add Courses
              </Button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchSubjects} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subject, index) => (
                  <SubjectCard
                    key={subject._id}
                    subject={subject}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Fixed */}
      <div className="w-80 border-l flex-shrink-0 p-6 bg-white">
        {/* Pomodoro Timer */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Pomodoro Timer</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6 group">
              {/* Time adjustment buttons */}
              {!isRunning && (
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                    onClick={() => adjustTime(1)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                    onClick={() => adjustTime(-1)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="4"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="90"
                  fill="none"
                  stroke={getProgressColor()}
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{formatTime(time)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className={`${
                  isRunning
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-[#1a1625] hover:bg-[#2a2635]"
                } text-white`}
                onClick={isRunning ? () => setIsRunning(false) : startTimer}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                variant="outline"
                className="border-gray-200"
                onClick={resetTimer}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                className={`border-gray-200 ${
                  timerMode === "break" ? "bg-purple-100" : ""
                }`}
                onClick={toggleBreak}
              >
                Break
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Calendar</h3>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              today: new Date(),
            }}
            modifiersStyles={{
              today: {
                fontWeight: "bold",
                backgroundColor: "#8b5cf6",
                color: "white",
              },
            }}
            footer={
              <div className="mt-4 text-sm text-gray-500">
                {format(date, "PPP")}
              </div>
            }
          />
        </div>
      </div>

      {/* Add Courses Modal */}
      <AddCoursesModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onSuccess={handleAddCourseSuccess}
      />
    </div>
  );
}
