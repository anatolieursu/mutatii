import {data, deleteCell} from './main';
import {init} from "./main";
import {basic_cell} from "./main";

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



// -=-=-=-=-=

const OPENAI_KEY = "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";
document.getElementById("caracters_form").addEventListener("submit", async (e) => {
    e.preventDefault();  // Prevent the form from submitting and reloading the page

    const inputC = document.getElementById("caracters").value;

    const request = new Request("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: "system", content: `Salut. Am nevoie sa mi dai caracteristicile celulei animale, care, printr o anumita mutatie, va putea rezista urmatoarelor conflicte: ${inputC}. Sa mi dai in schimb un array, fara niciun cuvant in plus. Daca culoarea nu variaza doresc sa scrii default inloc de culoare, in rest, scrio sub forma hex. De forma: {membrana: {culoare, grosime}, mitocondrii: {culoare, numar}, lizozomi: {culoare, numar}, ribozomi: {culoare, numar}, {caracteristici: {cu cuvintele tale fa mi o mica descriere care e caracteristica acestor celule}}` },
                { role: "user", content: inputC }
            ]
        }),
    });

    try {
        const response = await fetch(request);
        if (response.ok) {
            const data = await response.json();
            console.log(data.choices[0].message.content);
        } else {
            console.log('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
