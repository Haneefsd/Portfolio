import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")  # Allow Vite frontend

# Paths
DATA_PATH = os.path.join(os.path.dirname(__file__), "programming_QA_dataset.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "t5_rokl_model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "t5_rokl_vectorizer.pkl")

# Load dataset
def load_dataset(file_path):
    try:
        return pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"❌ Dataset not found at: {file_path}")
        return None

# Train or load model
def train_model(data):
    if data is None:
        return None, None

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(data['Question'])

    # Save model files
    with open(MODEL_PATH, "wb") as model_file:
        pickle.dump(tfidf_matrix, model_file)
    with open(VECTORIZER_PATH, "wb") as vec_file:
        pickle.dump(vectorizer, vec_file)

    return vectorizer, tfidf_matrix

# Get best answer based on cosine similarity
def get_answer(query, vectorizer, tfidf_matrix, data):
    if vectorizer is None or tfidf_matrix is None:
        return "Model not loaded. Check server logs."

    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
    top_idx = similarities.argmax()

    if similarities[top_idx] == 0:
        return "No relevant answer found. Try rephrasing your question."

    return data.iloc[top_idx]['Answer']

# Initialize everything
df = load_dataset(DATA_PATH)
vectorizer, tfidf_matrix = train_model(df)

# API route
@app.route("/ask", methods=["POST"])
def ask():
    data_json = request.get_json()
    query = data_json.get("question", "")
    answer = get_answer(query, vectorizer, tfidf_matrix, df)
    return jsonify({"answer": answer})

# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
