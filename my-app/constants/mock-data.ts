export const emergencyStatus = {
    level: 'warning', // 'safe', 'warning', 'danger', 'unknown'
    message: "Tropical storm approaching. Stay alert for updates.",
    lastUpdated: new Date().toISOString(),
    activeIncidents: 3,
  };
  
  export const weatherData = {
    temperature: 28,
    pressure: 1008, // hPa
    humidity: 75,
    wind: {
      speed: 45, // km/h
      direction: 'NE',
    },
    visibility: 5, // km
    precipitation: 80, // %
    forecast: [
      { day: 'Today', high: 29, low: 24, condition: 'storm' },
      { day: 'Tomorrow', high: 27, low: 23, condition: 'rain' },
      { day: 'Wed', high: 26, low: 22, condition: 'cloudy' },
      { day: 'Thu', high: 28, low: 23, condition: 'partlyCloudy' },
      { day: 'Fri', high: 30, low: 24, condition: 'sunny' },
    ]
  };
  
  export const userLocation = {
    name: "Downtown Miami",
    coordinates: {
      latitude: 25.7617,
      longitude: -80.1918
    },
    riskLevel: "moderate", // low, moderate, high, extreme
    evacuationZone: "B",
    nearestShelters: [
      { name: "Miami Central High School", distance: 2.3, capacity: "Available" },
      { name: "Downtown Community Center", distance: 3.1, capacity: "Limited" },
      { name: "Riverside Emergency Shelter", distance: 4.5, capacity: "Full" },
    ]
  };
  
  export const emergencyContacts = [
    {
      id: '1',
      name: 'Emergency Response Center',
      number: '911',
      category: 'emergency',
      location: {
        latitude: 25.7617,
        longitude: -80.1918,
        address: '123 Emergency St, Miami, FL'
      }
    },
    {
      id: '2',
      name: 'Local Police Department',
      number: '555-0123',
      category: 'security',
      location: {
        latitude: 25.7651,
        longitude: -80.1996,
        address: '456 Police Ave, Miami, FL'
      }
    },
    {
      id: '3',
      name: 'Fire Department',
      number: '305-555-1234',
      category: 'emergency',
      location: {
        latitude: 25.7689,
        longitude: -80.1896,
        address: '789 Fire Station Rd, Miami, FL'
      }
    },
    {
      id: '4',
      name: 'Poison Control',
      number: '800-222-1222',
      category: 'medical',
      location: {
        latitude: 25.7505,
        longitude: -80.2273,
        address: '321 Medical Center Blvd, Miami, FL'
      }
    },
    {
      id: '5',
      name: 'Local Hospital',
      number: '305-555-4567',
      category: 'medical',
      location: {
        latitude: 25.7616,
        longitude: -80.1905,
        address: '555 Hospital Drive, Miami, FL'
      }
    },
    {
      id: '6',
      name: 'Disaster Management Office',
      number: '305-555-7100',
      category: 'emergency',
      location: {
        latitude: 25.7712,
        longitude: -80.2384,
        address: '888 Emergency Management Way, Miami, FL'
      }
    },
    {
      id: '7',
      name: 'Coast Guard',
      number: '305-555-8900',
      category: 'security',
      location: {
        latitude: 25.7741,
        longitude: -80.1817,
        address: '777 Coast Guard Station, Miami Beach, FL'
      }
    },
    {
      id: '8',
      name: 'Power Outage Reporting',
      number: '800-555-3333',
      category: 'utilities',
      location: {
        latitude: 25.7689,
        longitude: -80.2384,
        address: '444 Utility Road, Miami, FL'
      }
    },
    {
      id: '9',
      name: 'Water Service',
      number: '305-555-2222',
      category: 'utilities',
      location: {
        latitude: 25.7505,
        longitude: -80.1918,
        address: '222 Water Works Ave, Miami, FL'
      }
    },
    {
      id: '10',
      name: 'Gas Company',
      number: '305-555-1111',
      category: 'utilities',
      location: {
        latitude: 25.7617,
        longitude: -80.2273,
        address: '111 Gas Company Blvd, Miami, FL'
      }
    }
  ];
  
  export const alertsData = [
    {
      id: '1',
      title: 'Tropical Storm Warning',
      message: 'Tropical Storm Alex approaching. Expected to make landfall in 24 hours.',
      severity: 'warning',
      time: '2 hours ago',
    },
    {
      id: '2',
      title: 'Flash Flood Alert',
      message: 'Heavy rainfall expected. Potential for flash flooding in low-lying areas.',
      severity: 'warning',
      time: '3 hours ago',
    },
    {
      id: '3',
      title: 'Evacuation Order: Zone A',
      message: 'Mandatory evacuation for Zone A residents. Shelters open at 6 PM.',
      severity: 'danger',
      time: '5 hours ago',
    },
    {
      id: '4',
      title: 'Power Outages Reported',
      message: 'Multiple power outages in the eastern district. Crews dispatched.',
      severity: 'info',
      time: '6 hours ago',
    },
    {
      id: '5',
      title: 'Road Closure Update',
      message: 'I-95 southbound closed due to flooding between exits 10-15.',
      severity: 'info',
      time: '8 hours ago',
    },
  ];
  
  export const checklistItems = [
    { id: '1', title: 'Emergency Kit', description: 'Prepare a basic emergency kit', completed: true },
    { id: '2', title: 'Evacuation Plan', description: 'Create a family evacuation plan', completed: true },
    { id: '3', title: 'Important Documents', description: 'Secure important documents in waterproof container', completed: false },
    { id: '4', title: 'Emergency Contacts', description: 'Update list of emergency contacts', completed: true },
    { id: '5', title: 'Food and Water', description: 'Stock non-perishable food and water for 3 days', completed: false },
    { id: '6', title: 'Medications', description: 'Ensure adequate supply of necessary medications', completed: false },
    { id: '7', title: 'Battery Backup', description: 'Check flashlights and radio batteries', completed: true },
    { id: '8', title: 'Pet Supplies', description: 'Prepare emergency supplies for pets', completed: false },
    { id: '9', title: 'Fuel', description: 'Keep vehicle fuel tanks at least half full', completed: true },
    { id: '10', title: 'Cash Reserve', description: 'Keep small bills and coins on hand', completed: false },
  ];
  
  export const resourcesData = [
    { id: '1', title: 'Hurricane Preparedness Guide', type: 'pdf', url: 'https://example.com/hurricane-guide.pdf' },
    { id: '2', title: 'Evacuation Routes Map', type: 'map', url: 'https://example.com/evacuation-map' },
    { id: '3', title: 'FEMA Disaster Assistance', type: 'link', url: 'https://www.fema.gov/assistance' },
    { id: '4', title: 'Emergency Shelter Locations', type: 'list', url: 'https://example.com/shelters' },
    { id: '5', title: 'First Aid Procedures', type: 'pdf', url: 'https://example.com/first-aid.pdf' },
    { id: '6', title: 'Weather Radar', type: 'tool', url: 'https://example.com/weather-radar' },
    { id: '7', title: 'Disaster Recovery Resources', type: 'link', url: 'https://example.com/recovery' },
    { id: '8', title: 'Emergency Alert System', type: 'info', url: 'https://example.com/alerts' },
  ];
  
  export const governmentDirectives = [
    {
      id: '1',
      title: 'Mandatory Evacuation',
      description: 'All residents in Zone A must evacuate immediately. Shelters are open at designated locations.',
      authority: 'Miami-Dade Emergency Management',
      status: 'active', // active, expired, scheduled
      issuedAt: '2023-09-15T08:00:00Z',
      expiresAt: '2023-09-17T20:00:00Z',
    },
    {
      id: '2',
      title: 'Curfew in Effect',
      description: 'A curfew is in effect from 10 PM to 6 AM for all areas south of 79th Street.',
      authority: 'Mayor\'s Office',
      status: 'active',
      issuedAt: '2023-09-15T15:30:00Z',
      expiresAt: '2023-09-18T06:00:00Z',
    },
    {
      id: '3',
      title: 'Boil Water Advisory',
      description: 'Residents in the following areas should boil water before consumption: Downtown, Brickell, Little Havana.',
      authority: 'Department of Health',
      status: 'active',
      issuedAt: '2023-09-14T18:45:00Z',
      expiresAt: null,
    },
    {
      id: '4',
      title: 'School Closures',
      description: 'All public schools will remain closed until further notice.',
      authority: 'School Board',
      status: 'active',
      issuedAt: '2023-09-14T12:00:00Z',
      expiresAt: '2023-09-19T23:59:59Z',
    },
    {
      id: '5',
      title: 'Bridge Closure',
      description: 'MacArthur Causeway is closed due to high winds. Use alternate routes.',
      authority: 'Department of Transportation',
      status: 'expired',
      issuedAt: '2023-09-13T16:20:00Z',
      expiresAt: '2023-09-15T10:00:00Z',
    },
  ];
  
  export const communityReports = [
    {
      id: '1',
      title: 'Flooding on 2nd Avenue',
      description: 'Street is flooded with approximately 2 feet of water. Not passable by regular vehicles.',
      location: 'NE 2nd Ave & 36th St',
      coordinates: { latitude: 25.7689, longitude: -80.1896 },
      reportedBy: 'John D.',
      reportedAt: '2023-09-15T14:23:00Z',
      upvotes: 12,
      verified: true,
      category: 'flooding',
      images: ['https://images.unsplash.com/photo-1547683905-f686c993aae5'],
    },
    {
      id: '2',
      title: 'Downed Power Lines',
      description: 'Multiple power lines down across the road. Area is dangerous.',
      location: 'Coral Way & 22nd Ave',
      coordinates: { latitude: 25.7505, longitude: -80.2273 },
      reportedBy: 'Maria L.',
      reportedAt: '2023-09-15T13:45:00Z',
      upvotes: 8,
      verified: true,
      category: 'infrastructure',
      images: ['https://images.unsplash.com/photo-1642991142194-a4a9e2c4c681'],
    },
    {
      id: '3',
      title: 'Tree Blocking Road',
      description: 'Large oak tree has fallen and is completely blocking the street.',
      location: 'Brickell Ave & 15th Rd',
      coordinates: { latitude: 25.7616, longitude: -80.1905 },
      reportedBy: 'Robert K.',
      reportedAt: '2023-09-15T12:10:00Z',
      upvotes: 5,
      verified: false,
      category: 'obstruction',
      images: ['https://images.unsplash.com/photo-1517660029921-0cbea2f15f8f'],
    },
    {
      id: '4',
      title: 'Gas Station with Fuel',
      description: 'Shell station on Flagler has fuel available. No long lines currently.',
      location: 'Flagler St & 27th Ave',
      coordinates: { latitude: 25.7712, longitude: -80.2384 },
      reportedBy: 'Sarah M.',
      reportedAt: '2023-09-15T11:30:00Z',
      upvotes: 15,
      verified: false,
      category: 'resources',
      images: [],
    },
    {
      id: '5',
      title: 'Grocery Store Open',
      description: 'Publix on Biscayne is open with limited supplies. Water and bread available.',
      location: 'Biscayne Blvd & 36th St',
      coordinates: { latitude: 25.7689, longitude: -80.1896 },
      reportedBy: 'David P.',
      reportedAt: '2023-09-15T10:15:00Z',
      upvotes: 20,
      verified: true,
      category: 'resources',
      images: [],
    },
  ];