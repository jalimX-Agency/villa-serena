// Blog articles 1–3 from the client brief's appendix (Nov 2026). French is the brief's text,
// word for word, with the internal links it specifies; English is our translation.
// Content is trusted HTML authored here (h2, p, ul, table, a) and styled by .prose-villa.
// Initial import only: covers and in-text photos are then set by scripts/blog-pexels-photos.ts,
// and the articles are edited from the admin (/admin/blog) — do not re-run over live content.
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const R2 = (process.env.R2_ENDPOINT ?? "").replace(/\/$/, "") + "/site";

const posts = [
  {
    slug: "que-faire-vallee-ourika",
    order: 1,
    category: "guides",
    readTime: 6,
    image: `${R2}/welcome-jardin.jpg`,
    imageAlt: "Oliviers du jardin de Villa Serena, sur la route de la vallée de l'Ourika",
    imageAltEn: "Olive trees in the Villa Serena garden, on the road to the Ourika valley",
    metaTitle: "Que faire dans la vallée de l'Ourika ? | Villa Serena",
    metaTitleEn: "What to Do in the Ourika Valley? | Villa Serena",
    metaDescription: "Cascades de Setti Fatma, souk du lundi, jardins et villages berbères : nos conseils pour une journée réussie dans la vallée de l'Ourika.",
    metaDescriptionEn: "Setti Fatma waterfalls, the Monday souk, gardens and Berber villages: our tips for a great day in the Ourika valley.",
    title: "Que faire dans la vallée de l'Ourika ? Le guide de nos hôtes",
    titleEn: "What to do in the Ourika valley? Our guests' guide",
    excerpt: "Au sud de Marrakech, la route de l'Ourika file vers les sommets de l'Atlas. En moins d'une heure, la ville rose laisse place aux vergers, aux villages de pisé et au torrent qui donne son nom à la vallée. Installés au kilomètre 17 de cette route, nous la parcourons depuis des années. Voici ce que nous conseillons à nos hôtes pour en profiter pleinement.",
    excerptEn: "South of Marrakech, the Ourika road heads for the peaks of the Atlas. In under an hour, the pink city gives way to orchards, mud-brick villages and the river that gives the valley its name. Based at kilometre 17 on this road, we have been exploring it for years. Here is what we recommend to our guests to make the most of it.",
    content: `
<h2>Une vallée à la porte de Marrakech</h2>
<p>La vallée de l'Ourika commence à une trentaine de kilomètres de la médina et remonte jusqu'au village de Setti Fatma, à environ 1 500 mètres d'altitude. En chemin, le paysage change à chaque virage : oliveraies, champs en terrasses, berges ombragées où les familles marrakchies viennent chercher la fraîcheur l'été.</p>
<p>C'est l'excursion idéale pour une première découverte de l'Atlas, sans longue route ni nuit en montagne. On part après le petit-déjeuner, on rentre pour le dîner.</p>
<h2>Les cascades de Setti Fatma</h2>
<p>Au bout de la route goudronnée, Setti Fatma est le point de départ de la randonnée la plus connue de la vallée : la montée vers une série de sept cascades. La première se rejoint en une trentaine de minutes de marche, par un sentier rocailleux qui longe le torrent et ses petits cafés. Les suivantes demandent davantage d'effort et un bon pied.</p>
<p>Nos conseils : de vraies chaussures de marche, de l'eau, et un guide local pour les cascades supérieures. Le débit dépend des pluies et de la fonte des neiges : le spectacle est plus généreux au printemps qu'à la fin de l'été. Évitez si possible le week-end, plus fréquenté.</p>
<h2>Le souk du lundi à Tnine Ourika</h2>
<p>Si votre séjour compte un lundi, ne le manquez pas. Le village de Tnine Ourika accueille chaque semaine un grand souk rural où les habitants des montagnes viennent vendre et acheter : épices, fruits et légumes, poteries, outils, bétail. Peu de touristes, beaucoup d'authenticité. Arrivez tôt le matin, quand le marché est le plus animé.</p>
<h2>Jardins et senteurs de la vallée</h2>
<p>La terre de l'Ourika est généreuse, et plusieurs jardins se visitent le long de la route.</p>
<ul>
<li>Le jardin Anima, imaginé par l'artiste André Heller, mêle plantes, sculptures et vues sur l'Atlas, à une dizaine de kilomètres de la villa.</li>
<li>Le jardin bio-aromatique de l'Ourika, à Tnine Ourika, présente les plantes aromatiques et médicinales de la région.</li>
<li>Le jardin du safran, également à Tnine Ourika, fait découvrir la culture de l'épice la plus précieuse du Maroc.</li>
</ul>
<p>Pensez à vérifier les horaires d'ouverture et les conditions de visite sur leurs sites avant de partir.</p>
<h2>Villages berbères et artisanat</h2>
<p>Entre les grands sites, la vallée se découvre aussi à pied, de village en village. Les maisons de terre s'accrochent aux pentes, les femmes travaillent dans les coopératives, les enfants guident les chèvres. Une halte dans une coopérative permet de voir le travail de l'huile d'argan ou du tissage, et de rapporter un souvenir fait sur place.</p>
<h2>Organiser sa journée depuis Villa Serena</h2>
<p>La villa est sur la route même de la vallée : Setti Fatma est à environ 30 minutes, contre plus d'une heure depuis le centre de Marrakech. Vous partez plus tard, vous rentrez plus tôt, et le soir, <a href="/fr/la-villa">la piscine et le hammam</a> vous attendent.</p>
<p>Une journée type : départ à 9 h, souk de Tnine Ourika (le lundi) ou jardin en route, marche vers les cascades en fin de matinée, déjeuner au bord du torrent, retour à la villa en milieu d'après-midi. Sur demande, nous <a href="/fr/services#activites">organisons l'excursion</a> avec nos partenaires, avec guide si vous le souhaitez.</p>`,
    contentEn: `
<h2>A valley on Marrakech's doorstep</h2>
<p>The Ourika valley begins about thirty kilometres from the medina and climbs to the village of Setti Fatma, at around 1,500 metres. Along the way the landscape changes at every bend: olive groves, terraced fields, shady riverbanks where Marrakech families come to cool off in summer.</p>
<p>It is the ideal trip for a first taste of the Atlas, with no long drive and no night in the mountains. You leave after breakfast and are back for dinner.</p>
<h2>The Setti Fatma waterfalls</h2>
<p>At the end of the paved road, Setti Fatma is the starting point of the valley's best-known hike: the climb to a series of seven waterfalls. The first is about a thirty-minute walk away, along a rocky path that follows the river and its small cafés. The next ones take more effort and a sure foot.</p>
<p>Our tips: proper walking shoes, water, and a local guide for the upper falls. The flow depends on rain and snowmelt: the show is more generous in spring than at the end of summer. Avoid weekends if you can, as they are busier.</p>
<h2>The Monday souk in Tnine Ourika</h2>
<p>If your stay includes a Monday, don't miss it. Every week the village of Tnine Ourika hosts a large rural souk where people from the mountains come to buy and sell: spices, fruit and vegetables, pottery, tools, livestock. Few tourists, plenty of authenticity. Arrive early in the morning, when the market is at its liveliest.</p>
<h2>Gardens and scents of the valley</h2>
<p>The Ourika soil is generous, and several gardens can be visited along the road.</p>
<ul>
<li>The Anima garden, created by the artist André Heller, combines plants, sculptures and views of the Atlas, about ten kilometres from the villa.</li>
<li>The Ourika bio-aromatic garden, in Tnine Ourika, presents the region's aromatic and medicinal plants.</li>
<li>The saffron garden, also in Tnine Ourika, introduces the growing of Morocco's most precious spice.</li>
</ul>
<p>Check opening hours and visiting conditions on their websites before you set off.</p>
<h2>Berber villages and crafts</h2>
<p>Between the main sights, the valley can also be explored on foot, from village to village. Earth houses cling to the slopes, women work in the cooperatives, children lead the goats. A stop at a cooperative lets you see argan oil being made or weaving, and bring home a souvenir made on the spot.</p>
<h2>Planning your day from Villa Serena</h2>
<p>The villa is right on the valley road: Setti Fatma is about 30 minutes away, compared with over an hour from central Marrakech. You leave later, you come back earlier, and in the evening <a href="/en/la-villa">the pool and the hammam</a> are waiting.</p>
<p>A typical day: leave at 9 am, the Tnine Ourika souk (on Mondays) or a garden on the way, a walk to the waterfalls in the late morning, lunch by the river, back at the villa by mid-afternoon. On request, we <a href="/en/services#activites">arrange the excursion</a> with our partners, with a guide if you wish.</p>`,
  },
  {
    slug: "golf-marrakech-route-ourika",
    order: 2,
    category: "golf",
    readTime: 5,
    image: `${R2}/hero-main.jpg`,
    imageAlt: "Villa Serena et sa piscine, camp de base d'un séjour golf à Marrakech",
    imageAltEn: "Villa Serena and its pool, a base for a golf trip in Marrakech",
    metaTitle: "Golf à Marrakech : 14 parcours proches | Villa Serena",
    metaTitleEn: "Golf in Marrakech: 14 Courses Nearby | Villa Serena",
    metaDescription: "Palm Ourika, Akenza, Samanah, Amelkis… 14 parcours à moins de 50 minutes de Villa Serena, et nos conseils pour un séjour golf à Marrakech.",
    metaDescriptionEn: "Palm Ourika, Akenza, Samanah, Amelkis… 14 courses within 50 minutes of Villa Serena, and our tips for a golf trip in Marrakech.",
    title: "Golf à Marrakech : 14 parcours autour de la route de l'Ourika",
    titleEn: "Golf in Marrakech: 14 courses around the Ourika road",
    excerpt: "Marrakech est devenue l'une des grandes destinations de golf d'hiver. Soleil presque garanti, greens soignés, et partout la silhouette enneigée de l'Atlas en toile de fond. Depuis Villa Serena, au kilomètre 17 de la route de l'Ourika, quatorze parcours sont accessibles en moins de 50 minutes. Voici comment en profiter.",
    excerptEn: "Marrakech has become one of the great winter golf destinations. Near-guaranteed sunshine, well-kept greens, and everywhere the snowy outline of the Atlas as a backdrop. From Villa Serena, at kilometre 17 on the Ourika road, fourteen courses are within 50 minutes. Here is how to make the most of them.",
    content: `
<h2>Pourquoi jouer au golf à Marrakech</h2>
<p>Le climat fait la différence. D'octobre à mai, les journées sont douces et lumineuses, idéales pour enchaîner les parcours quand l'Europe est sous la pluie. Les clubs sont nombreux et variés : parcours historiques au cœur des palmeraies, tracés modernes aux paysages désertiques, golfs de resort plus accessibles. Chacun y trouve son terrain de jeu, du joueur confirmé au débutant.</p>
<h2>Les parcours les plus proches de la villa</h2>
<p>Deux parcours sont à une douzaine de minutes seulement.</p>
<ul>
<li>Palm Ourika : sur le même axe que la villa, avec une vue dégagée sur l'Atlas. Le plus pratique pour un départ matinal.</li>
<li>Akenza : le plus récent de Marrakech, réputé pour son tracé spectaculaire entre ravins et oueds asséchés.</li>
</ul>
<h2>Tous les parcours, par temps de trajet</h2>
<table>
<thead><tr><th>Parcours</th><th>Depuis la villa</th></tr></thead>
<tbody>
<tr><td>Palm Ourika · Akenza</td><td>~12 min</td></tr>
<tr><td>Noria · Atlas Golf · Argan · Montgomerie</td><td>~30 min</td></tr>
<tr><td>Samanah · Royal Palm</td><td>~35 min</td></tr>
<tr><td>Al Maaden · Golf Royal · Amelkis (27 trous) · Amelkis Resort (9 trous)</td><td>~40 min</td></tr>
<tr><td>Assoufid</td><td>~45 min</td></tr>
<tr><td>La Palmeraie</td><td>~50 min</td></tr>
</tbody>
</table>
<p>Les temps sont donnés à titre indicatif, hors heures de pointe.</p>
<h2>Nos conseils pour organiser votre séjour golf</h2>
<ul>
<li>La saison : d'octobre à mai pour le confort ; l'été, jouez tôt le matin.</li>
<li>Les green fees : réservez à l'avance, surtout de janvier à avril et pendant les vacances scolaires européennes.</li>
<li>Le rythme : un parcours par jour, en alternant parcours proches et plus lointains, laisse le temps de profiter de la villa.</li>
<li>Le matériel : la plupart des clubs louent sacs et voiturettes, mais beaucoup de joueurs préfèrent voyager avec leur équipement.</li>
</ul>
<h2>Villa Serena, votre camp de base</h2>
<p>Un <a href="/fr/experiences#golf">séjour golf</a> entre amis prend une autre dimension quand on rentre le soir dans une maison à soi. Sur demande, nous organisons avec nos partenaires vos transferts vers les golfs et la réservation de vos green fees. Au retour, <a href="/fr/services#bien-etre">le hammam et la salle de massage</a> soulagent les muscles, la piscine attend les plus courageux, et la cuisinière prépare le dîner pour toute l'équipe. Avec <a href="/fr/suites">sept hébergements</a>, chacun garde son intimité.</p>`,
    contentEn: `
<h2>Why play golf in Marrakech</h2>
<p>The climate makes the difference. From October to May, days are mild and bright, ideal for playing round after round while Europe is under the rain. Clubs are many and varied: historic courses in the heart of the palm groves, modern layouts in desert landscapes, more accessible resort courses. Everyone finds their playground, from experienced players to beginners.</p>
<h2>The courses closest to the villa</h2>
<p>Two courses are only about twelve minutes away.</p>
<ul>
<li>Palm Ourika: on the same road as the villa, with an open view of the Atlas. The most convenient for an early tee time.</li>
<li>Akenza: Marrakech's newest course, known for its spectacular layout between ravines and dry riverbeds.</li>
</ul>
<h2>Every course, by travel time</h2>
<table>
<thead><tr><th>Course</th><th>From the villa</th></tr></thead>
<tbody>
<tr><td>Palm Ourika · Akenza</td><td>~12 min</td></tr>
<tr><td>Noria · Atlas Golf · Argan · Montgomerie</td><td>~30 min</td></tr>
<tr><td>Samanah · Royal Palm</td><td>~35 min</td></tr>
<tr><td>Al Maaden · Royal Golf · Amelkis (27 holes) · Amelkis Resort (9 holes)</td><td>~40 min</td></tr>
<tr><td>Assoufid</td><td>~45 min</td></tr>
<tr><td>La Palmeraie</td><td>~50 min</td></tr>
</tbody>
</table>
<p>Times are indicative, outside rush hours.</p>
<h2>Our tips for planning your golf trip</h2>
<ul>
<li>The season: October to May for comfort; in summer, play early in the morning.</li>
<li>Green fees: book ahead, especially from January to April and during European school holidays.</li>
<li>The pace: one course a day, alternating nearby and more distant ones, leaves time to enjoy the villa.</li>
<li>Equipment: most clubs rent bags and buggies, but many players prefer to travel with their own gear.</li>
</ul>
<h2>Villa Serena, your base</h2>
<p>A <a href="/en/experiences#golf">golf trip</a> with friends takes on another dimension when you come home in the evening to a house of your own. On request, we arrange your transfers to the courses and your green fee bookings with our partners. Back home, <a href="/en/services#bien-etre">the hammam and the massage room</a> ease tired muscles, the pool awaits the bravest, and the cook prepares dinner for the whole team. With <a href="/en/suites">seven places to sleep</a>, everyone keeps their privacy.</p>`,
  },
  {
    slug: "marrakech-en-famille",
    order: 3,
    category: "famille",
    readTime: 5,
    image: `${R2}/exp-petanque.jpg`,
    imageAlt: "Terrain de pétanque dans le jardin d'un hectare de Villa Serena",
    imageAltEn: "Pétanque court in Villa Serena's one-hectare garden",
    metaTitle: "Marrakech en famille : nos idées | Villa Serena",
    metaTitleEn: "Marrakech with Kids: Our Ideas | Villa Serena",
    metaDescription: "Parc aquatique, mini ferme, vallée de l'Ourika, désert d'Agafay : nos idées pour des vacances en famille à Marrakech, dans une villa privée.",
    metaDescriptionEn: "Water park, mini farm, Ourika valley, Agafay desert: our ideas for a family holiday in Marrakech, in a private villa.",
    title: "Marrakech en famille : nos idées pour des vacances réussies avec les enfants",
    titleEn: "Marrakech with the family: our ideas for a great holiday with children",
    excerpt: "Marrakech enchante les enfants autant que les parents : des couleurs partout, des animaux, des montagnes à l'horizon et du soleil presque toute l'année. Encore faut-il trouver le bon rythme entre découvertes et repos. Voici nos idées, testées avec les familles que nous accueillons.",
    excerptEn: "Marrakech delights children as much as parents: colour everywhere, animals, mountains on the horizon and sunshine almost all year round. You still need the right balance between discovery and rest. Here are our ideas, tried out with the families we welcome.",
    content: `
<h2>Choisir un hébergement adapté</h2>
<p>Avec des enfants, l'espace change tout. Une villa privée permet à chacun de garder son rythme : siestes, repas partagés aux horaires que vous choisissez, jeux dans le jardin sans déranger personne. Pour les familles nombreuses ou les tribus de plusieurs générations, des espaces séparés sont précieux : les grands-parents d'un côté, les parents et les enfants de l'autre, et tout le monde réuni à table.</p>
<h2>Au jardin : la mini ferme, la piscine et les jeux</h2>
<p>À Villa Serena, les journées commencent souvent à la <a href="/fr/la-villa">mini ferme</a>, où vivent chèvres, brebis, poules et canards, sous l'œil du paon. Le jardin d'un hectare se prête aux parties de pétanque, de badminton et de ping-pong.</p>
<p>La piscine privée de 11 × 5 m va de 80 cm à 1,80 m de profondeur. Elle n'est pas équipée de barrière : les enfants s'y baignent toujours sous la surveillance d'un adulte.</p>
<h2>Une journée au parc aquatique</h2>
<p>Juste à côté de la villa, le parc aquatique du Pickalbatros Aqua Fun Club, l'un des plus grands de Marrakech, est accessible à la journée (entrée payante). Toboggans pour petits et grands, bassins à vagues : une valeur sûre pour les journées chaudes. Vérifiez les tarifs et les horaires sur son site avant de partir.</p>
<h2>Des excursions à hauteur d'enfant</h2>
<ul>
<li>La vallée de l'Ourika : la première cascade de Setti Fatma est accessible aux enfants bons marcheurs, en une trentaine de minutes. Bonnes chaussures indispensables.</li>
<li>Le désert d'Agafay : à environ 35 minutes, ses étendues de pierre offrent un avant-goût du désert. Balade à dos de dromadaire ou en quad selon l'âge.</li>
<li>La médina : le matin, quand il fait encore frais, en tenant bien les mains dans les ruelles animées.</li>
</ul>
<p>Toutes nos <a href="/fr/services#activites">excursions</a> s'organisent sur demande.</p>
<h2>Nos conseils pratiques</h2>
<ul>
<li>La saison : le printemps et l'automne sont parfaits ; l'été, réservez les sorties pour le matin et la fin de journée.</li>
<li>Le rythme : une excursion un jour sur deux, et des journées à la villa entre deux.</li>
<li>Les repas : ils sont servis à toute la tablée, aux horaires convenus avec la gouvernante. Les enfants peuvent dîner plus tôt ou à part de leurs parents s'ils le souhaitent.</li>
<li>La taxe de séjour : les enfants de moins de 12 ans en sont exonérés.</li>
</ul>`,
    contentEn: `
<h2>Choosing the right place to stay</h2>
<p>With children, space changes everything. A private villa lets everyone keep their own rhythm: naps, shared meals at times you choose, games in the garden without disturbing anyone. For large families or multi-generation groups, separate spaces are precious: grandparents on one side, parents and children on the other, and everyone together at the table.</p>
<h2>In the garden: the mini farm, the pool and games</h2>
<p>At Villa Serena, days often start at the <a href="/en/la-villa">mini farm</a>, home to goats, sheep, hens and ducks, watched over by the peacock. The one-hectare garden is perfect for games of pétanque, badminton and table tennis.</p>
<p>The 11 × 5 m private pool is 80 cm to 1.80 m deep. It has no fence: children always swim under adult supervision.</p>
<h2>A day at the water park</h2>
<p>Right next to the villa, the Pickalbatros Aqua Fun Club water park, one of the largest in Marrakech, is open by the day (paid entry). Slides for young and old, wave pools: a safe bet for hot days. Check prices and opening times on its website before you go.</p>
<h2>Excursions for children</h2>
<ul>
<li>The Ourika valley: the first Setti Fatma waterfall is within reach of children who walk well, in about thirty minutes. Good shoes are a must.</li>
<li>The Agafay desert: about 35 minutes away, its stony plains give a foretaste of the desert. Camel rides or quad biking depending on age.</li>
<li>The medina: in the morning, while it is still cool, holding hands tightly in the busy alleys.</li>
</ul>
<p>All our <a href="/en/services#activites">excursions</a> are arranged on request.</p>
<h2>Our practical tips</h2>
<ul>
<li>The season: spring and autumn are perfect; in summer, keep outings for the morning and late afternoon.</li>
<li>The pace: an excursion every other day, with days at the villa in between.</li>
<li>Meals: they are served to the whole table, at times agreed with the housekeeper. Children can eat earlier or separately from their parents if they wish.</li>
<li>Tourist tax: children under 12 are exempt.</li>
</ul>`,
  },
];

(async () => {
  for (const p of posts) {
    const data = { ...p, author: "L'équipe Villa Serena", published: true, featured: p.order === 1 };
    await db.blogPost.upsert({ where: { slug: p.slug }, update: data, create: data });
    console.log("upserted", p.slug);
  }
})().finally(() => db.$disconnect());
