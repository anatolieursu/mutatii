import {data, deleteCell} from './main';
import {init} from "./main";
import {basic_cell} from "./main";
import {OPENAI_KEY} from "../env";

// Changing data
const info = ["mitocondrii", "ribozomi", "grosimea_membranei", "reticul_endoplasmatic", "aparatul_golgi", "lizozomi"];
info.forEach(e => {
    document.getElementById(e).addEventListener("change",
        (d) => {
            console.log(document.getElementById(e).value)
            document.getElementById(e + "_t").innerHTML = document.getElementById(e).value
            // mitocondrii

             deleteCell()

            switch (e){
                case 'mitocondrii':
                    data.mitocondrii.n = parseInt(document.getElementById(e).value)
                    break
                case 'ribozomi':
                    data.ribozomi.n = parseInt(document.getElementById(e).value)
                    break
                case 'grosimea_membranei':
                    data.membrana.grosime = parseInt(document.getElementById(e).value)
                    break
                case 'reticul_endoplasmatic':
                    data.re.radius = parseInt(document.getElementById(e).value)/130
                    break
                case 'aparatul_golgi':
                    data.ag.numCisterne = parseInt(document.getElementById(e).value)
                    break
                case 'lizozomi':
                    data.lizozomi.n = parseInt(document.getElementById(e).value)
                    break
            }

            setTimeout(() => {
                basic_cell()
            }, 100)
    })
})

// Form submit
document.getElementById("info_about_cell_form").addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("info_about_cell").style.display = "none";
    const request = new Request("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: `Salut. Construiesc o celula mutanta cu urmatoarea configuratie: Numarul de mitocondrii: ${data.mitocondrii.n}, numarul de ribozomi: ${data.ribozomi.n}, numarul de lizozomi: ${data.lizozomi.n}, numarul de cisterne aparatul golgi: ${data.ag.numCisterne}, grosimea reticului endoplasmatic: ${data.re.radius}, grosimea membranei celulare, de la 1 la 3: ${data.membrana.grosime}. Spune mi la ce poate fi imuna aceasta celula. De exemplu contra fumatului/contra gravitatiei/anumitor toxine, ce ar putea fi & imbunatatit` },
                { role: "user", content: 'Scurt si la obiect. Tine cont de datele oferite' }
            ]
        }),
    });

    try {
        const response = await fetch(request);
        document.getElementById("info_about_cell").style.display = "block";
        if (response.ok) {
            const data = await response.json();

            const content = data.choices[0].message.content;
            console.log(content)

            setNotification(content)
        } else {
            console.log('Error:', response.status, response.statusText);
            setNotification(`Error: ${response.status}, ${response.statusText}`)
        }
    } catch (error) {
        document.getElementById("info_about_cell").style.display = "block";
        console.error('Error fetching data:', error);

        setNotification(`Error fetching data: ${error}`)
    }
})

function setNotification(content){
    document.getElementById("pos").style.display = "block";
    document.getElementById("info_notice_p").innerHTML = content;
}

// closing notification
document.getElementById("pos").addEventListener("click", () => {
    document.getElementById("pos").style.display = "none"
})
// -=-=-=-=-=