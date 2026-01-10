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


document.getElementById("duration-input").addEventListener("input", () => {
    const input = document.getElementById("duration-input");

    // Alleen cijfers toelaten
    let raw = input.value.replace(/\D/g, "");

    // Als leeg: laat leeg tijdens typen
    if (raw === "") {
        input.value = "";
        calculatePrice();
        return;
    }

    // Omzetten naar getal
    let num = parseInt(raw, 10);

    // Minstens 1 uur
    if (num < 1) num = 1;

    // Max 99 uur (optioneel)
    if (num > 99) num = 99;

    input.value = String(num);

    calculatePrice();
});


// Recalculate on all input changes
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculatePrice);
    input.addEventListener("change", calculatePrice);
});


// Overlay logic
const button = document.getElementById("get-price-button");
const overlay = document.querySelector(".price-overlay");
const priceSection = document.querySelector(".price-section");
const form = document.getElementById("price-form");

button.addEventListener("click", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const prijs = calculatePrice();
    document.getElementById("overlay-price").textContent = `€${prijs},-`;

    priceSection.style.opacity = "0";

    setTimeout(() => {
        priceSection.style.display = "none";

        overlay.style.display = "flex";
        overlay.style.opacity = "0";

        setTimeout(() => {
            overlay.style.opacity = "1";
            document.querySelector(".overlay-box").style.opacity = "1";
            document.querySelector(".overlay-box").style.transform = "scale(1)";

            setTimeout(() => {
                form.reset();
                calculatePrice();
            }, 300);

        }, 10);
    }, 200);
});


const closeButton = document.querySelector(".close-overlay");

closeButton.addEventListener("click", () => {
    overlay.style.opacity = "0";
    document.querySelector(".overlay-box").style.opacity = "0";
    document.querySelector(".overlay-box").style.transform = "scale(0.97)";

    priceSection.style.display = "block";
    priceSection.style.opacity = "0";

    setTimeout(() => {
        priceSection.style.opacity = "1";
    }, 10);

    setTimeout(() => {
        overlay.style.display = "none";
    }, 400);
});


// === CONTACTFORMULIER IN OVERLAY ===

// Elementen
const particulierRadio = document.getElementById("type-particulier");
const bedrijfRadio = document.getElementById("type-bedrijf");
const bedrijfInput = document.getElementById("bedrijf");
const bedrijfWrapper = document.querySelector(".input-wrapper");
const contactForm = document.querySelector(".contact-form");

// Safety
if (contactForm && particulierRadio && bedrijfRadio && bedrijfInput) {

    // Bedrijfsnaam verplicht bij "Bedrijf"
    function updateBedrijfVerplichtheid() {
        bedrijfInput.required = bedrijfRadio.checked;
    }

    function updateOptioneelLabel() {
        const noChoice = !particulierRadio.checked && !bedrijfRadio.checked;
        const isParticulier = particulierRadio.checked;
        const isEmpty = bedrijfInput.value.trim() === "";

        // Geen keuze → geen tekst
        if (noChoice) {
            bedrijfWrapper.classList.remove("show-optional");
            return;
        }

        // Particulier + leeg → toon "optioneel"
        if (isParticulier && isEmpty) {
            bedrijfWrapper.classList.add("show-optional");
        } else {
            bedrijfWrapper.classList.remove("show-optional");
        }
    }

    // Validatie bij submit
    contactForm.addEventListener("submit", function (e) {
        const klanttypeGekozen = particulierRadio.checked || bedrijfRadio.checked;

        if (!klanttypeGekozen || !contactForm.checkValidity()) {
            e.preventDefault();
            contactForm.reportValidity();
        }
    });

    // Event listeners
    particulierRadio.addEventListener("change", () => {
        updateBedrijfVerplichtheid();
        updateOptioneelLabel();
    });

    bedrijfRadio.addEventListener("change", () => {
        updateBedrijfVerplichtheid();
        updateOptioneelLabel();
    });

    bedrijfInput.addEventListener("input", updateOptioneelLabel);

    // Initial state
    updateBedrijfVerplichtheid();
    updateOptioneelLabel();

    // Hidden fields invullen vóór verzenden
    contactForm.addEventListener("submit", function () {
        // Diensttype
        const dienst = document.querySelector('input[name="service"]:checked');
        document.getElementById("hidden-diensttype").value = dienst ? dienst.value : "";

        // Duurtijd
        document.getElementById("hidden-duurtijd").value = document.getElementById("duration-input").value;

        // Extra opties
        const extras = [...document.querySelectorAll('input[name="extra"]:checked')]
            .map(x => x.value)
            .join(", ");
        document.getElementById("hidden-extra").value = extras;

        // Prijsschatting
        const prijs = calculatePrice();
        document.getElementById("hidden-price").value = `€${prijs},-`;
    });
}