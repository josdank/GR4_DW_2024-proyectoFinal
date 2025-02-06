from locust import HttpUser, TaskSet, task, between

class UserBehavior(TaskSet):
    @task
    def get_users(self):
        self.client.get("/")

    @task
    def create_user(self):
        self.client.post("/registro", json={"nombre": "test_user", "apellido": "test", "email": "test_user@example.com", "password": "password123", "celular": "1234567890"})

    @task
    def login_user(self):
        self.client.post("/login", json={"email": "test_user@example.com", "password": "password123"})

class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)
    host = "https://bestkeyboard-steel.vercel.app"  