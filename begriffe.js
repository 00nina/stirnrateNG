/* =====================================================================
   BEGRIFFE UND KATEGORIEN
   =====================================================================
   Hier stehen alle fertigen Kategorien der App. Das ist die Datei, die
   du am häufigsten anpassen wirst.

   So änderst du etwas:
   - Begriff hinzufügen: in der Liste "begriffe" einen neuen Eintrag in
     Anführungszeichen ergänzen, mit Komma vom nächsten getrennt.
   - Begriff löschen: den Eintrag samt Komma entfernen.
   - Neue Kategorie: einen ganzen Block { ... } kopieren, darunter
     einfügen und id, name, emoji, farbe und begriffe ändern.
     Die id muss einmalig sein und darf nur Kleinbuchstaben enthalten.

   "Dies & Das" brauchst du nicht zu pflegen: Die App mischt dafür
   automatisch die Begriffe aus allen Kategorien.

   Nach dem Hochladen der geänderten Datei dauert es ein paar Minuten.
   Danach die App auf dem Handy einmal ganz schließen und neu öffnen.
   ===================================================================== */

const KATEGORIEN = [
  {
    id: "tiere",
    name: "Tiere",
    emoji: "🦊",
    farbe: "#1FD1A5",
    begriffe: [
      "Elefant", "Giraffe", "Pinguin", "Känguru", "Faultier", "Flamingo", "Koala", "Nilpferd",
      "Nashorn", "Zebra", "Löwe", "Tiger", "Gepard", "Eisbär", "Braunbär", "Wolf", "Fuchs",
      "Dachs", "Igel", "Eichhörnchen", "Maulwurf", "Fledermaus", "Waschbär", "Stinktier",
      "Biber", "Otter", "Robbe", "Walross", "Delfin", "Blauwal", "Hai", "Seepferdchen",
      "Qualle", "Tintenfisch", "Hummer", "Clownfisch", "Krokodil", "Chamäleon", "Schildkröte",
      "Klapperschlange", "Frosch", "Schnecke", "Regenwurm", "Marienkäfer", "Schmetterling",
      "Libelle", "Wespe", "Stechmücke", "Vogelspinne", "Skorpion", "Papagei", "Pfau", "Eule",
      "Specht", "Storch", "Schwan", "Möwe", "Kolibri", "Strauß", "Truthahn", "Hahn", "Esel",
      "Alpaka", "Kamel", "Schaf", "Ziege", "Wildschwein", "Meerschweinchen", "Hamster",
      "Goldfisch", "Dackel", "Mops", "Golden Retriever", "Schäferhund", "Pudel", "Gorilla",
      "Schimpanse", "Erdmännchen", "Panda", "Elch", "Rentier", "Murmeltier", "Kakerlake", "Schnabeltier", 
      "Geko", "Nacktmull", "Axolotl", "Weisskopfseeadler"
    ]
  },
  {
    id: "promis",
    name: "Promis",
    emoji: "⭐",
    farbe: "#FFB627",
    begriffe: [
      "Taylor Swift", "Beyoncé", "Rihanna", "Lady Gaga", "Adele", "Ed Sheeran", "Harry Styles",
      "Billie Eilish", "Dua Lipa", "Ariana Grande", "Justin Bieber", "Shakira", "Madonna",
      "Britney Spears", "Jennifer Lopez", "Miley Cyrus", "Selena Gomez", "Katy Perry",
      "Michael Jackson", "Elvis Presley", "Helene Fischer", "Heidi Klum", "Angela Merkel",
      "Thomas Gottschalk", "Günther Jauch", "Stefan Raab", "Barbara Schöneberger",
      "Joko Winterscheidt", "Klaas Heufer-Umlauf", "Elyas M'Barek", "Matthias Schweighöfer",
      "Til Schweiger", "Lena Meyer-Landrut", "Nena", "Herbert Grönemeyer", "Udo Lindenberg",
      "Dieter Bohlen", "Bill Kaulitz", "Shirin David", "Nina Chuba", "Mark Forster",
      "Sarah Connor", "Thomas Müller", "Manuel Neuer", "Leon Goretzka", "Lionel Messi",
      "Cristiano Ronaldo", "David Beckham", "Serena Williams", "Dirk Nowitzki",
      "Michael Schumacher", "Steffi Graf", "Boris Becker", "Leonardo DiCaprio", "Brad Pitt",
      "Angelina Jolie", "Jennifer Aniston", "Julia Roberts", "Emma Watson", "Zendaya",
      "Timothée Chalamet", "Ryan Gosling", "Margot Robbie", "Tom Hanks", "Johnny Depp",
      "Will Smith", "Keanu Reeves", "Meryl Streep", "Kim Kardashian", "Paris Hilton",
      "Oprah Winfrey", "Barack Obama", "Michelle Obama", "König Charles", "Prinz Harry",
      "Meghan Markle", "Prinzessin Kate", "Bill Gates", "Albert Einstein", "Marie Curie",
      "Marilyn Monroe", "Audrey Hepburn", "Coco Chanel", "Karl Lagerfeld", "Frida Kahlo", "Rosa Parks",
       "Serena Williams", "Tina Turner", "Astrid Lindgren", "Simone Biles",
    ]
  },
  {
    id: "filme",
    name: "Filme & Serien",
    emoji: "🎬",
    farbe: "#FF5C5C",
    begriffe: [
      "Titanic", "Harry Potter", "Der König der Löwen", "Die Eiskönigin", "Fluch der Karibik",
      "Der Herr der Ringe", "Star Wars", "Avatar", "Barbie", "Dirty Dancing", "Pretty Woman",
      "Mamma Mia!", "Twilight", "Die Tribute von Panem", "Findet Nemo", "Shrek", "Ice Age",
      "Toy Story", "Ratatouille", "Kevin – Allein zu Haus", "Forrest Gump", "Jurassic Park",
      "Der Pate", "Matrix", "James Bond", "Fack ju Göhte", "Keinohrhasen",
      "Der Schuh des Manitu", "Tatsächlich… Liebe", "Bridget Jones", "Der Teufel trägt Prada",
      "Natürlich blond", "La La Land", "High School Musical", "Grease", "Sister Act",
      "Ghostbusters", "Zurück in die Zukunft", "E.T.", "Der weiße Hai", "Top Gun", "Rocky",
      "Spider-Man", "Batman", "Die Unglaublichen", "Oben", "Vaiana", "Arielle", "Aladdin",
      "Das Dschungelbuch", "Bambi", "Friends", "Game of Thrones", "Stranger Things",
      "Haus des Geldes", "Bridgerton", "Squid Game", "Breaking Bad", "Grey's Anatomy",
      "Gilmore Girls", "Sex and the City", "Gossip Girl", "How I Met Your Mother",
      "The Big Bang Theory", "Die Simpsons", "SpongeBob Schwammkopf", "Tatort", "GZSZ",
      "Germany's Next Topmodel", "Der Bachelor", "Dschungelcamp", "Wer wird Millionär?",
      "The Crown", "Wednesday", "Emily in Paris", "Sherlock", "Desperate Housewives",
      "Sesamstraße", "Biene Maja", "Pippi Langstrumpf"
    ]
  },
  {
    id: "berufe",
    name: "Berufe",
    emoji: "🧑‍🚒",
    farbe: "#4D7CFE",
    begriffe: [
      "Feuerwehrfrau", "Ärztin", "Pilot", "Friseurin", "Bäcker", "Polizistin", "Lehrerin",
      "Tierärztin", "Zahnarzt", "Koch", "Kellnerin", "Astronautin", "Richter", "Anwältin",
      "Landwirt", "Gärtnerin", "Maurer", "Elektriker", "Klempner", "Schornsteinfeger",
      "Postbote", "Busfahrerin", "Lokführer", "Taxifahrer", "Flugbegleiterin", "Kapitän",
      "Fotografin", "Journalistin", "Nachrichtensprecher", "Schauspielerin", "Opernsängerin",
      "DJ", "Balletttänzerin", "Model", "Influencerin", "Zauberer", "Clown", "Detektiv",
      "Bodyguard", "Rettungsschwimmer", "Hebamme", "Krankenpfleger", "Apothekerin",
      "Physiotherapeutin", "Psychologin", "Fitnesstrainer", "Schiedsrichter", "Skilehrerin",
      "Bergführer", "Förster", "Imker", "Fischer", "Metzger", "Konditorin", "Barkeeper",
      "Bestatter", "Pfarrer", "Bürgermeisterin", "Dolmetscherin", "Architektin",
      "Programmiererin", "Steuerberater", "Immobilienmakler", "Kassiererin", "Fensterputzer",
      "Dachdecker", "Tischlerin", "Schneiderin", "Juwelier", "Tätowierer", "Kosmetikerin",
      "Erzieherin", "Bibliothekarin", "Archäologin", "Meeresbiologin", "Tierpfleger",
      "Stuntman", "Regisseurin", "Fahrlehrer", "Türsteher", "Paketbotin", "Wahrsagerin"
    ]
  },
  {
    id: "essen",
    name: "Essen",
    emoji: "🍴",
    farbe: "#FF8A3D",
    begriffe: [
      "Pizza", "Spaghetti Bolognese", "Lasagne", "Döner", "Currywurst", "Schnitzel",
      "Bratwurst", "Brezel", "Käsespätzle", "Sauerkraut", "Kartoffelsalat", "Maultaschen",
      "Sushi", "Burger", "Pommes", "Hotdog", "Tacos", "Burrito", "Falafel", "Hummus", "Ramen",
      "Frühlingsrolle", "Paella", "Croissant", "Baguette", "Crêpe", "Raclette", "Käsefondue",
      "Tiramisu", "Apfelstrudel", "Kaiserschmarrn", "Schwarzwälder Kirschtorte", "Käsekuchen",
      "Donut", "Muffin", "Brownie", "Waffel", "Pfannkuchen", "Milchreis", "Vanillepudding",
      "Gummibärchen", "Schokolade", "Popcorn", "Chips", "Zuckerwatte", "Lebkuchen", "Marzipan",
      "Spaghettieis", "Bananensplit", "Avocado", "Ananas", "Wassermelone", "Erdbeere",
      "Granatapfel", "Kokosnuss", "Brokkoli", "Rosenkohl", "Spargel", "Kürbis", "Knoblauch",
      "Müsli", "Rührei", "Spiegelei", "Gulaschsuppe", "Rinderroulade", "Sauerbraten", "Frikadellen",
      "Tomatensuppe", "Pho", "Dim Sum", "Gyoza", "Pad Thai", "Butter Chicken", "Biryani", 
      "Samosa", "Naan", "Dal", "Couscous", "Shakshuka", "Gyros", "Souvlaki", "Moussaka", "Tzatziki", 
      "Ratatouille", "Bruschetta", "Risotto", "Gnocchi", "Ravioli", "Carbonara", "Pesto", "Lachs", 
      "Fischstäbchen", "Matjes", "Garnelen", "Fish & Chips", "Grillhendl", "Rindsrouladen", 
      "Schweinebraten", "Leberkas", "Obatzda", "Flammkuchen", "Quiche", "Ofenkartoffel", "Reiberdatschi", 
      "Semmelknödel", "Rösti", "Bagel", "Porridge", "Club Sandwich", "Overnight Oats", "Pavlova", 
      "Crème brûlée", "Panna cotta", "Mousse au Chocolat", "Macarons", "Eclair", "Rote Grütze", 
      "Dampfnudeln", "Stollen", "Baklava", "Churros", "Mango", "Heidelbeeren", "Himbeeren", 
      "Feigen", "Kiwi", "Zitrone", "Gurke", "Paprika", "Linseneintopf", "Kartoffelsuppe"
    ]
   },
  {
    id: "trinken",
    name: "Trinken",
    emoji: "🥤",
    farbe: "#3CC4F0",
    begriffe: [
      "Aperol Spritz", "Hugo", "Glühwein", "Sekt", "Caipirinha", "Mojito", "Negroni", "Campari Orange", 
       "Gin Tonic", "Moscow Mule", "Cuba Libre", "Whiskey Sour", "Manhattan", "Martini", 
       "Daiquiri", "Margarita", "Piña Colada", "Tequila Sunrise", "Long Island Iced Tea", "Espresso Martini", 
       "Bellini", "Mimosa", "Kir Royal", "Lillet Wild Berry", "Radler", "Weißbier", "Pils", "Kölsch", "Alt", 
       "Berliner Weiße mit Schuss", "Jägermeister", "Korn", "Sangria", "Cosmopolitan", 
       "Apfelschorle", "Virgin Mojito", "Heiße Schokolade", "Cappuccino", "Latte Macchiato", 
       "Espresso", "Filterkaffee", "Chai Latte", "Matcha Latte", "Kurkuma-Latte", "Smoothie", 
       "Frisch gepresster Orangensaft", "Milchshake", "Hausgemachte Limonade", "Holunderblütenschorle", 
       "Ginger Ale", "Tonic Water", "Cola", "Orangenlimonade", "Eistee", "Grüner Tee", 
       "Schwarzer Tee", "Rooibos-Tee", "Pfefferminztee", "Ingwertee", "Kombucha", "Mineralwasser", "Zitronenwasser", 
       "Hibiskustee", "Virgin Piña Colada", "Traubensaft", "Apfelsaft", "Frappé", "Rüscherl, "Voddi Bull", "Liquid Cocaine"
    ]
  },
  {
    id: "orte",
    name: "Orte",
    emoji: "🌍",
    farbe: "#B6E33A",
    begriffe: [
      "Paris", "London", "New York", "Rom", "Venedig", "Barcelona", "Lissabon", "Amsterdam",
      "Wien", "Prag", "Kopenhagen", "Istanbul", "Dubai", "Tokio", "Sydney", "Rio de Janeiro",
      "Las Vegas", "Hollywood", "Berlin", "Hamburg", "München", "Köln", "Mallorca", "Ibiza",
      "Sylt", "Santorin", "Bali", "Malediven", "Hawaii", "Island", "Ägypten", "Australien",
      "Japan", "Mexiko", "Kanada", "Schweiz", "Eiffelturm", "Kolosseum", "Freiheitsstatue",
      "Big Ben", "Brandenburger Tor", "Schloss Neuschwanstein", "Kölner Dom",
      "Chinesische Mauer", "Pyramiden von Gizeh", "Taj Mahal", "Grand Canyon", "Niagarafälle",
      "Mount Everest", "Sahara", "Nordpol", "Totes Meer", "Schwarzwald", "Bodensee",
      "Zugspitze", "Oktoberfest", "Reeperbahn", "Disneyland", "Flughafen", "Bahnhof",
      "Campingplatz", "Jugendherberge", "Freibad", "Zoo", "Kino", "Museum", "Bibliothek",
      "Baumarkt", "Fitnessstudio", "Zahnarztpraxis", "Waschsalon", "Tankstelle",
      "Autobahnraststätte", "Weihnachtsmarkt", "Flohmarkt", "Skihütte", "Leuchtturm", "Vulkan",
      "Regenwald", "Einsame Insel", "Mond", "Geisterbahn", "Umkleidekabine", "Dachterrasse"
    ]
  },
  {
    id: "pantomime",
    name: "Pantomime",
    emoji: "🎭",
    farbe: "#B28DFF",
    hinweis: "Nur vormachen, nicht sprechen.",
    begriffe: [
      "Zähne putzen", "Haare föhnen", "Selfie machen", "Auto fahren", "Fahrrad fahren",
      "Reiten", "Schwimmen", "Surfen", "Skifahren", "Schlittschuhlaufen", "Tennis spielen",
      "Golfen", "Bowling", "Gewichtheben", "Yoga", "Seilspringen", "Boxen", "Angeln",
      "Zelt aufbauen", "Bügeln", "Staubsaugen", "Fenster putzen", "Wäsche aufhängen",
      "Zwiebeln schneiden", "Spaghetti essen", "Suppe löffeln", "Sektflasche öffnen",
      "Cocktail mixen", "Kaffee verschütten", "Schminken", "Nägel lackieren",
      "Kontaktlinsen einsetzen", "Duschen", "In eine enge Jeans steigen",
      "Auf High Heels laufen", "Krawatte binden", "Geschenk auspacken", "Kerzen auspusten",
      "Luftballon aufblasen", "Gitarre spielen", "Schlagzeug spielen", "Geige spielen",
      "Dirigieren", "Karaoke singen", "Walzer tanzen", "Macarena", "Moonwalk",
      "Über den Catwalk laufen", "Jonglieren", "Seiltanzen", "Fallschirmspringen",
      "Achterbahn fahren", "Im Stau stehen", "Einparken", "Trampen", "Koffer packen",
      "Sonnencreme auftragen", "Mücke jagen", "Mit dem Hund Gassi gehen", "Baby wickeln",
      "Niesen", "Schluckauf", "Schlafwandeln", "Barfuß auf Lego treten",
      "Auf heißem Sand laufen", "Über Glatteis laufen", "Regenschirm im Sturm",
      "Schneeballschlacht", "Schneemann bauen", "Rasen mähen", "Blumen gießen",
      "Nagel einschlagen", "Regal aufbauen", "Glühbirne wechseln", "Tapezieren",
      "Im Videocall hängen", "Handy suchen", "Bus verpassen", "Zombie", "Roboter", "Gorilla",
      "Huhn"
    ]
  },
  {
    id: "marken",
    name: "Marken",
    emoji: "🛍️",
    farbe: "#FF6FB5",
    begriffe: [
      "Nike", "Adidas", "Puma", "Apple", "Samsung", "Google", "Amazon", "Netflix", "Spotify",
      "Instagram", "TikTok", "WhatsApp", "YouTube", "Coca-Cola", "Pepsi", "Fanta", "Red Bull",
      "Nutella", "Haribo", "Milka", "Kinder Überraschung", "Ritter Sport", "Lindt", "Maggi",
      "Dr. Oetker", "Nivea", "Tempo", "Tesa", "Lego", "Playmobil", "Ravensburger", "IKEA",
      "H&M", "Zara", "Zalando", "Birkenstock", "Dr. Martens", "Levi's", "Chanel", "Gucci",
      "Louis Vuitton", "Rolex", "Pandora", "Ray-Ban", "BMW", "Mercedes", "Volkswagen",
      "Porsche", "Tesla", "Ferrari", "Vespa", "Lufthansa", "Ryanair", "Deutsche Bahn",
      "Flixbus", "McDonald's", "Burger King", "Subway", "Starbucks", "Aldi", "Lidl", "Rewe",
      "Edeka", "dm", "Rossmann", "Douglas", "MediaMarkt", "Obi", "Tchibo", "Thermomix",
      "Tupperware", "Dyson", "Nespresso", "Jägermeister", "Capri-Sun", "Pringles", "Oreo",
      "Ben & Jerry's", "Disney", "PlayStation", "Nintendo", "Tinder", "PayPal", "Airbnb"
    ]
  },
  {
    id: "sport",
    name: "Sport & Hobbys",
    emoji: "🏓",
    farbe: "FFB627",
    begriffe: [
      "Fußball", "Handball", "Volleyball", "Basketball", "Tennis", "Tischtennis", "Badminton",
      "Golf", "Eishockey", "Rugby", "Baseball", "Judo", "Karate", "Fechten", "Turnen",
      "Ballett", "Zumba", "Pilates", "Crossfit", "Joggen", "Marathon", "Wandern", "Klettern",
      "Bouldern", "Snowboarden", "Rodeln", "Eiskunstlauf", "Curling", "Biathlon",
      "Skispringen", "Tauchen", "Stand-up-Paddling", "Segeln", "Rudern", "Kanufahren",
      "Formel 1", "Mountainbiken", "Skateboarden", "Inlineskaten", "Trampolinspringen",
      "Bogenschießen", "Darts", "Billard", "Minigolf", "Tischkicker", "Schach", "Poker",
      "Monopoly", "Puzzeln", "Stricken", "Häkeln", "Nähen", "Töpfern", "Malen",
      "Fotografieren", "Backen", "Gärtnern", "Camping", "Chor", "Klavier spielen", "Lesen",
      "Podcast hören", "Zocken", "Escape Room", "Lasertag", "Paintball", "Geocaching",
      "Vögel beobachten", "Sterne gucken", "Tanzkurs", "Poledance", "Hula-Hoop", "Tauziehen",
      "Sackhüpfen", "Eierlauf", "Armdrücken", "Kissenschlacht", "Bullenreiten", "Limbo",
      "Bierpong"
    ]
  },
  {
    id: "neunziger",
    name: "90er",
    emoji: "📼",
    farbe: "#FFD84D",
    begriffe: [
      "Tamagotchi", "Game Boy", "Diddl-Maus", "Freundebuch", "Poesiealbum", "Scoubidou",
      "Loom-Bänder", "Pokémon-Karten", "Panini-Sticker", "Furby", "Polly Pocket", "Baby Born",
      "Bibi Blocksberg", "Benjamin Blümchen", "Bibi und Tina", "Die drei ???", "TKKG",
      "Die wilden Hühner", "Pumuckl", "Löwenzahn", "Die Sendung mit der Maus",
      "Sandmännchen", "Teletubbies", "Kim Possible", "Hannah Montana", "Sailor Moon", "Heidi",
      "Wickie", "Hanni und Nanni", "Conni", "Der Regenbogenfisch", "Bravo", "Wendy",
      "Bravo Hits", "MP3-Player", "Discman", "Kassettenrekorder", "Röhrenfernseher",
      "Videothek", "Klapphandy", "Snake", "SMS", "Klingelton", "Crazy Frog", "Schnappi", "ICQ",
      "SchülerVZ", "Tokio Hotel", "Spice Girls",
      "Tattoo-Kette", "Schulranzen", "Füller", "Tintenkiller", "Federmäppchen",
      "Hausaufgabenheft", "Bundesjugendspiele", "Klassenfahrt", "Pausenbrot", "Center Shock",
      "Esspapier", "Brausepulver", "Wassereis", "Fruchtzwerge", "Hubba Bubba", "Gummitwist",
      "Hüpfekästchen", "Verstecken", "Topfschlagen", "Reise nach Jerusalem", "Flaschendrehen",
      "Wahrheit oder Pflicht", "Stille Post", "Schnitzeljagd", "Kindergeburtstag", "Zahnfee",
      "Seepferdchen-Abzeichen", "Stützräder", "Bobbycar", "Baumhaus", "Kuscheltier",
      "Schultüte", "Wackelzahn"
    ]
  }
];
