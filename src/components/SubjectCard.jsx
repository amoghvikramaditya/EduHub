import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const getGradient = (index) => {
  const gradients = [
    "from-green-200 via-cyan-200 to-blue-200",
    "from-pink-200 via-purple-200 to-blue-200",
    "from-green-200 via-cyan-200 to-blue-200",
    "from-orange-200 via-amber-200 to-yellow-200",
    "from-blue-200 via-indigo-200 to-purple-200",
    "from-teal-200 via-emerald-200 to-green-200",
    "from-rose-200 via-pink-200 to-purple-200",
    "from-cyan-200 via-blue-200 to-indigo-200",
    "from-violet-200 via-purple-200 to-fuchsia-200",
    "from-emerald-200 via-teal-200 to-cyan-200",
  ];
  return gradients[index % gradients.length];
};

const SubjectCard = ({ subject, index }) => {
  return (
    <Link to={`/subject/${subject._id}`} className="block">
      <div className="bg-white rounded-3xl p-6 border hover:shadow-lg transition-shadow duration-300">
        <div
          className={`h-40 rounded-2xl mb-4 bg-gradient-to-br ${getGradient(
            index
          )}`}
        />
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-1">{subject.name}</h3>
            <p className="text-gray-600 text-sm">
              {subject.description.split(".")[0]}
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default SubjectCard;
