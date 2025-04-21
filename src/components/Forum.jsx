import { useState, useEffect } from "react";
import axios from "../lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Forum = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("/api/forum/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/forum/questions", {
        title: newQuestion.title,
        content: newQuestion.content,
        tags: newQuestion.tags.split(",").map((tag) => tag.trim()),
      });
      setNewQuestion({ title: "", content: "", tags: "" });
      fetchQuestions();
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  const handleViewQuestion = async (questionId) => {
    try {
      const response = await axios.get(`/api/forum/questions/${questionId}`);
      setSelectedQuestion(response.data.question);
      setReplies(response.data.replies);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/forum/questions/${selectedQuestion._id}/replies`, {
        content: newReply,
      });
      setNewReply("");
      handleViewQuestion(selectedQuestion._id);
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Forum</h1>
        {selectedQuestion && (
          <Button variant="outline" onClick={() => setSelectedQuestion(null)}>
            Back to Questions
          </Button>
        )}
      </div>

      {!selectedQuestion ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your question title"
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <textarea
                    id="content"
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your question in detail"
                    value={newQuestion.content}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., javascript, react, node"
                    value={newQuestion.tags}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, tags: e.target.value })
                    }
                  />
                </div>
                <Button type="submit">Post Question</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Questions</h2>
            <div className="grid gap-4">
              {questions.map((question) => (
                <Card
                  key={question._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewQuestion(question._id)}
                >
                  <CardHeader>
                    <CardTitle>{question.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {question.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>By: {question.author.username}</span>
                    <span>
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedQuestion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{selectedQuestion.content}</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>By: {selectedQuestion.author.username}</span>
                <span>
                  {new Date(selectedQuestion.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Replies</h3>
            <div className="space-y-4">
              {replies.map((reply) => (
                <Card key={reply._id}>
                  <CardContent className="pt-6">
                    <p className="mb-4">{reply.content}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>By: {reply.author.username}</span>
                      <span>
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add a Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReply} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reply">Your Reply</Label>
                    <textarea
                      id="reply"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write your reply here"
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit">Post Reply</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
