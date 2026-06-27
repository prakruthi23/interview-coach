import os, json, re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_json(text: str) -> dict:
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if not match:
        raise ValueError("No JSON found in response")
    return json.loads(match.group())

def generate_question(role: str, difficulty: str, topic: str) -> dict:
    prompt = f"""You are an expert technical interviewer.
Generate a {difficulty} interview question for a {role} candidate on the topic: {topic}.

Respond with ONLY valid JSON:
{{
  "question": "...",
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "expected_points": ["point 1", "point 2", "point 3"],
  "rubric": {{
    "excellent": "...",
    "good": "...",
    "needs_work": "..."
  }},
  "time_hint_minutes": 5
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    return extract_json(response.choices[0].message.content)
def evaluate_answer(question: str, expected_points: list,
                    rubric: dict, user_answer: str) -> dict:
    prompt = f"""You are an expert technical interviewer evaluating a candidate's answer.

Question: {question}
Expected points: {expected_points}
Rubric: {rubric}

Candidate's answer: "{user_answer}"

Respond with ONLY valid JSON:
{{
  "score": 7,
  "what_was_good": ["..."],
  "what_was_missing": ["..."],
  "ideal_answer_summary": "...",
  "suggested_topics": ["topic1", "topic2"]
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    print("RAW FEEDBACK:", response.choices[0].message.content)
    return extract_json(response.choices[0].message.content)