// Location data for SoloRank

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
  {
    code: 'US',
    name: 'United States',
    states: [
      { code: 'CA', name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'] },
      { code: 'NY', name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'] },
      { code: 'TX', name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'] },
      { code: 'FL', name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'] },
      { code: 'WA', name: 'Washington', cities: ['Seattle', 'Tacoma', 'Spokane', 'Bellevue', 'Vancouver'] },
      { code: 'IL', name: 'Illinois', cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford'] },
      { code: 'PA', name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'] },
      { code: 'OH', name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
      { code: 'GA', name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'] },
      { code: 'NC', name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
    ],
  },
  {
    code: 'IN',
    name: 'India',
    states: [
      { code: 'MH', name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'] },
      { code: 'KA', name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'] },
      { code: 'TN', name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
      { code: 'DL', name: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'] },
      { code: 'UP', name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'] },
      { code: 'WB', name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'] },
      { code: 'GJ', name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'] },
      { code: 'RJ', name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'] },
    ],
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    states: [
      { code: 'ENG', name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] },
      { code: 'SCT', name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
      { code: 'WLS', name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry'] },
      { code: 'NIR', name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Bangor'] },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    states: [
      { code: 'TK', name: 'Tokyo', cities: ['Shibuya', 'Shinjuku', 'Akihabara', 'Ginza', 'Roppongi'] },
      { code: 'OS', name: 'Osaka', cities: ['Osaka City', 'Sakai', 'Higashiosaka', 'Hirakata', 'Toyonaka'] },
      { code: 'KY', name: 'Kyoto', cities: ['Kyoto City', 'Uji', 'Maizuru', 'Kameoka', 'Nagaokakyo'] },
      { code: 'HK', name: 'Hokkaido', cities: ['Sapporo', 'Hakodate', 'Asahikawa', 'Otaru', 'Kushiro'] },
    ],
  },
  {
    code: 'KR',
    name: 'South Korea',
    states: [
      { code: 'SEL', name: 'Seoul', cities: ['Gangnam', 'Hongdae', 'Myeongdong', 'Itaewon', 'Jongno'] },
      { code: 'BS', name: 'Busan', cities: ['Haeundae', 'Seomyeon', 'Nampo', 'Gwangalli', 'Centum City'] },
      { code: 'IC', name: 'Incheon', cities: ['Songdo', 'Bupyeong', 'Namdong', 'Yeonsu', 'Gyeyang'] },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    states: [
      { code: 'BY', name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Ingolstadt'] },
      { code: 'BE', name: 'Berlin', cities: ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Charlottenburg', 'Friedrichshain'] },
      { code: 'HE', name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach'] },
    ],
  },
  {
    code: 'BR',
    name: 'Brazil',
    states: [
      { code: 'SP', name: 'São Paulo', cities: ['São Paulo City', 'Campinas', 'Santos', 'Guarulhos', 'Osasco'] },
      { code: 'RJ', name: 'Rio de Janeiro', cities: ['Rio de Janeiro City', 'Niterói', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis'] },
      { code: 'MG', name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'] },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      { code: 'ON', name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'] },
      { code: 'BC', name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'] },
      { code: 'QC', name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'] },
      { code: 'AB', name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'] },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    states: [
      { code: 'NSW', name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland'] },
      { code: 'VIC', name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton'] },
      { code: 'QLD', name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns'] },
    ],
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code);
}

export function getStatesByCountry(countryCode: string): State[] {
  const country = getCountryByCode(countryCode);
  return country?.states || [];
}

export function getCitiesByState(countryCode: string, stateCode: string): string[] {
  const states = getStatesByCountry(countryCode);
  const state = states.find(s => s.code === stateCode);
  return state?.cities || [];
}
