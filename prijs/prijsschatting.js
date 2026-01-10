// ===============================
// PRIJS BEREKENING
// ===============================
const calculatePrice = () => {
    const wedding_active = document.getElementById("service-wedding").checked;
    const event_active = document.getElementById("service-event").checked;
    const corporate_active = document.getElementById("service-corporate").checked;

    const duurtijd = Number(document.getElementById("duration-input").value);

    const drone_active = document.getElementById("extra-drone").checked;
    const RAW_active = document.getElementById("extra-raw").checked;
    const express_active = document.getElementById("extra-express").checked;

    let diensttypePrijs = 0;
    if (wedding_active) diensttypePrijs = 200;
    if (event_active) diensttypePrijs = 300;
    if (corporate_active) diensttypePrijs = 400;

    let duurtijdPrijs = duurtijd * 75;

    let optie_prijs = 0;
    if (drone_active) optie_prijs += 250;
    if (RAW_active) optie_prijs += 200;
    if (express_active) optie_prijs += 150;

    return diensttypePrijs + duurtijdPrijs + optie_prijs;
};

// ===============================
// DUURTIJD INPUT SANITIZE
// ===============================
document.getElementById("duration-input").addEventListener("input", () => {
    const input = document.getElementById("duration-input");
    let raw = input.value.replace(/\D/g, "");
    if (raw === "") { input.value = ""; return; }
    let num = parseInt(raw, 10);
    if (num < 1) num = 1;
    if (num > 99) num = 99;
    input.value = String(num);
});

// ===============================
// HERBEREKEN BIJ WIJZIGINGEN
// ===============================
document.querySelectorAll("#price-form input").forEach(input => {
    input.addEventListener("input", calculatePrice);
    input.addEventListener("change", calculatePrice);
});

// ===============================
// OVERLAY LOGICA
// ===============================
const button = document.getElementById("get-price-button");
const overlay = document.querySelector(".price-overlay");
const priceSection = document.querySelector(".price-section");
const form = document.getElementById("price-form");

// ===============================
// CONTACTFORM ELEMENTEN
// ===============================
const particulierRadio = document.getElementById("type-particulier");
const bedrijfRadio = document.getElementById("type-bedrijf");
const bedrijfInput = document.getElementById("bedrijf");
const bedrijfWrapper = document.querySelector(".input-wrapper");
const contactForm = document.querySelector(".contact-form");

// ===============================
// FUNCTIES VOOR BEDRIJF VERPLICHT/OPTIONEEL
// ===============================
function updateBedrijfVerplichtheid() {
    bedrijfInput.required = bedrijfRadio.checked;
}
function updateOptioneelLabel() {
    const noChoice = !particulierRadio.checked && !bedrijfRadio.checked;
    const isParticulier = particulierRadio.checked;
    const isEmpty = bedrijfInput.value.trim() === "";

    if (noChoice) {
        bedrijfWrapper.classList.remove("show-optional");
        return;
    }
    if (isParticulier && isEmpty) {
        bedrijfWrapper.classList.add("show-optional");
    } else {
        bedrijfWrapper.classList.remove("show-optional");
    }
}

// Initialiseer verplicht/optioneel
updateBedrijfVerplichtheid();
updateOptioneelLabel();
particulierRadio.addEventListener("change", () => { updateBedrijfVerplichtheid(); updateOptioneelLabel(); });
bedrijfRadio.addEventListener("change", () => { updateBedrijfVerplichtheid(); updateOptioneelLabel(); });
bedrijfInput.addEventListener("input", updateOptioneelLabel);

// ===============================
// OPEN OVERLAY EN LOG SUBMIT
// ===============================
button.addEventListener("click", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const prijs = calculatePrice();
    document.getElementById("overlay-price").textContent = `€${prijs},-`;

    // 🔹 Vul hidden fields ALVORENS overlay verschijnt
    const dienst = document.querySelector('#price-form input[name="service"]:checked');
    document.getElementById("hidden-diensttype").value = dienst ? dienst.value : "";
    document.getElementById("hidden-duurtijd").value = document.getElementById("duration-input").value;
    const extras = [...document.querySelectorAll('#price-form input[name="extra"]:checked')]
        .map(x => x.value)
        .join(", ");
    document.getElementById("hidden-extra").value = extras;
    document.getElementById("hidden-price").value = `€${prijs},-`;

    // Fade priceSection uit
    priceSection.style.opacity = "0";
    setTimeout(() => {
        priceSection.style.display = "none";
        overlay.style.display = "flex";
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.opacity = "1";
            const overlayBox = document.querySelector(".overlay-box");
            overlayBox.style.opacity = "1";
            overlayBox.style.transform = "scale(1)";
        }, 10);
    }, 200);

    // 🔹 Voeg submit listener toe
    if (contactForm && !contactForm.dataset.listenerAdded) {
        contactForm.addEventListener("submit", function(e){
            console.log("Form is being submitted!");

            // Bedrijf verplicht indien nodig
            updateBedrijfVerplichtheid();

            // Validatie
            if (!contactForm.checkValidity()) {
                e.preventDefault();
                contactForm.reportValidity();
                return;
            }

            // Log alle data die FormSubmit zou ontvangen
            console.log("Form data ready to send:");
            [...contactForm.elements].forEach(el => {
                if (el.name) console.log(el.name, "=", el.value);
            });

            // GEEN e.preventDefault() → FormSubmit stuurt mail automatisch
        });
        contactForm.dataset.listenerAdded = "true";
    }
});

// ===============================
// SLUIT OVERLAY
// ===============================
document.querySelector(".close-overlay").addEventListener("click", () => {
    overlay.style.opacity = "0";
    const overlayBox = document.querySelector(".overlay-box");
    overlayBox.style.opacity = "0";
    overlayBox.style.transform = "scale(0.97)";

    priceSection.style.display = "block";
    priceSection.style.opacity = "0";
    setTimeout(() => { priceSection.style.opacity = "1"; }, 10);
    setTimeout(() => { overlay.style.display = "none"; }, 400);
});
