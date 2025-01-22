from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Word lists for different difficulty levels
easy_words = ["cat", "dog", "sun", "moon", "sky"]
medium_words = ["elephant", "guitar", "butterfly", "internet", "computer"]
hard_words = ["hippopotamus", "astrophysics", "pneumonoultramicroscopicsilicovolcanoconiosis"]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    difficulty = int(request.form['difficulty'])
    if difficulty == 1:
        word_list = easy_words
    elif difficulty == 2:
        word_list = medium_words
    else:
        word_list = hard_words

    word = random.choice(word_list)
    scrambled_word = ''.join(random.sample(word, len(word)))

    return jsonify({
        'scrambled_word': scrambled_word,
        'original_word': word
    })

@app.route('/check_guess', methods=['POST'])
def check_guess():
    guess = request.form['guess'].lower()
    original_word = request.form['original_word'].lower()

    if guess == original_word:
        return jsonify({'result': 'correct', 'score': 10})
    else:
        return jsonify({'result': 'incorrect', 'correct_word': original_word})

if __name__ == '__main__':
    app.run(debug=True)
