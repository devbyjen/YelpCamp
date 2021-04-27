const typeLookup = {
    'MIL': 'Military',
    'NP': "National Park",
    'NM': 'National Monument',
    'CNP': 'Canadian National Park',
    'NF': 'National Forest',
    'BLM': 'US Bureau of Land Management',
    'USFW': 'US Fish and Wildlife',
    'BOR': 'US Bureau of Reclamation',
    'COE': 'US Corps of Engineers',
    'TVA': 'Tennessee Valley Auth.',
    'SP': 'State Park',
    'PP': 'Canadian Provincial Park',
    'SRA': 'State Recreation Area',
    'SPR': 'State Preserve',
    'SB': 'State Beach',
    'SF': 'State Forest',
    'SFW': 'State Fish and Wildlife',
    'CP': 'County/City/Regional Park',
    'AUTH': 'Authority'
};
module.exports.typeLookup = typeLookup;

const amenitiesPrettify =  (a) => {
    let amenities = '';
    let data = a.split(' ');
    for(let d of data) {
        switch(d) {
            case 'NH':
                amenities += 'No RV hookups. \n';
                break;
           
            case 'E':
                amenities += 'RV: Electric hookups available \n';
                break;
           
            case 'WE':
                amenities += 'RV: Water and Electric hookups available. \n';
                break;
           
            case 'WES':
                amenities += 'RV: Water, Electric, and Sewer hookups available. \n';
                break;
           
           
            case 'DP':
                amenities += 'RV: Sanitary dump available. \n';
                break;
           
           
            case 'FT':
                amenities += 'Flushing toilets. \n';
                break;
           
           
            case 'VT':
                amenities += 'Vault toilets. \n';
                break;
           
           
            case 'FTVT':
                amenities += 'Mixed flush and vault toilets. \n';
                break;
           
           
            case 'PT':
                amenities += 'Pit toilets. \n';
                break;
           
           
            case 'NT':
                amenities += 'No toilets available. \n';
                break;
           
           
            case 'DW':
                amenities += 'Drinking water at campground. \n';
                break;
           
           
            case 'NW':
                amenities += 'No drinking water (bring your own!). \n';
                break;
           
           
            case 'SH':
                amenities += 'Showers available. \n';
                break;
           
           
            case 'RS':
                amenities += 'Accepts reservations. \n';
                break;
           
           
            case 'NR':
                amenities += 'No reservations. \n';
                break;
           
           
            case 'PA':
                amenities += 'Pets Allowed. \n';
                break;
           
           
            case 'NP':
                amenities += 'No pets allowed. \n';
                break;
           
           
            case 'L$':
                amenities += 'Under $12 (or free). \n';
                break;
            
        }
    }
    return amenities;
}
module.exports.amenitiesPrettify = amenitiesPrettify;

const getDescriptionString = (data) => {
    let description = '';
    if(data.distance && data.bearing && data.city){
        description += `${data.distance} miles ${data.bearing} of ${data.city}.\n\n`;
    }
    if(data.comments) {
        description += `Comments: ${data.comments}\n\n`;
    }
    if(data.type) {
        description += `Campground Type: ${typeLookup[data.type]}\n`;
    }
    if(data.phone) {
        description += `Phone Number: ${data.phone}\n`;
    }
    if(data.dates) {
        description += `Dates: ${data.dates}\n`;
    }
    if(data.number) {
        description += `Number of Campsites: ${data.number}\n`;
    }
    if(data.elevation) {
        description += `Elevation: ${data.elevation}\n`;
    }
    if(data.amenities) {
        description += 'Amenities:\n' + amenitiesPrettify(data.amenities);
    }
    return description;
}

module.exports.getDescriptionString = getDescriptionString;

const getJSONArray = async(path, csv) => {
    return await csv({
        noheader: true,
        headers: ['longitude','latitude', 'composite', 'code', 'name', 'type', 'phone', 'dates', 'comments', 'number', 'elevation', 'amenities', 'state', 'distance', 'bearing', 'city']
    }).fromFile(path);
};

module.exports.getJSONArray = getJSONArray;