
import { CAT_URL, DOG_URL, FOX_URL } from '../data/constants/constant';


/*
  Shuffle an array to place fox image at random position
*/
function shuffleArray(array: string[]) {
  return array.sort(function () {
    return Math.random() - 0.5;
  });
}

/*
   Fetch Data from multiple end point to get images of dog, cat & fox
  */
async function getDataFromImageUrl() {

  let imageUrls: string[] = [];
  const fetchWolfImage = fetch(FOX_URL);
  let promiseCallApi = [];
  let ApiCalled = 0;
  let imageUrlsData = []
  try {
    while (ApiCalled < 4) {
      promiseCallApi
        .push(
          fetch(CAT_URL),
          fetch(DOG_URL)
        )
      ApiCalled += 1
    }
    promiseCallApi.push(fetchWolfImage);
    const awaitForPromise = await Promise.all(promiseCallApi);
    const getResponseFromAllApi = await Promise.all(
      awaitForPromise.map((res) => res.json())
    )
    imageUrlsData = getResponseFromAllApi
      .flat()
      .map((data) => data.message || data.image || data.url);
  } catch (e) {
    console.error(e);
  }
  imageUrls = [...imageUrls, ...imageUrlsData];

  if (imageUrls.length > 1) { shuffleArray(imageUrls); }
  return imageUrls

}
/*
    It fetches data from the API and returns the data.
*/
const fetchData = async () => {
  let data = await getDataFromImageUrl();
  if (data && data?.length < 9) {
    data = []
  }
  return data
};


export { fetchData, shuffleArray };