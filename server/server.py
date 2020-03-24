from flask import Flask, after_this_request, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def hello_world():
    @after_this_request
    def add_header(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    board = request.get_json(force=True)
    aiMove = makeMove(board)
    return str(aiMove)

def makeMove(board):
    for idx, value in enumerate(board):
        if value is None:
            return idx
