# Trello BE

# Local Setup

1. **Start the Services**

    ```sh
    docker compose up --build -d
    ```

2. **Run Migrations**

    ```sh
    docker compose exec trello-api npx prisma migrate dev
    ```

3. **View Logs**

    ```sh
    docker compose logs
    ```
