'use strict';

const apiKey = '6oSbf0uaUO04ZpsLyCscbsp0tdSoML53NYn1ME9B'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  if (responseJson.total === 0){
    throw new Error('No parks in that state, or wrong state code');
  }
  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href="${responseJson.data[i].url}"target="_blank">${responseJson.data[i].url}</a>
      </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
};

function getYouTubeVideos(stateCode, limit=10) {
  const params = {
    api_key: apiKey,
    stateCode,
    limit,
    start: 0
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#results').toggleClass('hidden');
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    $('#js-error-message').empty();
    const stateCode = $('#js-state-code').val();
    const limit = $('#js-limit').val();
    getYouTubeVideos(stateCode, limit);
    $('#js-state-code, textarea').val('');
  });
}

$(watchForm);