import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { search as apiSearch } from '../services/api';
import SearchBar from '../components/SearchBar';
import SectionHeader from '../components/SectionHeader';
import { BookOpen, Brain, CreditCard, ClipboardList, FlaskConical } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults(null);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await apiSearch(query);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasResults = results && (
    results.subjects?.length > 0 ||
    results.quizzes?.length > 0 ||
    results.flashcards?.length > 0 ||
    results.osce?.length > 0 ||
    results.labs?.length > 0
  );

  return (
    <div>
      <SectionHeader
        title="Search"
        subtitle="Find subjects, quizzes, flashcards, and more"
      />

      <div className="mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search for anything..."
        />
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Searching...</p>
        </div>
      )}

      {!loading && query.length >= 2 && !hasResults && (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found for "{query}"</p>
        </div>
      )}

      {results && hasResults && (
        <div className="space-y-8">
          {/* Subjects */}
          {results.subjects?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                Subjects ({results.subjects.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.subjects.map((subject) => (
                  <Link
                    key={subject._id}
                    to={`/subjects/${subject._id}`}
                    className="card hover:border-primary-300"
                  >
                    <h3 className="font-semibold mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-600">{subject.code}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {results.quizzes?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Quizzes ({results.quizzes.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.quizzes.map((quiz) => (
                  <Link
                    key={quiz._id}
                    to={`/quizzes/${quiz._id}`}
                    className="card hover:border-primary-300"
                  >
                    <h3 className="font-semibold mb-1">{quiz.title}</h3>
                    {quiz.subject && (
                      <p className="text-sm text-gray-600">{quiz.subject.name}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Flashcards */}
          {results.flashcards?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Flashcards ({results.flashcards.length})
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.flashcards.map((card) => (
                  <div key={card._id} className="card">
                    <p className="font-semibold mb-2">{card.front}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{card.back}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OSCE */}
          {results.osce?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-red-600" />
                OSCE Stations ({results.osce.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.osce.map((station) => (
                  <Link
                    key={station._id}
                    to={`/osce/${station._id}`}
                    className="card hover:border-primary-300"
                  >
                    <h3 className="font-semibold mb-1">{station.title}</h3>
                    <p className="text-sm text-gray-600">{station.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Labs */}
          {results.labs?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-green-600" />
                Lab Manuals ({results.labs.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.labs.map((lab) => (
                  <Link
                    key={lab._id}
                    to={`/labs/${lab._id}`}
                    className="card hover:border-primary-300"
                  >
                    <h3 className="font-semibold mb-1">{lab.title}</h3>
                    {lab.subject && (
                      <p className="text-sm text-gray-600">{lab.subject.name}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

