import {
  Youtube,
  FileText,
  BrainCircuit,
  MessageSquare,
  Calendar,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Notes",
      description:
        "AI-powered study notes that help you understand and retain information better.",
    },
    {
      icon: BrainCircuit,
      title: "Interactive Quizzes",
      description:
        "Test your knowledge with dynamically generated quizzes based on your study materials.",
    },
    {
      icon: Youtube,
      title: "Video Learning",
      description:
        "Access relevant educational videos to enhance your understanding of topics.",
    },
    {
      icon: MessageSquare,
      title: "Study Forum",
      description:
        "Connect with other students, ask questions, and share knowledge in our community forum.",
    },
    {
      icon: Calendar,
      title: "Study Planning",
      description:
        "Organize your study schedule and track your learning progress effectively.",
    },
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Quickly find study materials and resources across your courses.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Transform Your Study Experience
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools to enhance your learning journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-8 w-8 text-purple-600 mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;
