const endpoint = "";
const apiKey = "";
const deployment = "";
const apiVersion = "";

const secaoConversa = document.getElementById("div_conversa");
const pergunta = document.getElementById("pergunta");

function callAzureOpenAI(pergunta2) {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    const config = {
        messages: [
            {
                role: "system",
                content:`Você é um especialista em pizzas e só pode responder sobre esse assunto. 
                Se a pergunta não for relacionada a pizzas, responda: 
                "Desculpe, só posso responder sobre as pizzas disponíveis." 
                Informe sempre que existem três tipos de massa (Tradicional, Fina e Integral) 
                e três tamanhos (Média - 6 fatias, Grande - 8 fatias, Família - 12 fatias). 
                Seja sempre amigável e objetivo em suas recomendações.`, 
            },
            {
                role: "user",
                content: pergunta2,
            },
        ],
        max_tokens: 800,
        temperature: 0,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
    };

    try {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify(config),
        })
        .then((response) => response.json())
        .then((result) => {
            addMessageToChat(
                "div_card_conversa_chat",
                result.choices[0].message.content
            );
            console.log(result.choices[0].message.content)
        })
        .catch((error) => {
            addMessageToChat("div_card_conversa_chat", `Erro: ${error.message}`)
            console.log(error)
        });
    } catch (error) {
        addMessageToChat("div_card_conversa_chat", error);
        console.log(error.message);
        console.log(error)
    }
}

function addMessageToChat(className, messageContent) {
    if (className === "div_card_conversa_chat") {
        secaoConversa.innerHTML += `
        <div class="div_card_conversa" id="${className}">
        <button type="button"> 
           <img id="img_audio" src="../assets/img/audio.svg" alt="Botão de áudio">
        </button>

        <p>${messageContent}</p>

        <img id="img_bot" src="../assets/img/bot.svg" alt="">
        </div>
        `;
    } else {
        secaoConversa.innerHTML += `
            <div class="div_card_conversa" id="${className}">
            <p>${messageContent}</p>
            </div>
        `;
    }

    secaoConversa.scrollTop = secaoConversa.scrollHeight;
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    const userMessage = pergunta.value.trim();
    
    addMessageToChat("div_card_conversa_usuario", userMessage);

    callAzureOpenAI(userMessage);

    pergunta.value = ""
});
