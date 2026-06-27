'use client'
import { useState } from 'react'

const TOPICS: Record<string, string[]> = {
  SDE: ["arrays", "linked lists", "trees", "dynamic programming", "system design", "behavioral"],
  "Data Scientist": ["statistics", "machine learning", "SQL", "python", "model evaluation", "behavioral"],
  PM: ["product sense", "metrics", "prioritization", "behavioral", "estimation"]
}

const API_URL = "https://interview-coach-production-b9b7.up.railway.app"

export default function Home() {
  const [role, setRole] = useState('SDE')
  const [difficulty, setDifficulty] = useState('medium')
  const [topic, setTopic] = useState('arrays')
  const [question, setQuestion] = useState<any>(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generateQuestion = async () => {
    setLoading(true)
    setFeedback(null)
    setAnswer('')
    const res = await fetch(`${API_URL}/generate-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, difficulty, topic })
    })
    const data = await res.json()
    setQuestion(data)
    setLoading(false)
  }

  const evaluateAnswer = async () => {
    setLoading(true)
    const res = await fetch(`${API_URL}/evaluate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.question,
        expected_points: question.expected_points,
        rubric: question.rubric,
        user_answer: answer
      })
    })
    const data = await res.json()
    setFeedback(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🎯 Interview Coach</h1>
      <p className="text-gray-400 mb-8">Practice technical interviews with AI feedback</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Role</label>
          <select value={role} onChange={e => { setRole(e.target.value); setTopic(TOPICS[e.target.value][0]) }}
            className="w-full bg-gray-800 rounded-lg p-2 text-white">
            {Object.keys(TOPICS).map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="w-full bg-gray-800 rounded-lg p-2 text-white">
            {['easy', 'medium', 'hard'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1 block">Topic</label>
          <select value={topic} onChange={e => setTopic(e.target.value)}
            className="w-full bg-gray-800 rounded-lg p-2 text-white">
            {TOPICS[role].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <button onClick={generateQuestion} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg p-3 font-semibold mb-6">
        {loading ? 'Generating...' : 'Generate Question'}
      </button>

      {question && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex gap-2 mb-3">
            <span className="bg-blue-600 text-xs px-2 py-1 rounded">{question.difficulty}</span>
            <span className="bg-gray-600 text-xs px-2 py-1 rounded">{question.topic}</span>
            <span className="bg-gray-600 text-xs px-2 py-1 rounded">⏱ {question.time_hint_minutes} min</span>
          </div>
          <p className="text-lg mb-4">{question.question}</p>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full bg-gray-900 rounded-lg p-3 text-white h-32 resize-none"
          />
          <button onClick={evaluateAnswer} disabled={loading || !answer}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg p-3 font-semibold mt-3">
            {loading ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </div>
      )}

      {feedback && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-blue-400">{feedback.score}/10</span>
            <span className="text-gray-400">Overall Score</span>
          </div>
          <div className="mb-4">
            <h3 className="text-green-400 font-semibold mb-2">✅ What was good</h3>
            {(feedback.what_was_good || feedback.strengths || []).map((p: string, i: number) => <p key={i} className="text-gray-300 text-sm mb-1">• {p}</p>)}
          </div>
          <div className="mb-4">
            <h3 className="text-red-400 font-semibold mb-2">❌ What was missing</h3>
            {(feedback.what_was_missing || feedback.areas_for_improvement || []).map((p: string, i: number) => <p key={i} className="text-gray-300 text-sm mb-1">• {p}</p>)}
          </div>
          <div className="mb-4">
            <h3 className="text-yellow-400 font-semibold mb-2">💡 Ideal Answer</h3>
            <p className="text-gray-300 text-sm">{feedback.ideal_answer_summary}</p>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-2">📚 Topics to Review</h3>
            <div className="flex gap-2 flex-wrap">
              {(feedback.suggested_topics || feedback.topics_to_review || []).map((t: string, i: number) =>
                <span key={i} className="bg-purple-900 text-purple-300 text-xs px-2 py-1 rounded">{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}