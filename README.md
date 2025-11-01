# Shacks-2025

Minimal Flask server in backend of a React frontend.

Quick start

1. (Optional) Create a virtual environment:

   python -m venv .venv
   source .venv/bin/activate

2. Install dependencies:

   pip install -r requirements.txt

3. Run the server:

   python app.py

The server listens on port 5000. Try:

  - http://localhost:5000/         -> greeting JSON
  - http://localhost:5000/health  -> health check

Run tests:

  python -m unittest discover -v


# Don't forget...
- `git mv` refactoring
- `pip freeze > requirements.txt` .venv

# Dantzig42
Dataset "Dantzig42" issu de cette liste de l'université "Florida State University":
https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html
(sous [GNU LGPL](https://www.gnu.org/licenses/lgpl-3.0.en.html))

Il s'agit d'une référence au célèbre papier de 1954 publié par Dantzig, l'auteur de l'algorithme du simplexe en optimisation linéaire ([1947](https://en.wikipedia.org/wiki/Simplex_algorithm#History)):

*G. Dantzig, R. Fulkerson, S. Johnson, (1954) Solution of a Large-Scale Traveling-Salesman Problem. Journal of the Operations Research Society of America 2(4):393-410.*