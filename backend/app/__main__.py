#Import create_app from __init__
from app import create_app
     
if __name__ == "__main__":
    app = create_app()
    app.run()
