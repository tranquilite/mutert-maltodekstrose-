// endless shitfuckery
// "Brought to you by the australien government"
// At denne fila måtte hete jsx er bare stress med .gitignore. Alt gjørt vondt.
function start_spill()
{
    spillarr = {};
    const tags = ["nord", "sor", "ost", "vest"];
    for (idx_label in tags) {
        spillarr[tags[idx_label]] = document.getElementById(tags[idx_label]).value;
    }
    const spiller_post = { "spillere": spillarr };

    fetch("/bridge/start",
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(spiller_post) } )
            .then(response => { return response.json(); })
            .then(data => {
                populer_handtabell(data);
                populer_spiller_bid(data);
    });
}

function populer_spiller_bid(spillebord)
{
    const player_turn = document.getElementById("p_action_bud_tag").textContent = "Spiller Øst";
    const player_turn_field1 = document.getElementById("bid_player");

    // I declare exterminatus
    while (player_turn_field1.options.length > 0) {
        player_turn_field1.remove(0);
    }

    for (spiller in spillebord) {
        const sp_formoption = document.createElement("option");
        sp_formoption.value = spillebord[spiller].id;
        sp_formoption.textContent = spillebord[spiller].navn;
        if (spiller == 3) { // Hardkoder VEST
            sp_formoption.setAttribute("selected", "selected");
        }
        player_turn_field1.appendChild(sp_formoption);

    }
}

function populer_handtabell(spillebord)
{
    const spha_t = document.getElementById("spiller_hand");
    const tbody = spha_t.getElementsByTagName('tbody')[0];

    // I declare exterminatus
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (spiller in spillebord) {
        spiller = spillebord[spiller];  // ugly hack

        let neste_rad = tbody.insertRow();
        let spillernavn = neste_rad.insertCell(0);
        let spillerid = neste_rad.insertCell(1);
        let spillerhand = neste_rad.insertCell(2);

        spillernavn.textContent = spiller.navn;
        spillerid.textContent = spiller.id;
        spillerhand.textContent = JSON.stringify(spiller.hand, null, 2);
        spillerhand.classList.add("spiller-hand");

        document.getElementById("spiller_hand").querySelector("tbody").style.display = "table-row-group";
    }
}

function gi_bud()
{
    let bid_rank = document.getElementById("bid_rank").value;
    let bid_suit = document.getElementById("bid_suit").value;
    let player_turn = document.getElementById("p_action_bud_tag").textContent = "";
    let bid_post = {"rank": bid_rank, "suit": bid_suit};

    fetch(`/bridge/bid/${document.getElementById("bid_player").selectedIndex}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bid_post) } )
            .then(response => { return response.json(); })
            .then(data => {
                if ( data == {"error": "Wrong turn"} ) {
                    console.log(data); 
                } else {
                    // Handle shit.
                }
    })

        var select = document.getElementById("bid_player");
        var selectedOption = select.querySelector("option[selected]");
        var nextOption = selectedOption.nextElementSibling;
        
        if (nextOption) {
            selectedOption.removeAttribute("selected");
            nextOption.setAttribute("selected", "selected");
        }
}

// Oppstartsgreier.. Mer smerte :3
document.addEventListener("DOMContentLoaded", function() {
    const thead = document.getElementById("spiller_hand").querySelector("thead");
    const tbody = document.getElementById("spiller_hand").querySelector("tbody");

    thead.addEventListener("click", function() {
        tbody.style.display = (tbody.style.display === "none" || tbody.style.display === "") ? "table-row-group" : "none";
    });
});