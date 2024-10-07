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

    - **Run DB Push**

    ```sh
    docker compose exec trello-api npx prisma db push
    ```

3. **View Logs**

    ```sh
    docker compose logs
    ```

4. **Stop Services**

    ```sh
    docker compose down
    ```
