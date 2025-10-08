export function initAntecedentesModule() {
  function toggleFields(radioName, relatedIds) {
    const radios = document.getElementsByName(radioName);
    radios.forEach(radio => {
      radio.addEventListener("change", () => {
        const disable = radio.value === "no" && radio.checked;
        relatedIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.disabled = disable;
            if (disable) el.value = "";
          }
        });
      });
    });
  }

  // Embarazos → desactiva cantidad
  toggleFields("embarazos", ["cantidadEmbarazos"]);

  // Transfusiones → desactiva fecha
  toggleFields("transfusiones", ["fechaTransfusiones"]);

  // Trasplantes → desactiva PD, fecha y bloque HLA
  toggleFields("trasplantes", [
    "pdTransfusiones",
    "fechaTrasplante",
    "hlaA1",
    "hlaA2",
    "hlaB1",
    "hlaB2",
    "hlaC1",
    "hlaC2",
    "hlaDR1",
    "hlaDR2",
    "hlaDQA11",
    "hlaDQA12",
    "hlaDQB11",
    "hlaDQB12",
    "hlaDPA11",
    "hlaDPA12",
    "hlaDPB11",
    "hlaDPB12",
    "grupoSanguineo"
  ]);
}
