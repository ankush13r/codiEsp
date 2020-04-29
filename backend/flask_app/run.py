#Import create_app from __init__
from app import create_app


app = create_app()

        
if __name__ == "__main__":
    # from apscheduler.schedulers.background import BackgroundScheduler

    # scheduler = BackgroundScheduler()
    # scheduler.add_job(func=function, trigger="interval", days=5)
    # scheduler.start()
    app.run()
