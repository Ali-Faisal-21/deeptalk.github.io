const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        let isBotTyping = false;
        let typingElement = null;

        function appendMessage(content, sender) {
            const div = document.createElement('div');
            div.className = `message ${sender}`;

            if (content.includes('```')) {
                const parts = content.split('```');
                parts.forEach((part, index) => {
                    if (index % 2 === 0) {
                        div.appendChild(document.createTextNode(part));
                    } else {
                        const codeBlock = document.createElement('pre');
                        const code = document.createElement('code');
                        code.textContent = part.trim();
                        codeBlock.appendChild(code);
                        codeBlock.style.background = '#111';
                        codeBlock.style.border = '2px solid #0ff';
                        codeBlock.style.color = '#0ff';
                        codeBlock.style.padding = '10px';
                        codeBlock.style.marginTop = '10px';
                        codeBlock.style.whiteSpace = 'pre-wrap';
                        codeBlock.style.overflowX = 'auto';
                        div.appendChild(codeBlock);
                    }
                });
            } else {
                div.textContent = content;
            }

            chatBox.appendChild(div);

            // ✅ SCROLL FIX — Animate scroll to bottom
            requestAnimationFrame(() => {
                chatBox.scrollTop = chatBox.scrollHeight;
            });
        }



        function showTyping() {
            typingElement = document.createElement('div');
            typingElement.className = 'typing';
            typingElement.textContent = 'Bot is typing...';
            chatBox.appendChild(typingElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function hideTyping() {
            if (typingElement) {
                typingElement.remove();
                typingElement = null;
            }
        }

        async function sendMessage(text) {
            if (!text.trim() || isBotTyping) return;

            appendMessage(text, 'user');
            userInput.value = '';
            userInput.style.height = 'auto'; // ✅ input resize fix
            isBotTyping = true;



            showTyping();

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "HTTP-Referer": "https://yourwebsite.com",
                    "X-Title": "DeepTalk Chatbot",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "deepseek/deepseek-r1:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": text
                        }
                    ]
                })
            });

            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || 'Error getting response';

            hideTyping();
            appendMessage(botReply, 'bot');
            isBotTyping = false;
        }

        // userInput.addEventListener('keydown', function (e) {
        //   if (e.key === 'Enter' && !e.shiftKey) {
        //     e.preventDefault();
        //     sendMessage(userInput.value);
        //   }
        // });
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // stop newline
                sendMessage(userInput.value); // send message
            }
        });


        userInput.addEventListener('input', () => {
            userInput.style.height = 'auto';
            userInput.style.height = userInput.scrollHeight + 'px';
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            if (confirm("Are you sure You want to clear the chat?")) {
                chatBox.innerHTML = '';
            }
        });

        document.getElementById("toggle-sidebar").addEventListener("click", () => {
            document.querySelector(".sidebar").classList.toggle("active");
        });
