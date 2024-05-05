        const canvas = document.getElementById('game');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const startPauseButton = document.getElementById('start-pause-button');
        const restartButton = document.getElementById('restart-button');

        const tileCount = 20;
        const tileSize = canvas.width / tileCount;
        const snake = [{
            x: 10,
            y: 10
        }];
        let apple = {
            x: 5,
            y: 5
        };
        let score = 0;
        let direction = 'right';
        let interval;
        let isGameRunning = false;

        function generateApple() {
            apple = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '12px "Press Start 2P"';

            snake.forEach((segment, index) => {
                ctx.fillStyle = `hsl(${index * 30}, 100%, 50%)`; /*gradient effect for the snake */
                ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);

                //add a glow effect to the snake
                ctx.fillStyle = `hsla(${index * 30}, 100%, 50%, 0.5)`;
                ctx.fillRect(segment.x * tileSize + 2, segment.y * tileSize + 2, tileSize - 4, tileSize - 4);
            });
            ctx.fillStyle = 'black';
            ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);
        }

        function moveSnake() {
            const head = {
                x: snake[0].x,
                y: snake[0].y
            };
            switch (direction) {
                case 'up':
                    head.y--;
                    break;
                case 'down':
                    head.y++;
                    break;
                case 'left':
                    head.x--;
                    break;
                case 'right':
                    head.x++;
                    break;
            }

            // Snake eats apple
            if (head.x === apple.x && head.y === apple.y) {
                score++;
                scoreElement.textContent = `Score: ${score}`;
                generateApple();
            } else {
                snake.pop(); //remove the last segment of the snake
            }

            //snake collides with itself or wall
            if (snake.some(segment => segment.x === head.x && segment.y === head.y) || head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
                isGameRunning = false;
                clearInterval(interval);
                startPauseButton.textContent = 'Start';
                restartButton.style.display = 'block';
            } else {
                snake.unshift(head); //add the new head
            }

            draw();
        }
        //menu button
        startPauseButton.addEventListener('click', () => {
            if (isGameRunning) {
                clearInterval(interval);
                isGameRunning = false;
                startPauseButton.textContent = 'Start';
            } else {
                interval = setInterval(moveSnake, 100);
                isGameRunning = true;
                startPauseButton.textContent = 'Pause';
            }
        });
        //restart button
        restartButton.addEventListener('click', () => {
            snake.length = 1;
            snake[0] = {
                x: 10,
                y: 10
            };
            score = 0;
            scoreElement.textContent = `Score: ${score}`;
            direction = 'right';
            generateApple();
            clearInterval(interval);
            interval = setInterval(moveSnake, 100);
            isGameRunning = true;
            startPauseButton.textContent = 'Pause';
            restartButton.style.display = 'none';
        });
        //move snake
        document.addEventListener('keydown', event => {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 'ArrowDown':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'ArrowRight':
                    if (direction !== 'left') direction = 'right';
                    break;
            }
        });

        generateApple();
        draw();