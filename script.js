const newPartyForm = document.querySelector('#new-party-form');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
   
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    console.log(party)
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  try {
   
 const response  = await fetch(`${PARTIES_API_URL}/${id}`, {method:"DELETE"});
 const party = await response.json();
 return response;
  }catch(error) {
    console.log(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    
    // fetch party details from server
    const party = await getPartyById(id);
    console.log(party)
    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();
     
    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();
    
    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party-details');
    partyDetailsElement.innerHTML = `
            <h2>${party.date}</h2>
            <p>${party.description}</p>
            <p>${party.id}</p>
            <p>${party.location}</p>
            <p>${party.name}</p>
            <p>${party.time}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join('')}
          </ul>
          


            <button class="close-button">Close</button>
        `;
    partyContainer.prepend(partyDetailsElement);

    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
      // init()
      
      toggleParties = 'block';
 //this will be done by changing the syle again
    });
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = '';
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyContainer.appendChild(partyElement);
      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
         const partyById = event.target.dataset.id;
         //invoke the function
         const detailsBtn = await renderSinglePartyById(partyById)
        
        // your code here
      });
      // delete party
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        const partyID = event.target.dataset.id;
        //invoke the function
        const response = await deleteParty(partyID) 
        if(response.status === 200) {
          partyElement.remove()
          
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};



// init function
const init = async () => {
  // your code here
  const parties = await getAllParties(); 
  await renderParties(parties)
  console.log(parties)
};

init();
// function toggleParties(displayVal){
//   const partyElements = document.getElementsByClassName('party');
//   console.log(partyElements);
//   for(const partyElement of partyElements){ //this is  for loop
//     partyElement.style.display = displayVal;
//   }
// }
