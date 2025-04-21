import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Search,
  Home,
  BookOpen,
  Calendar as CalendarIcon,
  User,
  ArrowLeft,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import axios from "../lib/axios";
import ReactMarkdown from "react-markdown";

const SubjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("notes");
  const [notes, setNotes] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState({
    subject: true,
    notes: false,
    quiz: false,
    videos: false,
  });
  const [error, setError] = useState({
    subject: null,
    notes: null,
    quiz: null,
    videos: null,
  });
  const [quizState, setQuizState] = useState({
    answers: {},
    submitted: false,
    score: 0,
    feedback: {},
  });
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    try {
      const response = await axios.get(`/api/subjects/${id}`);
      if (response.data.success) {
        setSubject(response.data.subject);
      } else {
        throw new Error(response.data.error || "Failed to fetch subject");
      }
    } catch (err) {
      console.error("Error fetching subject:", err);
      setError((prev) => ({ ...prev, subject: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, subject: false }));
    }
  };

  const fetchNotes = async () => {
    if (!subject) return;
    setLoading((prev) => ({ ...prev, notes: true }));
    setError((prev) => ({ ...prev, notes: null }));

    try {
      const response = await axios.post("/api/generate-notes", {
        subject: subject.name,
      });

      if (response.data.success) {
        setNotes(response.data.content);
        if (response.data.fromCache) {
          console.log("Notes loaded from cache");
        }
      } else {
        throw new Error(response.data.error || "Failed to fetch notes");
      }
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError((prev) => ({
        ...prev,
        notes: err.response?.data?.details || err.message,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, notes: false }));
    }
  };

  const fetchQuiz = async () => {
    if (!subject) return;
    setLoading((prev) => ({ ...prev, quiz: true }));
    setError((prev) => ({ ...prev, quiz: null }));

    try {
      const response = await axios.post("/api/generate-quiz", {
        subject: subject.name,
      });

      if (response.data.success && Array.isArray(response.data.questions)) {
        setQuiz(response.data.questions);
        if (response.data.fromCache) {
          console.log("Quiz loaded from cache");
        }
      } else {
        throw new Error("Invalid quiz data received");
      }
    } catch (err) {
      console.error("Error fetching quiz:", err);
      setError((prev) => ({
        ...prev,
        quiz: err.response?.data?.details || err.message,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }));
    }
  };

  const fetchVideos = async () => {
    if (!subject) return;
    setLoading((prev) => ({ ...prev, videos: true }));
    setError((prev) => ({ ...prev, videos: null }));

    try {
      const response = await axios.get(
        `/api/youtube/search/${encodeURIComponent(subject.name)}`
      );

      if (response.data.success && response.data.items) {
        setVideos(response.data.items);
      } else {
        throw new Error("No videos found");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError((prev) => ({
        ...prev,
        videos: err.response?.data?.details || err.message,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, videos: false }));
    }
  };

  useEffect(() => {
    if (subject) {
      if (activeTab === "notes") {
        fetchNotes();
      } else if (activeTab === "quiz") {
        fetchQuiz();
      } else if (activeTab === "video") {
        fetchVideos();
      }
    }
  }, [subject, activeTab]);

  if (loading.subject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error.subject || !subject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {error.subject || "Subject not found"}
          </h2>
          <Link
            to="/dashboard"
            className="text-purple-600 hover:text-purple-700 mt-4 inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer,
      },
    }));
  };

  const handleQuizSubmit = () => {
    // Calculate score and prepare feedback in a single pass
    const newFeedback = {};
    const score = quiz.reduce((acc, question, index) => {
      const isCorrect = quizState.answers[index] === question.correctAnswer;
      newFeedback[index] = {
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "No explanation provided",
      };
      return isCorrect ? acc + 1 : acc;
    }, 0);

    // Update state once with all changes
    setQuizState((prev) => ({
      ...prev,
      submitted: true,
      score,
      feedback: newFeedback,
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      answers: {},
      submitted: false,
      score: 0,
      feedback: {},
    });
    fetchQuiz();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">{subject.name}</h1>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === "notes" ? "default" : "outline"}
          onClick={() => setActiveTab("notes")}
          className="flex items-center space-x-2"
        >
          <BookOpen className="h-4 w-4" />
          <span>Notes</span>
        </Button>
        <Button
          variant={activeTab === "quiz" ? "default" : "outline"}
          onClick={() => setActiveTab("quiz")}
          className="flex items-center space-x-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Quiz</span>
        </Button>
        <Button
          variant={activeTab === "video" ? "default" : "outline"}
          onClick={() => setActiveTab("video")}
          className="flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Videos</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "notes" && (
          <div className="prose prose-purple max-w-none">
            {loading.notes ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : error.notes ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error.notes}</p>
                <Button onClick={fetchNotes} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <ReactMarkdown>{notes}</ReactMarkdown>
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            {loading.quiz ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : error.quiz ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error.quiz}</p>
                <Button onClick={fetchQuiz} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {quiz.map((question, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-semibold">{question.question}</h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={quizState.answers[index] === option}
                            onChange={() => handleAnswerChange(index, option)}
                            disabled={quizState.submitted}
                            className="text-purple-600"
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                    {quizState.submitted && quizState.feedback[index] && (
                      <div
                        className={`p-4 rounded-lg ${
                          quizState.feedback[index].isCorrect
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                      >
                        <p
                          className={
                            quizState.feedback[index].isCorrect
                              ? "text-green-700"
                              : "text-red-700"
                          }
                        >
                          {quizState.feedback[index].isCorrect
                            ? "Correct!"
                            : `Incorrect. The correct answer is ${quizState.feedback[index].correctAnswer}`}
                        </p>
                        <p className="text-gray-600 mt-2">
                          {quizState.feedback[index].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {quiz.length > 0 && !quizState.submitted && (
                  <Button
                    onClick={handleQuizSubmit}
                    disabled={
                      Object.keys(quizState.answers).length !== quiz.length
                    }
                    className="mt-6"
                  >
                    Submit Quiz
                  </Button>
                )}
                {quizState.submitted && (
                  <div className="text-center mt-6">
                    <p className="text-xl font-semibold mb-4">
                      Your Score: {quizState.score} out of {quiz.length}
                    </p>
                    <Button onClick={resetQuiz} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div>
            {loading.videos ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : error.videos ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error.videos}</p>
                <Button onClick={fetchVideos} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectDetail;
