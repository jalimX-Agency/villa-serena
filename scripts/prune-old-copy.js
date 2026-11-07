// Removes copy that belonged to the pages merged by the client brief, and fixes the leftovers.
const fs = require("fs");
const fix = {
  fr: {
    contactInfo: ["Villa entière, en exclusivité", "6 suites + 1 studio, 14 couchages", "Cuisine familiale sur demande", "Hammam & massages sur réservation", "Transfert aéroport disponible"],
    galleryDesc: "Parcourez Villa Serena en images : le riad et ses suites, le pavillon, le Studio, la piscine de 11 × 5 m, le jardin d'oliviers et le hammam, route de l'Ourika.",
    contactDesc: "Une question sur la villa, un séjour ou un événement ? Écrivez-nous par formulaire, email ou WhatsApp. Villa Serena, route de l'Ourika, km 17, Marrakech.",
  },
  en: {
    contactInfo: ["Whole villa, exclusively yours", "6 suites + 1 studio, sleeps 14", "Home cooking on request", "Hammam & massages by appointment", "Airport transfer available"],
    galleryDesc: "Browse Villa Serena in pictures: the riad and its suites, the pavilion, the Studio, the 11 × 5 m pool, the olive garden and the hammam, on the Ourika road.",
    contactDesc: "A question about the villa, a stay or an event? Reach us by form, email or WhatsApp. Villa Serena, Ourika road, km 17, Marrakech.",
  },
};
for (const lang of ["fr", "en"]) {
  const file = `src/messages/${lang}.json`;
  const j = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const k of ["restauration", "bienEtre", "excursions", "intro"]) delete j.services[k];
  for (const k of ["retraitesYoga", "golf", "mariagesEvents", "intro"]) delete j.experiences[k];
  for (const k of ["restauration", "bienEtre", "excursions", "retraitesYoga", "golf", "mariagesEvents"]) delete j.seo[k];
  j.contact.info_items = fix[lang].contactInfo;
  j.seo.gallery.description = fix[lang].galleryDesc;
  j.seo.contact.description = fix[lang].contactDesc;
  fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
}
console.log("old copy pruned");
