// Comprehensive Location data for SoloRank

export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  // ==================== NORTH AMERICA ====================
  {
    code: 'US',
    name: 'United States',
    states: [
      { code: 'AL', name: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile', 'Tuscaloosa'] },
      { code: 'AK', name: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'] },
      { code: 'AZ', name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler', 'Tempe'] },
      { code: 'AR', name: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'] },
      { code: 'CA', name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim'] },
      { code: 'CO', name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder', 'Lakewood'] },
      { code: 'CT', name: 'Connecticut', cities: ['Hartford', 'New Haven', 'Stamford', 'Bridgeport', 'Waterbury'] },
      { code: 'DE', name: 'Delaware', cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'] },
      { code: 'FL', name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'St. Petersburg', 'Hialeah', 'Tallahassee'] },
      { code: 'GA', name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Macon', 'Sandy Springs'] },
      { code: 'HI', name: 'Hawaii', cities: ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu'] },
      { code: 'ID', name: 'Idaho', cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello'] },
      { code: 'IL', name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Peoria'] },
      { code: 'IN', name: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Bloomington'] },
      { code: 'IA', name: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'] },
      { code: 'KS', name: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Olathe', 'Topeka'] },
      { code: 'KY', name: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'] },
      { code: 'LA', name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'] },
      { code: 'ME', name: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'] },
      { code: 'MD', name: 'Maryland', cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Annapolis'] },
      { code: 'MA', name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton'] },
      { code: 'MI', name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing'] },
      { code: 'MN', name: 'Minnesota', cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington'] },
      { code: 'MS', name: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'] },
      { code: 'MO', name: 'Missouri', cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence'] },
      { code: 'MT', name: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'] },
      { code: 'NE', name: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'] },
      { code: 'NV', name: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'] },
      { code: 'NH', name: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester'] },
      { code: 'NJ', name: 'New Jersey', cities: ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison', 'Trenton'] },
      { code: 'NM', name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'] },
      { code: 'NY', name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse', 'Yonkers'] },
      { code: 'NC', name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville'] },
      { code: 'ND', name: 'North Dakota', cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'] },
      { code: 'OH', name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton'] },
      { code: 'OK', name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond'] },
      { code: 'OR', name: 'Oregon', cities: ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro', 'Bend'] },
      { code: 'PA', name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton'] },
      { code: 'RI', name: 'Rhode Island', cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'] },
      { code: 'SC', name: 'South Carolina', cities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Greenville'] },
      { code: 'SD', name: 'South Dakota', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'] },
      { code: 'TN', name: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'] },
      { code: 'TX', name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Plano'] },
      { code: 'UT', name: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy'] },
      { code: 'VT', name: 'Vermont', cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier'] },
      { code: 'VA', name: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington', 'Alexandria'] },
      { code: 'WA', name: 'Washington', cities: ['Seattle', 'Tacoma', 'Spokane', 'Vancouver', 'Bellevue', 'Kent'] },
      { code: 'WV', name: 'West Virginia', cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling'] },
      { code: 'WI', name: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'] },
      { code: 'WY', name: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs'] },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      { code: 'ON', name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Brampton', 'Markham', 'Vaughan'] },
      { code: 'BC', name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond', 'Kelowna', 'Abbotsford'] },
      { code: 'QC', name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke'] },
      { code: 'AB', name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'Fort McMurray'] },
      { code: 'MB', name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie'] },
      { code: 'SK', name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current'] },
      { code: 'NS', name: 'Nova Scotia', cities: ['Halifax', 'Dartmouth', 'Sydney', 'Truro', 'New Glasgow'] },
      { code: 'NB', name: 'New Brunswick', cities: ['Saint John', 'Moncton', 'Fredericton', 'Dieppe', 'Miramichi'] },
      { code: 'NL', name: 'Newfoundland and Labrador', cities: ['St. John\'s', 'Mount Pearl', 'Corner Brook', 'Conception Bay South', 'Paradise'] },
      { code: 'PE', name: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague'] },
    ],
  },
  {
    code: 'MX',
    name: 'Mexico',
    states: [
      { code: 'CDMX', name: 'Ciudad de México', cities: ['Mexico City', 'Coyoacán', 'Tlalpan', 'Xochimilco', 'Iztapalapa'] },
      { code: 'JAL', name: 'Jalisco', cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá', 'Puerto Vallarta'] },
      { code: 'NL', name: 'Nuevo León', cities: ['Monterrey', 'San Nicolás', 'Guadalupe', 'Apodaca', 'Santa Catarina'] },
      { code: 'VER', name: 'Veracruz', cities: ['Veracruz', 'Xalapa', 'Coatzacoalcos', 'Córdoba', 'Poza Rica'] },
      { code: 'PUE', name: 'Puebla', cities: ['Puebla', 'Tehuacán', 'San Martín Texmelucan', 'Atlixco', 'Cholula'] },
      { code: 'GTO', name: 'Guanajuato', cities: ['León', 'Irapuato', 'Celaya', 'Salamanca', 'Guanajuato City'] },
      { code: 'CHI', name: 'Chihuahua', cities: ['Ciudad Juárez', 'Chihuahua City', 'Cuauhtémoc', 'Delicias', 'Parral'] },
      { code: 'BCN', name: 'Baja California', cities: ['Tijuana', 'Mexicali', 'Ensenada', 'Rosarito', 'Tecate'] },
    ],
  },

  // ==================== SOUTH AMERICA ====================
  {
    code: 'BR',
    name: 'Brazil',
    states: [
      { code: 'SP', name: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Osasco', 'Ribeirão Preto'] },
      { code: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'] },
      { code: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
      { code: 'BA', name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'] },
      { code: 'RS', name: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'] },
      { code: 'PR', name: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'] },
      { code: 'PE', name: 'Pernambuco', cities: ['Recife', 'Jaboatão', 'Olinda', 'Caruaru', 'Petrolina'] },
      { code: 'CE', name: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'] },
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    states: [
      { code: 'BA', name: 'Buenos Aires', cities: ['Buenos Aires', 'La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil'] },
      { code: 'CB', name: 'Córdoba', cities: ['Córdoba', 'Villa María', 'Río Cuarto', 'San Francisco', 'Alta Gracia'] },
      { code: 'SF', name: 'Santa Fe', cities: ['Rosario', 'Santa Fe', 'Rafaela', 'Venado Tuerto', 'Reconquista'] },
      { code: 'MZ', name: 'Mendoza', cities: ['Mendoza', 'San Rafael', 'Godoy Cruz', 'Las Heras', 'Luján de Cuyo'] },
      { code: 'TU', name: 'Tucumán', cities: ['San Miguel de Tucumán', 'Tafí Viejo', 'Yerba Buena', 'Banda del Río Salí', 'Concepción'] },
    ],
  },
  {
    code: 'CO',
    name: 'Colombia',
    states: [
      { code: 'DC', name: 'Bogotá D.C.', cities: ['Bogotá', 'Usaquén', 'Chapinero', 'Engativá', 'Suba'] },
      { code: 'ANT', name: 'Antioquia', cities: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro'] },
      { code: 'VAL', name: 'Valle del Cauca', cities: ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga'] },
      { code: 'ATL', name: 'Atlántico', cities: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia'] },
      { code: 'SAN', name: 'Santander', cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Barrancabermeja', 'Piedecuesta'] },
    ],
  },
  {
    code: 'CL',
    name: 'Chile',
    states: [
      { code: 'RM', name: 'Región Metropolitana', cities: ['Santiago', 'Puente Alto', 'Maipú', 'Las Condes', 'La Florida'] },
      { code: 'VL', name: 'Valparaíso', cities: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio'] },
      { code: 'BI', name: 'Biobío', cities: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán', 'Coronel'] },
      { code: 'AN', name: 'Antofagasta', cities: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal'] },
    ],
  },
  {
    code: 'PE',
    name: 'Peru',
    states: [
      { code: 'LIM', name: 'Lima', cities: ['Lima', 'San Juan de Lurigancho', 'San Martín de Porres', 'Comas', 'Ate'] },
      { code: 'ARE', name: 'Arequipa', cities: ['Arequipa', 'Cayma', 'Cerro Colorado', 'Socabaya', 'Yanahuara'] },
      { code: 'LAL', name: 'La Libertad', cities: ['Trujillo', 'Víctor Larco', 'El Porvenir', 'Huanchaco', 'Laredo'] },
      { code: 'CUS', name: 'Cusco', cities: ['Cusco', 'San Sebastián', 'Santiago', 'Wanchaq', 'Saylla'] },
    ],
  },

  // ==================== EUROPE ====================
  {
    code: 'UK',
    name: 'United Kingdom',
    states: [
      { code: 'ENG', name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Sheffield', 'Newcastle', 'Leicester', 'Nottingham'] },
      { code: 'SCT', name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness', 'Stirling'] },
      { code: 'WLS', name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Bangor'] },
      { code: 'NIR', name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Bangor', 'Craigavon'] },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    states: [
      { code: 'BY', name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Ingolstadt', 'Würzburg'] },
      { code: 'BE', name: 'Berlin', cities: ['Berlin Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Charlottenburg', 'Friedrichshain', 'Neukölln'] },
      { code: 'HE', name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach', 'Fulda'] },
      { code: 'NW', name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bonn'] },
      { code: 'BW', name: 'Baden-Württemberg', cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Ulm'] },
      { code: 'NI', name: 'Lower Saxony', cities: ['Hanover', 'Braunschweig', 'Oldenburg', 'Osnabrück', 'Wolfsburg', 'Göttingen'] },
      { code: 'HH', name: 'Hamburg', cities: ['Hamburg-Mitte', 'Altona', 'Wandsbek', 'Bergedorf', 'Harburg'] },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    states: [
      { code: 'IDF', name: 'Île-de-France', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Versailles'] },
      { code: 'ARA', name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Grenoble', 'Saint-Étienne', 'Villeurbanne', 'Clermont-Ferrand'] },
      { code: 'PAC', name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes'] },
      { code: 'OCC', name: 'Occitanie', cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers'] },
      { code: 'NAQ', name: 'Nouvelle-Aquitaine', cities: ['Bordeaux', 'Limoges', 'Poitiers', 'La Rochelle', 'Pau'] },
      { code: 'HDF', name: 'Hauts-de-France', cities: ['Lille', 'Amiens', 'Roubaix', 'Dunkirk', 'Calais'] },
    ],
  },
  {
    code: 'ES',
    name: 'Spain',
    states: [
      { code: 'MD', name: 'Madrid', cities: ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe'] },
      { code: 'CT', name: 'Catalonia', cities: ['Barcelona', 'L\'Hospitalet', 'Badalona', 'Terrassa', 'Sabadell', 'Tarragona'] },
      { code: 'AN', name: 'Andalusia', cities: ['Seville', 'Málaga', 'Córdoba', 'Granada', 'Almería', 'Cádiz'] },
      { code: 'VC', name: 'Valencia', cities: ['Valencia', 'Alicante', 'Elche', 'Castellón', 'Benidorm'] },
      { code: 'PV', name: 'Basque Country', cities: ['Bilbao', 'Vitoria-Gasteiz', 'San Sebastián', 'Barakaldo', 'Getxo'] },
    ],
  },
  {
    code: 'IT',
    name: 'Italy',
    states: [
      { code: 'LOM', name: 'Lombardy', cities: ['Milan', 'Brescia', 'Bergamo', 'Monza', 'Como', 'Varese'] },
      { code: 'LAZ', name: 'Lazio', cities: ['Rome', 'Latina', 'Fiumicino', 'Guidonia', 'Tivoli'] },
      { code: 'CAM', name: 'Campania', cities: ['Naples', 'Salerno', 'Caserta', 'Giugliano', 'Torre del Greco'] },
      { code: 'VEN', name: 'Veneto', cities: ['Venice', 'Verona', 'Padua', 'Vicenza', 'Treviso'] },
      { code: 'TOS', name: 'Tuscany', cities: ['Florence', 'Prato', 'Livorno', 'Pisa', 'Siena', 'Lucca'] },
      { code: 'PIE', name: 'Piedmont', cities: ['Turin', 'Novara', 'Alessandria', 'Asti', 'Cuneo'] },
    ],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    states: [
      { code: 'NH', name: 'North Holland', cities: ['Amsterdam', 'Haarlem', 'Zaanstad', 'Haarlemmermeer', 'Alkmaar'] },
      { code: 'ZH', name: 'South Holland', cities: ['Rotterdam', 'The Hague', 'Leiden', 'Dordrecht', 'Delft'] },
      { code: 'NB', name: 'North Brabant', cities: ['Eindhoven', 'Tilburg', 'Breda', 's-Hertogenbosch', 'Helmond'] },
      { code: 'UT', name: 'Utrecht', cities: ['Utrecht', 'Amersfoort', 'Veenendaal', 'Nieuwegein', 'Zeist'] },
    ],
  },
  {
    code: 'PL',
    name: 'Poland',
    states: [
      { code: 'MZ', name: 'Masovian', cities: ['Warsaw', 'Radom', 'Płock', 'Siedlce', 'Pruszków'] },
      { code: 'SL', name: 'Silesian', cities: ['Katowice', 'Częstochowa', 'Sosnowiec', 'Gliwice', 'Zabrze'] },
      { code: 'WP', name: 'Greater Poland', cities: ['Poznań', 'Kalisz', 'Konin', 'Piła', 'Ostrów Wielkopolski'] },
      { code: 'MP', name: 'Lesser Poland', cities: ['Kraków', 'Tarnów', 'Nowy Sącz', 'Oświęcim', 'Chrzanów'] },
      { code: 'PM', name: 'Pomeranian', cities: ['Gdańsk', 'Gdynia', 'Słupsk', 'Tczew', 'Sopot'] },
    ],
  },
  {
    code: 'SE',
    name: 'Sweden',
    states: [
      { code: 'AB', name: 'Stockholm', cities: ['Stockholm', 'Södertälje', 'Nacka', 'Solna', 'Huddinge'] },
      { code: 'VG', name: 'Västra Götaland', cities: ['Gothenburg', 'Borås', 'Trollhättan', 'Uddevalla', 'Skövde'] },
      { code: 'M', name: 'Skåne', cities: ['Malmö', 'Helsingborg', 'Lund', 'Kristianstad', 'Landskrona'] },
      { code: 'E', name: 'Östergötland', cities: ['Linköping', 'Norrköping', 'Motala', 'Mjölby', 'Finspång'] },
    ],
  },
  {
    code: 'NO',
    name: 'Norway',
    states: [
      { code: 'OSL', name: 'Oslo', cities: ['Oslo', 'Gamle Oslo', 'Grünerløkka', 'St. Hanshaugen', 'Frogner'] },
      { code: 'VE', name: 'Vestland', cities: ['Bergen', 'Askøy', 'Øygarden', 'Os', 'Stord'] },
      { code: 'TR', name: 'Trøndelag', cities: ['Trondheim', 'Steinkjer', 'Stjørdal', 'Levanger', 'Namsos'] },
      { code: 'RO', name: 'Rogaland', cities: ['Stavanger', 'Sandnes', 'Haugesund', 'Sola', 'Randaberg'] },
    ],
  },
  {
    code: 'RU',
    name: 'Russia',
    states: [
      { code: 'MOW', name: 'Moscow', cities: ['Moscow', 'Zelenograd', 'Troitsk', 'Shcherbinka', 'Mytishchi'] },
      { code: 'SPE', name: 'Saint Petersburg', cities: ['Saint Petersburg', 'Peterhof', 'Pushkin', 'Kolpino', 'Kronstadt'] },
      { code: 'NSO', name: 'Novosibirsk Oblast', cities: ['Novosibirsk', 'Berdsk', 'Ob', 'Iskitim', 'Akademgorodok'] },
      { code: 'SVE', name: 'Sverdlovsk Oblast', cities: ['Yekaterinburg', 'Nizhny Tagil', 'Kamensk-Uralsky', 'Pervouralsk', 'Serov'] },
      { code: 'KDA', name: 'Krasnodar Krai', cities: ['Krasnodar', 'Sochi', 'Novorossiysk', 'Armavir', 'Anapa'] },
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    states: [
      { code: 'LIS', name: 'Lisbon', cities: ['Lisbon', 'Sintra', 'Cascais', 'Loures', 'Almada'] },
      { code: 'PRT', name: 'Porto', cities: ['Porto', 'Vila Nova de Gaia', 'Matosinhos', 'Maia', 'Gondomar'] },
      { code: 'FAR', name: 'Faro', cities: ['Faro', 'Albufeira', 'Portimão', 'Lagos', 'Loulé'] },
    ],
  },
  {
    code: 'CH',
    name: 'Switzerland',
    states: [
      { code: 'ZH', name: 'Zürich', cities: ['Zürich', 'Winterthur', 'Uster', 'Dübendorf', 'Dietikon'] },
      { code: 'GE', name: 'Geneva', cities: ['Geneva', 'Vernier', 'Lancy', 'Meyrin', 'Carouge'] },
      { code: 'BE', name: 'Bern', cities: ['Bern', 'Biel/Bienne', 'Thun', 'Köniz', 'Burgdorf'] },
      { code: 'BS', name: 'Basel-Stadt', cities: ['Basel', 'Riehen', 'Bettingen'] },
    ],
  },
  {
    code: 'AT',
    name: 'Austria',
    states: [
      { code: 'W', name: 'Vienna', cities: ['Vienna', 'Donaustadt', 'Favoriten', 'Floridsdorf', 'Liesing'] },
      { code: 'ST', name: 'Styria', cities: ['Graz', 'Leoben', 'Kapfenberg', 'Bruck an der Mur', 'Knittelfeld'] },
      { code: 'OO', name: 'Upper Austria', cities: ['Linz', 'Wels', 'Steyr', 'Leonding', 'Traun'] },
      { code: 'T', name: 'Tyrol', cities: ['Innsbruck', 'Kufstein', 'Schwaz', 'Telfs', 'Wörgl'] },
      { code: 'S', name: 'Salzburg', cities: ['Salzburg', 'Hallein', 'Saalfelden', 'Bischofshofen', 'St. Johann'] },
    ],
  },
  {
    code: 'BE',
    name: 'Belgium',
    states: [
      { code: 'BRU', name: 'Brussels', cities: ['Brussels', 'Schaerbeek', 'Anderlecht', 'Molenbeek', 'Ixelles'] },
      { code: 'VLG', name: 'Flanders', cities: ['Antwerp', 'Ghent', 'Bruges', 'Leuven', 'Mechelen'] },
      { code: 'WAL', name: 'Wallonia', cities: ['Charleroi', 'Liège', 'Namur', 'Mons', 'La Louvière'] },
    ],
  },
  {
    code: 'GR',
    name: 'Greece',
    states: [
      { code: 'ATT', name: 'Attica', cities: ['Athens', 'Piraeus', 'Peristeri', 'Kallithea', 'Glyfada'] },
      { code: 'CEN', name: 'Central Macedonia', cities: ['Thessaloniki', 'Kavala', 'Serres', 'Katerini', 'Veria'] },
      { code: 'CRE', name: 'Crete', cities: ['Heraklion', 'Chania', 'Rethymno', 'Agios Nikolaos', 'Ierapetra'] },
    ],
  },

  // ==================== ASIA ====================
  {
    code: 'IN',
    name: 'India',
    states: [
      { code: 'MH', name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur'] },
      { code: 'KA', name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Shimoga', 'Tumkur'] },
      { code: 'TN', name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Vellore', 'Tiruppur'] },
      { code: 'DL', name: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi'] },
      { code: 'UP', name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida', 'Ghaziabad', 'Meerut', 'Allahabad'] },
      { code: 'WB', name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Kharagpur'] },
      { code: 'GJ', name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar'] },
      { code: 'RJ', name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar'] },
      { code: 'TS', name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'] },
      { code: 'AP', name: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore', 'Kakinada'] },
      { code: 'KL', name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'] },
      { code: 'HR', name: 'Haryana', cities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'] },
      { code: 'PB', name: 'Punjab', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'] },
      { code: 'MP', name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'] },
      { code: 'BR', name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'] },
      { code: 'OR', name: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'] },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    states: [
      { code: 'TK', name: 'Tokyo', cities: ['Shibuya', 'Shinjuku', 'Akihabara', 'Ginza', 'Roppongi', 'Ikebukuro', 'Harajuku', 'Ueno'] },
      { code: 'OS', name: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Toyonaka', 'Suita', 'Hirakata'] },
      { code: 'KY', name: 'Kyoto', cities: ['Kyoto', 'Uji', 'Kameoka', 'Nagaokakyo', 'Maizuru', 'Muko'] },
      { code: 'HK', name: 'Hokkaido', cities: ['Sapporo', 'Hakodate', 'Asahikawa', 'Otaru', 'Kushiro', 'Obihiro'] },
      { code: 'AI', name: 'Aichi', cities: ['Nagoya', 'Toyota', 'Okazaki', 'Ichinomiya', 'Kasugai', 'Toyohashi'] },
      { code: 'FK', name: 'Fukuoka', cities: ['Fukuoka', 'Kitakyushu', 'Kurume', 'Omuta', 'Iizuka'] },
      { code: 'HG', name: 'Hyogo', cities: ['Kobe', 'Himeji', 'Nishinomiya', 'Amagasaki', 'Akashi'] },
      { code: 'KN', name: 'Kanagawa', cities: ['Yokohama', 'Kawasaki', 'Sagamihara', 'Fujisawa', 'Hiratsuka'] },
    ],
  },
  {
    code: 'CN',
    name: 'China',
    states: [
      { code: 'BJ', name: 'Beijing', cities: ['Beijing', 'Haidian', 'Chaoyang', 'Dongcheng', 'Xicheng', 'Fengtai'] },
      { code: 'SH', name: 'Shanghai', cities: ['Shanghai', 'Pudong', 'Minhang', 'Baoshan', 'Jiading', 'Songjiang'] },
      { code: 'GD', name: 'Guangdong', cities: ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhuhai', 'Zhongshan'] },
      { code: 'ZJ', name: 'Zhejiang', cities: ['Hangzhou', 'Ningbo', 'Wenzhou', 'Shaoxing', 'Jiaxing', 'Taizhou'] },
      { code: 'JS', name: 'Jiangsu', cities: ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Xuzhou', 'Nantong'] },
      { code: 'SC', name: 'Sichuan', cities: ['Chengdu', 'Mianyang', 'Zigong', 'Panzhihua', 'Nanchong', 'Leshan'] },
      { code: 'SD', name: 'Shandong', cities: ['Jinan', 'Qingdao', 'Yantai', 'Weifang', 'Zibo', 'Weihai'] },
      { code: 'HB', name: 'Hubei', cities: ['Wuhan', 'Yichang', 'Xiangyang', 'Shiyan', 'Jingzhou', 'Huangshi'] },
    ],
  },
  {
    code: 'KR',
    name: 'South Korea',
    states: [
      { code: 'SEL', name: 'Seoul', cities: ['Gangnam', 'Hongdae', 'Myeongdong', 'Itaewon', 'Jongno', 'Mapo', 'Yeouido', 'Dongdaemun'] },
      { code: 'BS', name: 'Busan', cities: ['Haeundae', 'Seomyeon', 'Nampo', 'Gwangalli', 'Centum City', 'Dongrae'] },
      { code: 'IC', name: 'Incheon', cities: ['Songdo', 'Bupyeong', 'Namdong', 'Yeonsu', 'Gyeyang', 'Juan'] },
      { code: 'DG', name: 'Daegu', cities: ['Dongseong-ro', 'Suseong', 'Buk-gu', 'Seo-gu', 'Dalseo', 'Dalseong'] },
      { code: 'DJ', name: 'Daejeon', cities: ['Yuseong', 'Seo-gu', 'Dong-gu', 'Jung-gu', 'Daedeok'] },
      { code: 'GG', name: 'Gyeonggi', cities: ['Suwon', 'Seongnam', 'Goyang', 'Yongin', 'Bucheon', 'Ansan', 'Hwaseong'] },
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    states: [
      { code: 'BKK', name: 'Bangkok', cities: ['Bangkok', 'Sukhumvit', 'Silom', 'Sathorn', 'Ratchathewi', 'Chatuchak'] },
      { code: 'CM', name: 'Chiang Mai', cities: ['Chiang Mai', 'San Kamphaeng', 'Hang Dong', 'Mae Rim', 'San Sai'] },
      { code: 'PK', name: 'Phuket', cities: ['Phuket Town', 'Patong', 'Kata', 'Karon', 'Rawai'] },
      { code: 'CNX', name: 'Chon Buri', cities: ['Pattaya', 'Chon Buri', 'Sri Racha', 'Bang Lamung', 'Sattahip'] },
    ],
  },
  {
    code: 'VN',
    name: 'Vietnam',
    states: [
      { code: 'HN', name: 'Hanoi', cities: ['Hanoi', 'Hoan Kiem', 'Ba Dinh', 'Dong Da', 'Cau Giay', 'Thanh Xuan'] },
      { code: 'SG', name: 'Ho Chi Minh City', cities: ['Ho Chi Minh City', 'District 1', 'District 3', 'District 7', 'Thu Duc', 'Binh Thanh'] },
      { code: 'DN', name: 'Da Nang', cities: ['Da Nang', 'Hai Chau', 'Thanh Khe', 'Son Tra', 'Ngu Hanh Son'] },
      { code: 'HP', name: 'Hai Phong', cities: ['Hai Phong', 'Hong Bang', 'Ngo Quyen', 'Le Chan', 'Kien An'] },
    ],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    states: [
      { code: 'JK', name: 'Jakarta', cities: ['Jakarta', 'Central Jakarta', 'South Jakarta', 'East Jakarta', 'West Jakarta', 'North Jakarta'] },
      { code: 'JB', name: 'West Java', cities: ['Bandung', 'Bekasi', 'Depok', 'Bogor', 'Cirebon', 'Cimahi'] },
      { code: 'JI', name: 'East Java', cities: ['Surabaya', 'Malang', 'Sidoarjo', 'Kediri', 'Jember', 'Madiun'] },
      { code: 'BA', name: 'Bali', cities: ['Denpasar', 'Ubud', 'Kuta', 'Seminyak', 'Sanur', 'Nusa Dua'] },
      { code: 'JT', name: 'Central Java', cities: ['Semarang', 'Solo', 'Yogyakarta', 'Surakarta', 'Magelang', 'Salatiga'] },
    ],
  },
  {
    code: 'MY',
    name: 'Malaysia',
    states: [
      { code: 'KL', name: 'Kuala Lumpur', cities: ['Kuala Lumpur', 'Bukit Bintang', 'KLCC', 'Mont Kiara', 'Bangsar'] },
      { code: 'SL', name: 'Selangor', cities: ['Shah Alam', 'Petaling Jaya', 'Subang Jaya', 'Klang', 'Ampang'] },
      { code: 'PN', name: 'Penang', cities: ['George Town', 'Butterworth', 'Bayan Lepas', 'Bukit Mertajam', 'Nibong Tebal'] },
      { code: 'JH', name: 'Johor', cities: ['Johor Bahru', 'Iskandar Puteri', 'Pasir Gudang', 'Batu Pahat', 'Muar'] },
      { code: 'SB', name: 'Sabah', cities: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu', 'Keningau'] },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    states: [
      { code: 'SG', name: 'Singapore', cities: ['Central', 'Orchard', 'Marina Bay', 'Sentosa', 'Changi', 'Jurong', 'Woodlands', 'Tampines'] },
    ],
  },
  {
    code: 'PH',
    name: 'Philippines',
    states: [
      { code: 'NCR', name: 'Metro Manila', cities: ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 'Parañaque'] },
      { code: 'CEB', name: 'Cebu', cities: ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Minglanilla'] },
      { code: 'DAV', name: 'Davao', cities: ['Davao City', 'Tagum', 'Digos', 'Panabo', 'Samal'] },
      { code: 'ILO', name: 'Iloilo', cities: ['Iloilo City', 'Oton', 'Pavia', 'Santa Barbara', 'Leganes'] },
    ],
  },
  {
    code: 'PK',
    name: 'Pakistan',
    states: [
      { code: 'PB', name: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'] },
      { code: 'SD', name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'] },
      { code: 'KP', name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swabi', 'Swat'] },
      { code: 'IS', name: 'Islamabad', cities: ['Islamabad', 'F-7', 'F-8', 'G-9', 'Blue Area', 'DHA'] },
    ],
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    states: [
      { code: 'DHA', name: 'Dhaka Division', cities: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Kishoreganj'] },
      { code: 'CTG', name: 'Chittagong Division', cities: ['Chittagong', 'Comilla', 'Brahmanbaria', 'Cox\'s Bazar', 'Chandpur'] },
      { code: 'KHU', name: 'Khulna Division', cities: ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Narail'] },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    states: [
      { code: 'DU', name: 'Dubai', cities: ['Dubai', 'Downtown Dubai', 'Dubai Marina', 'Jumeirah', 'Deira', 'Bur Dubai'] },
      { code: 'AZ', name: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Al Reem Island', 'Yas Island', 'Saadiyat'] },
      { code: 'SH', name: 'Sharjah', cities: ['Sharjah', 'Al Majaz', 'Al Khan', 'Al Nahda', 'Al Qasimia'] },
    ],
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    states: [
      { code: 'RY', name: 'Riyadh', cities: ['Riyadh', 'Al Olaya', 'Al Malaz', 'Al Diriyah', 'Al Kharj'] },
      { code: 'MK', name: 'Makkah', cities: ['Jeddah', 'Makkah', 'Taif', 'Rabigh', 'Al Qunfudhah'] },
      { code: 'EP', name: 'Eastern Province', cities: ['Dammam', 'Al Khobar', 'Dhahran', 'Jubail', 'Qatif'] },
    ],
  },
  {
    code: 'TR',
    name: 'Turkey',
    states: [
      { code: 'IST', name: 'Istanbul', cities: ['Istanbul', 'Kadıköy', 'Beşiktaş', 'Üsküdar', 'Beyoğlu', 'Şişli', 'Bakırköy'] },
      { code: 'ANK', name: 'Ankara', cities: ['Ankara', 'Çankaya', 'Keçiören', 'Mamak', 'Etimesgut', 'Yenimahalle'] },
      { code: 'IZM', name: 'Izmir', cities: ['Izmir', 'Bornova', 'Karşıyaka', 'Konak', 'Buca', 'Bayraklı'] },
      { code: 'ANT', name: 'Antalya', cities: ['Antalya', 'Alanya', 'Manavgat', 'Serik', 'Kepez'] },
    ],
  },
  {
    code: 'IL',
    name: 'Israel',
    states: [
      { code: 'TA', name: 'Tel Aviv', cities: ['Tel Aviv', 'Ramat Gan', 'Holon', 'Petah Tikva', 'Bat Yam'] },
      { code: 'JM', name: 'Jerusalem', cities: ['Jerusalem', 'Ein Kerem', 'Talpiot', 'Ramot', 'Givat Shaul'] },
      { code: 'HF', name: 'Haifa', cities: ['Haifa', 'Hadera', 'Nazareth', 'Afula', 'Karmiel'] },
    ],
  },

  // ==================== AFRICA ====================
  {
    code: 'ZA',
    name: 'South Africa',
    states: [
      { code: 'GP', name: 'Gauteng', cities: ['Johannesburg', 'Pretoria', 'Sandton', 'Soweto', 'Centurion', 'Midrand'] },
      { code: 'WC', name: 'Western Cape', cities: ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Worcester'] },
      { code: 'KZN', name: 'KwaZulu-Natal', cities: ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Ladysmith'] },
    ],
  },
  {
    code: 'NG',
    name: 'Nigeria',
    states: [
      { code: 'LA', name: 'Lagos', cities: ['Lagos', 'Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Yaba'] },
      { code: 'FC', name: 'Abuja FCT', cities: ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari', 'Kubwa'] },
      { code: 'KN', name: 'Kano', cities: ['Kano', 'Fagge', 'Tarauni', 'Nassarawa', 'Gwale'] },
      { code: 'RV', name: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Oyigbo', 'Okrika'] },
    ],
  },
  {
    code: 'EG',
    name: 'Egypt',
    states: [
      { code: 'C', name: 'Cairo', cities: ['Cairo', 'Giza', 'Heliopolis', 'Maadi', 'Nasr City', 'New Cairo'] },
      { code: 'ALX', name: 'Alexandria', cities: ['Alexandria', 'Sidi Gaber', 'Montaza', 'Smouha', 'Agami'] },
      { code: 'GH', name: 'Gharbia', cities: ['Tanta', 'El Mahalla', 'Kafr El Zayat', 'Zefta', 'Samanoud'] },
    ],
  },
  {
    code: 'KE',
    name: 'Kenya',
    states: [
      { code: 'NBO', name: 'Nairobi', cities: ['Nairobi', 'Westlands', 'Karen', 'Kilimani', 'Lavington'] },
      { code: 'MBA', name: 'Mombasa', cities: ['Mombasa', 'Nyali', 'Likoni', 'Changamwe', 'Kisauni'] },
      { code: 'KSM', name: 'Kisumu', cities: ['Kisumu', 'Ahero', 'Maseno', 'Kondele', 'Manyatta'] },
    ],
  },
  {
    code: 'GH',
    name: 'Ghana',
    states: [
      { code: 'AA', name: 'Greater Accra', cities: ['Accra', 'Tema', 'Madina', 'Osu', 'Dansoman'] },
      { code: 'AH', name: 'Ashanti', cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Konongo', 'Mampong'] },
    ],
  },
  {
    code: 'MA',
    name: 'Morocco',
    states: [
      { code: 'CAS', name: 'Casablanca-Settat', cities: ['Casablanca', 'Mohammedia', 'El Jadida', 'Settat', 'Berrechid'] },
      { code: 'RMT', name: 'Rabat-Salé-Kénitra', cities: ['Rabat', 'Salé', 'Kénitra', 'Temara', 'Skhirat'] },
      { code: 'MRS', name: 'Marrakech-Safi', cities: ['Marrakech', 'Safi', 'Essaouira', 'El Kelaa', 'Youssoufia'] },
    ],
  },

  // ==================== OCEANIA ====================
  {
    code: 'AU',
    name: 'Australia',
    states: [
      { code: 'NSW', name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland', 'Coffs Harbour', 'Wagga Wagga'] },
      { code: 'VIC', name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Mildura', 'Warrnambool'] },
      { code: 'QLD', name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Mackay'] },
      { code: 'WA', name: 'Western Australia', cities: ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury', 'Geraldton'] },
      { code: 'SA', name: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta'] },
      { code: 'TAS', name: 'Tasmania', cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston'] },
      { code: 'NT', name: 'Northern Territory', cities: ['Darwin', 'Alice Springs', 'Palmerston', 'Katherine', 'Nhulunbuy'] },
      { code: 'ACT', name: 'Australian Capital Territory', cities: ['Canberra', 'Belconnen', 'Tuggeranong', 'Gungahlin', 'Woden Valley'] },
    ],
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    states: [
      { code: 'AKL', name: 'Auckland', cities: ['Auckland', 'Manukau', 'North Shore', 'Waitakere', 'Papakura'] },
      { code: 'WGN', name: 'Wellington', cities: ['Wellington', 'Lower Hutt', 'Upper Hutt', 'Porirua', 'Kapiti Coast'] },
      { code: 'CAN', name: 'Canterbury', cities: ['Christchurch', 'Timaru', 'Ashburton', 'Rangiora', 'Rolleston'] },
      { code: 'WKO', name: 'Waikato', cities: ['Hamilton', 'Tauranga', 'Rotorua', 'Taupo', 'Cambridge'] },
    ],
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}

export function getCountryByName(name: string): Country | undefined {
  return countries.find(c => c.name === name);
}

export function getStatesByCountry(countryCode: string): State[] {
  const country = getCountryByCode(countryCode);
  return (country?.states || []).slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getStatesByCountryName(countryName: string): State[] {
  const country = getCountryByName(countryName);
  return (country?.states || []).slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getCitiesByState(countryCode: string, stateCode: string): string[] {
  const states = getStatesByCountry(countryCode);
  const state = states.find(s => s.code === stateCode);
  return (state?.cities || []).slice().sort((a, b) => a.localeCompare(b));
}

export function getCitiesByStateName(countryName: string, stateName: string): string[] {
  const country = getCountryByName(countryName);
  const state = country?.states.find(s => s.name === stateName);
  return (state?.cities || []).slice().sort((a, b) => a.localeCompare(b));
}

export function getAllCountryNames(): string[] {
  return countries.map(c => c.name).sort((a, b) => a.localeCompare(b));
}

// Country flag emojis mapping
export const countryFlags: Record<string, string> = {
  'United States': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'United Kingdom': '🇬🇧',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Spain': '🇪🇸',
  'Italy': '🇮🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Poland': '🇵🇱',
  'Sweden': '🇸🇪',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Finland': '🇫🇮',
  'Ireland': '🇮🇪',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴',
  'Hungary': '🇭🇺',
  'Ukraine': '🇺🇦',
  'Russia': '🇷🇺',
  'Turkey': '🇹🇷',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭',
  'Vietnam': '🇻🇳',
  'Thailand': '🇹🇭',
  'Malaysia': '🇲🇾',
  'Singapore': '🇸🇬',
  'Taiwan': '🇹🇼',
  'Hong Kong': '🇭🇰',
  'Pakistan': '🇵🇰',
  'Bangladesh': '🇧🇩',
  'Sri Lanka': '🇱🇰',
  'Nepal': '🇳🇵',
  'Australia': '🇦🇺',
  'New Zealand': '🇳🇿',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Colombia': '🇨🇴',
  'Chile': '🇨🇱',
  'Peru': '🇵🇪',
  'Venezuela': '🇻🇪',
  'Ecuador': '🇪🇨',
  'South Africa': '🇿🇦',
  'Nigeria': '🇳🇬',
  'Egypt': '🇪🇬',
  'Kenya': '🇰🇪',
  'Morocco': '🇲🇦',
  'Ghana': '🇬🇭',
  'Ethiopia': '🇪🇹',
  'Tanzania': '🇹🇿',
  'Saudi Arabia': '🇸🇦',
  'UAE': '🇦🇪',
  'Israel': '🇮🇱',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Jordan': '🇯🇴',
  'Lebanon': '🇱🇧',
  'Qatar': '🇶🇦',
  'Kuwait': '🇰🇼',
  'Bahrain': '🇧🇭',
  'Oman': '🇴🇲'
};
