
import { CAT_URL, DOG_URL, FOX_URL } from '../data/constants/constant';


/*
1. The function takes an array as an argument.
2. It returns a new array that is the same as the argument array, but with its elements shuffled.
3. It uses the `Math.random()` function to generate a random number between 0 and 1.
4. It uses the `-0.5` to make the random number range from -0.5 to 0.5.
5. It uses the `sort()` method to sort the array.
6. It uses the `function()` part to create a function that returns a random number.
7. It uses the `return` keyword to return the new array.
*/
function shuffleArray(array: string[]) {
  return array.sort(function () {
    return Math.random() - 0.5;
  });
}

/*
  1. It creates a promise array called promiseCallApi.
  2. It pushes the fetch() function to the promiseCallApi array.
  3. It creates a variable called ApiCalled and sets it to 0.
  4. It creates a while loop that will run as long as ApiCalled is less than 4.
  5. Inside the while loop, it pushes the fetch() function to the promiseCallApi array.
  6. It increments ApiCalled by 1.
  7. It returns promiseCallApi.
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