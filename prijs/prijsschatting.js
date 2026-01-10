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

    if (raw === "") {
        input.value = "";
        return;
    }

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
        }, 10);
    }, 200);
});


// ===============================
// OVERLAY SLUITEN
// ===============================
document.querySelector(".close-overlay").addEventListener("click", () => {
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


// ===============================
// CONTACTFORM (FORM SUBMIT)
// ===============================
const particulierRadio = document.getElementById("type-particulier");
const bedrijfRadio = document.getElementById("type-bedrijf");
const bedrijfInput = document.getElementById("bedrijf");
const bedrijfWrapper = document.querySelector(".input-wrapper");
const contactForm = document.querySelector(".contact-form");

// 🔹 TEST OF HET FORM BESTAAT
console.log("contactForm:", contactForm);

// 🔹 TEST OF SUBMIT EVENT WORDT AFGEVUREN
if (contactForm) {
    contactForm.addEventListener("submit", function(e){
        console.log("Form is being submitted!");
    });
}

// Safety check
if (contactForm && particulierRadio && bedrijfRadio && bedrijfInput) {

    // Bedrijfsnaam verplicht indien "Bedrijf"
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

    particulierRadio.addEventListener("change", () => {
        updateBedrijfVerplichtheid();
        updateOptioneelLabel();
    });

    bedrijfRadio.addEventListener("change", () => {
        updateBedrijfVerplichtheid();
        updateOptioneelLabel();
    });

    bedrijfInput.addEventListener("input", updateOptioneelLabel);

    updateBedrijfVerplichtheid();
    updateOptioneelLabel();

    // ===============================
    // ENIGE SUBMIT LISTENER
    // ===============================
    contactForm.addEventListener("submit", function (e) {

        // 🔹 Hidden fields invullen
        const dienst = document.querySelector('#price-form input[name="service"]:checked');
        document.getElementById("hidden-diensttype").value = dienst ? dienst.value : "";

        document.getElementById("hidden-duurtijd").value =
            document.getElementById("duration-input").value;

        const extras = [...document.querySelectorAll('#price-form input[name="extra"]:checked')]
            .map(x => x.value)
            .join(", ");
        document.getElementById("hidden-extra").value = extras;

        const prijs = calculatePrice();
        document.getElementById("hidden-price").value = `€${prijs},-`;

        // 🔹 Bedrijf verplicht indien nodig
        bedrijfInput.required = bedrijfRadio.checked;

        // 🔹 Validatie
        if (!contactForm.checkValidity()) {
            e.preventDefault();
            contactForm.reportValidity();
            return;
        }

        // 🚀 GEEN preventDefault → FormSubmit stuurt mail
    });
}

